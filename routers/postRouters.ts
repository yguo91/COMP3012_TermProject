import express, { Request, Response } from "express";
import * as database from "../controller/postController";
import * as db from "../db";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { createPostValidation, editPostValidation, postIdValidation } from "../middleware/validators/postValidators";
import { createCommentValidation } from "../middleware/validators/commentValidators";
import { voteValidation } from "../middleware/validators/voteValidators";
import { handleValidationErrors } from "../middleware/validators/handleValidationErrors";

router.get("/", async (req, res) => {
  const posts = await database.getPosts(20);
  const user = req.user;

  // Get vote totals and user votes for each post
  const postsWithVotes = await Promise.all(
    posts.map(async (post) => {
      const voteTotal = await db.getVoteTotalForPost(post.id);
      const userVote = user ? await db.getVoteForUserPost(user.id, post.id) : null;
      return {
        ...post,
        voteTotal,
        userVote: userVote?.value || 0,
      };
    })
  );

  res.render("posts", { posts: postsWithVotes, user });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts", { mode: "create" });
});

router.post(
  "/create",
  ensureAuthenticated,
  createPostValidation,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    // Get form data from request body
    const { title, link, description, subgroup } = req.body;

    // Get the logged-in user's ID (guaranteed by ensureAuthenticated middleware)
    const creatorId = req.user!.id;

    // Create the post in the database
    const newPost = await db.addPost(
      title,
      link || "", // link is optional, default to empty string
      creatorId,
      description,
      subgroup || "general" // if no subgroup provided, use "general"
    );

    // Redirect to the newly created post
    res.redirect(`/posts/show/${newPost.id}`);
  }
);

router.get("/show/:postid", async (req, res) => {
  // Get the post ID from the URL parameter
  const postId = parseInt(req.params.postid);

  // Fetch the post with all related data (creator, comments, votes)
  const post = await db.getPost(postId);

  // Get the current user (if logged in)
  const user = req.user;

  // Get vote total and user's vote on this post
  const voteTotal = await db.getVoteTotalForPost(postId);
  const userVote = user ? await db.getVoteForUserPost(user.id, postId) : null;

  // Render the view with the post data
  res.render("individualPost", {
    post,
    user,
    voteTotal,
    userVote: userVote?.value || 0
  });
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  const postId = parseInt(req.params.postid);
  const post = await db.getPost(postId);
  if(!post){
    return res.status(404).send("Post not found");
  }

  // User is guaranteed by ensureAuthenticated middleware
  const user = req.user!;
  if(post.creator.id !== user.id){
    return res.status(403).send("You are not authorized to edit this post");
  }
  res.render("createPosts", { post, user, mode: "edit" });
});

router.post(
  "/edit/:postid",
  ensureAuthenticated,
  editPostValidation,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postid);
    const { title, link, description, subgroup } = req.body;

    // Fetch the post to check ownership
    const post = await db.getPost(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const user = req.user;
    if (!user || user.id !== post.creatorId) {
      return res.status(403).send("You are not allowed to edit this post.");
    }

    // Update the post (adjust to match your db helper)
    await db.updatePost(
      postId,
      title,
      link || "",
      description,
      subgroup || "general"
    );

    // Redirect back to the post page
    res.redirect(`/posts/show/${postId}`);
  }
);

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  const postId = parseInt(req.params.postid);
  const post = await db.getPost(postId);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  const user = req.user;
  if (!user || user.id !== post.creatorId) {
    return res.status(403).send("You are not allowed to delete this post.");
  }

  res.render("deleteConfirmPost", { post, user });
});

router.post(
  "/delete/:postid",
  ensureAuthenticated,
  postIdValidation,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postid);

    // Make sure the post exists & user owns it
    const post = await db.getPost(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const user = req.user;
    if (!user || user.id !== post.creatorId) {
      return res.status(403).send("You are not allowed to delete this post.");
    }

    // Delete from DB
    await db.deletePost(postId);

    // Redirect to homepage after deletion
    res.redirect("/posts");
  }
);

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  createCommentValidation,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postid);

    const { description } = req.body;

    // User is guaranteed by ensureAuthenticated middleware
    const creatorId = req.user!.id;

    // Add the comment to the database
    await db.addComment(postId, creatorId, description);

    // Redirect back to the post page
    res.redirect(`/posts/show/${postId}`);
  }
);

router.post(
  "/vote/:postid",
  ensureAuthenticated,
  voteValidation,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postid);
    const { setvoteto } = req.body;

    // Convert vote value to number (already validated and converted by middleware)
    const voteValue = parseInt(setvoteto);

    // Get the logged-in user's ID (guaranteed by ensureAuthenticated middleware)
    const userId = req.user!.id;

    // Add/update the vote in the database
    await db.addVote(userId, postId, voteValue);

    // Redirect back to where the user came from, or to the post page
    const referer = req.get("Referer") || `/posts/show/${postId}`;
    res.redirect(referer);
  }
);

export default router;

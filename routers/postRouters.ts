// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
import * as db from "../db";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";

router.get("/", async (req, res) => {
  const posts = await database.getPosts(20);
  const user = await req.user;
  res.render("posts", { posts, user });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts");
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  // Get form data from request body
  const { title, link, description, subgroup } = req.body;

  // Get the logged-in user's ID
  const creatorId = req.user.id;

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
});

router.get("/show/:postid", async (req, res) => {
  // Get the post ID from the URL parameter
  const postId = parseInt(req.params.postid);

  // Fetch the post with all related data (creator, comments, votes)
  const post = await db.getPost(postId);

  // Get the current user (if logged in)
  const user = req.user;

  // Render the view with the post data
  res.render("individualPost", { post, user });
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // ⭐ TODO
  }
);

export default router;

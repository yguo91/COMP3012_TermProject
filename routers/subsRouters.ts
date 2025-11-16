import express from "express";
import * as database from "../controller/postController";
import * as db from "../db";
const router = express.Router();

router.get("/list", async (req, res) => {
  // Fetch all unique subgroups from the database
  const subs = await db.getSubs();
  res.render("subs", { subs });
});

router.get("/show/:subname", async (req, res) => {
  // Get the subgroup name from URL params
  const subname = req.params.subname;

  // Fetch posts for this specific subgroup (limit to 50 posts)
  const posts = await database.getPosts(50, subname);

  // Get current user (if logged in)
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

  res.render("sub", { posts: postsWithVotes, subname, user });
});

export default router;

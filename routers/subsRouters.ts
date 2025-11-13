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

  res.render("sub", { posts, subname, user });
});

export default router;

import { PrismaClient, Post } from "@prisma/client";
const prisma = new PrismaClient();

// Keep the same API as fake-db.ts

// Type for partial post updates
interface PostUpdateData {
  title?: string;
  link?: string;
  description?: string;
  subgroup?: string;
}

export async function getUser(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByUsername(uname: string) {
  return prisma.user.findUnique({ where: { uname } });
}

export async function getVotesForPost(post_id: number) {
  return prisma.vote.findMany({ where: { postId: post_id } });
}

export async function decoratePost(post: Post) {
  const full = await prisma.post.findUnique({
    where: { id: post.id },
    include: {
      creator: true,
      votes: true,
      comments: { include: { creator: true } },
    },
  });
  return full;
}

/** @param n how many posts (default 5) @param sub subgroup (optional) */
export async function getPosts(n = 5, sub?: string) {
  return prisma.post.findMany({
    where: sub ? { subgroup: sub } : undefined,
    orderBy: { timestamp: "desc" },
    take: n,
  });
}

export async function getPost(id: number) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      creator: true,
      votes: true,
      comments: { include: { creator: true } },
    },
  });
}

export async function addPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string
) {
  return prisma.post.create({
    data: {
      id: (await nextPostId()),
      title,
      link,
      description,
      creatorId: Number(creator),
      subgroup,
      timestamp: new Date(),
    },
  });
}

async function nextPostId() {
  const last = await prisma.post.findFirst({ orderBy: { id: "desc" } });
  return (last?.id ?? 100) + 1;
}

export async function editPost(post_id: number, changes: PostUpdateData = {}) {
  const data: PostUpdateData = {};
  if (changes.title) data.title = changes.title;
  if (changes.link) data.link = changes.link;
  if (changes.description) data.description = changes.description;
  if (changes.subgroup) data.subgroup = changes.subgroup;
  await prisma.post.update({ where: { id: post_id }, data });
}

export async function updatePost(
  post_id: number,
  title: string,
  link: string,
  description: string,
  subgroup: string
) {
  return prisma.post.update({
    where: { id: post_id },
    data: {
      title,
      link,
      description,
      subgroup,
    },
  });
}

export async function deletePost(post_id: number) {
  // cascade manually where needed because of relations
  await prisma.comment.deleteMany({ where: { postId: post_id } });
  await prisma.vote.deleteMany({ where: { postId: post_id } });
  await prisma.post.delete({ where: { id: post_id } });
}

export async function getSubs() {
  const rows = await prisma.post.findMany({
    select: { subgroup: true },
    distinct: ["subgroup"],
  });
  return rows.map((r) => r.subgroup);
}

export async function addComment(post_id: number, creator: number, description: string) {
  const nextId = await nextCommentId();
  return prisma.comment.create({
    data: {
      id: nextId,
      postId: Number(post_id),
      creatorId: Number(creator),
      description,
      timestamp: new Date(),
    },
    include: { creator: true },
  });
}

async function nextCommentId() {
  const last = await prisma.comment.findFirst({ orderBy: { id: "desc" } });
  return (last?.id ?? 9000) + 1;
}

// ========== VOTING FUNCTIONS ==========

/**
 * Add or update a vote for a post by a user
 * @param userId - The ID of the user voting
 * @param postId - The ID of the post being voted on
 * @param value - The vote value: +1 (upvote), -1 (downvote), or 0 (remove vote)
 */
export async function addVote(userId: number, postId: number, value: number) {
  // If value is 0, delete the vote (user is canceling their vote)
  if (value === 0) {
    await prisma.vote.deleteMany({
      where: {
        userId: userId,
        postId: postId,
      },
    });
    return;
  }

  // Otherwise, upsert the vote (create if doesn't exist, update if it does)
  await prisma.vote.upsert({
    where: {
      userId_postId: {
        userId: userId,
        postId: postId,
      },
    },
    update: {
      value: value,
    },
    create: {
      userId: userId,
      postId: postId,
      value: value,
    },
  });
}

/**
 * Get a specific user's vote on a specific post
 * @param userId - The ID of the user
 * @param postId - The ID of the post
 * @returns The vote object if exists, null otherwise
 */
export async function getVoteForUserPost(userId: number, postId: number) {
  return prisma.vote.findUnique({
    where: {
      userId_postId: {
        userId: userId,
        postId: postId,
      },
    },
  });
}

/**
 * Calculate the net vote total for a post (upvotes - downvotes)
 * @param postId - The ID of the post
 * @returns The net vote total as a number
 */
export async function getVoteTotalForPost(postId: number) {
  const votes = await prisma.vote.findMany({
    where: { postId: postId },
  });

  // Sum all vote values (positive votes - negative votes)
  return votes.reduce((total, vote) => total + vote.value, 0);
}

// Optional: debug() to print some counts like the old file
export async function debug() {
  const [u, p, c, v] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.vote.count(),
  ]);
  console.log("==== DB DEBUGGING ====");
  console.log({ users: u, posts: p, comments: c, votes: v });
  console.log("==== DB DEBUGGING ====");
}

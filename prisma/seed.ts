import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // users
  const users = [
    { id: 1, uname: "alice",  password: "alpha" },
    { id: 2, uname: "theo",   password: "123"   },
    { id: 3, uname: "prime",  password: "123"   },
    { id: 4, uname: "leerob", password: "123"   },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: u,
      create: u,
    });
  }

  // posts
  const posts = [
    {
      id: 101,
      title: "Mochido opens its new location in Coquitlam this week",
      link: "https://dailyhive.com/vancouver/mochido-coquitlam-open",
      description: "New mochi donut shop, Mochido, is set to open later this week.",
      creatorId: 1,
      subgroup: "food",
      timestamp: new Date(1643648446955),
    },
    {
      id: 102,
      title: "2023 State of Databases for Serverless & Edge",
      link: "https://leerob.io/blog/backend",
      description:
        "An overview of databases that pair well with modern application and compute providers.",
      creatorId: 4,
      subgroup: "coding",
      timestamp: new Date(1642611742010),
    },
  ];
  for (const p of posts) {
    await prisma.post.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }

  // comments
  await prisma.comment.upsert({
    where: { id: 9001 },
    update: {},
    create: {
      id: 9001,
      postId: 102,
      creatorId: 1,
      description: "Actually I learned a lot :pepega:",
      timestamp: new Date(1642691742010),
    },
  });

  // votes
  const votes = [
    { userId: 2, postId: 101, value: +1 },
    { userId: 3, postId: 101, value: +1 },
    { userId: 4, postId: 101, value: +1 },
    { userId: 3, postId: 102, value: -1 },
  ];
  for (const v of votes) {
    await prisma.vote.upsert({
      where: { userId_postId: { userId: v.userId, postId: v.postId } },
      update: { value: v.value },
      create: v,
    });
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});

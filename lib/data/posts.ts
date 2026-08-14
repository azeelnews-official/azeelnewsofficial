import { prisma } from "@/lib/prisma";

export async function getPosts() {
  return prisma.post.findMany({
    where:{
      status:"PUBLISHED"
    },
    orderBy:{
      createdAt:"desc"
    },
    include:{
      author:true,
      category:true
    }
  });
}

export async function getAdminPosts() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      author: true,
    },
  });

  return posts.map((post) => ({
    ...post,
    category: post.category.name,
    author: post.author.name,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));
}

export async function getAdminStats() {
  const totalPosts = await prisma.post.count();

  const publishedPosts = await prisma.post.count({
    where: {
      status: "PUBLISHED",
    },
  });

  const draftPosts = await prisma.post.count({
    where: {
      status: "DRAFT",
    },
  });

  const views = await prisma.post.aggregate({
    _sum: {
      views: true,
    },
  });

  const activeUsers = await prisma.user.count();

  const pendingComments = await prisma.comment.count({
    where: {
      status: "PENDING",
    },
  });

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews: views._sum.views || 0,
    activeUsers,
    pendingComments,
  };
}

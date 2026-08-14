import { prisma } from "@/lib/prisma";

export async function getPosts() {
  return prisma.post.findMany({
    where:{
      published:true
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

import { prisma } from "@/lib/prisma";

export async function getAdminMedia(){

  return prisma.media.findMany({
    orderBy:{
      createdAt:"desc"
    }
  });

}

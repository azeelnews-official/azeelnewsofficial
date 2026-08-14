import { prisma } from "@/lib/prisma";

export async function getAdminPages(){
  return prisma.page.findMany({
    orderBy:{
      updatedAt:"desc"
    }
  });
}

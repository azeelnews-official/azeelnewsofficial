import { prisma } from "@/lib/prisma";

export async function getAdminRedirects(){
  return prisma.redirect.findMany({
    orderBy:{
      id:"desc"
    }
  });
}

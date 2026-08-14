import { prisma } from "@/lib/prisma";

export async function getAdminLogs(){
  return prisma.auditLog.findMany({
    orderBy:{
      createdAt:"desc"
    },
    take:100
  });
}

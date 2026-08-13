
import { prisma } from "@/lib/prisma";

export async function getComments(){
return prisma.comment.findMany({
include:{
author:true,
post:true
},
orderBy:{
createdAt:"desc"
}
});
}

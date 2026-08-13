import { prisma } from "@/lib/prisma";


export async function getComments(){

return prisma.comment.findMany({

orderBy:{
createdAt:"desc"
},

include:{
author:true,
post:true
}

});

}
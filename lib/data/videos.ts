import { prisma } from "@/lib/prisma";


export async function getPublishedVideos(limit:number = 8){

return prisma.video.findMany({

where:{
published:true
},

orderBy:{
createdAt:"desc"
},

take:limit

});

}

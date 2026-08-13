import { prisma } from "@/lib/prisma";


export async function getLiveChannels(){

  return prisma.liveChannel.findMany({
    where:{
      active:true
    },
    orderBy:{
      order:"asc"
    }
  });

}



export async function getLiveSchedule(){

  return prisma.liveSchedule.findMany({
    orderBy:{
      startTime:"asc"
    }
  });

}

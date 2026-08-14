import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(){

const videos = await prisma.video.findMany({
where:{
published:true
},
orderBy:{
createdAt:"desc"
}
});


return NextResponse.json(videos);

}

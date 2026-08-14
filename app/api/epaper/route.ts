import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(
req:Request
){

const {searchParams}=new URL(req.url);

const date=searchParams.get("date");


const edition=await prisma.epaper.findFirst({

where:{
published:true,
...(date && {
editionDate:{
gte:new Date(date+"T00:00:00"),
lt:new Date(date+"T23:59:59")
}
})
},

orderBy:{
editionDate:"desc"
}

});


return NextResponse.json(
edition ?? null
);

}

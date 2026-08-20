
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req:Request){

const form=await req.formData();


await prisma.notification.create({

data:{
title:String(form.get("title")),
titleHi:String(form.get("titleHi")||""),
body:String(form.get("body")),
bodyHi:String(form.get("bodyHi")||"")
}

});


return NextResponse.redirect(
new URL("/admin/notifications",
req.url)
);

}

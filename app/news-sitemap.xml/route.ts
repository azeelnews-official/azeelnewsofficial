import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.azeelnews.in";

function escapeXml(text:string){
  return text
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&apos;");
}

export async function GET(){

const posts = await prisma.post.findMany({

where:{
status:"PUBLISHED",
publishedAt:{
not:null
}
},

orderBy:{
publishedAt:"desc"
},

take:50,

select:{
slug:true,
headline:true,
publishedAt:true
}

});


const urls = posts.map((post)=>`

<url>

<loc>${SITE_URL}/article/${post.slug}</loc>

<news:news>

<news:publication>

<news:name>AZEEL NEWS</news:name>

<news:language>en-IN</news:language>

</news:publication>

<news:publication_date>
${post.publishedAt?.toISOString()}
</news:publication_date>

<news:title>
${escapeXml(post.headline)}
</news:title>

</news:news>

</url>

`).join("");


const xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset 
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">

${urls}

</urlset>`;


return new NextResponse(xml,{
headers:{
"Content-Type":"application/xml; charset=utf-8"
}
});

}

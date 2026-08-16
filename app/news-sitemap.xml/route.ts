import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SITE_URL="https://www.azeelnews.in";

export async function GET(){

const posts = await prisma.post.findMany({

where:{
status:"PUBLISHED",
publishedAt:{
gte:new Date(Date.now()-48*60*60*1000)
}
},

orderBy:{
publishedAt:"desc"
},

take:100,

select:{
slug:true,
headline:true,
publishedAt:true
}

});


const urls = posts.map(post=>`

<url>
<loc>${SITE_URL}/article/${post.slug}</loc>
<news:news>
<news:publication>
<news:name>AZEEL NEWS</news:name>
<news:language>en</news:language>
</news:publication>
<news:publication_date>${post.publishedAt?.toISOString()}</news:publication_date>
<news:title><![CDATA[${post.headline}]]></news:title>
</news:news>
</url>

`).join("");


const xml=`<?xml version="1.0" encoding="UTF-8"?>

<urlset 
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">

${urls}

</urlset>`;


return new NextResponse(xml,{
headers:{
"Content-Type":"application/xml"
}
});

}

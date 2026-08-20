import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

headline:true,
dek:true,
slug:true,
publishedAt:true,

author:{
select:{
name:true
}
},

category:{
select:{
name:true
}
}

}

});


const items = posts.map((post)=>`

<item>

<title>${escapeXml(post.headline)}</title>

<link>${SITE_URL}/article/${post.slug}</link>

<guid isPermaLink="true">${SITE_URL}/article/${post.slug}</guid>

<description>${escapeXml(post.dek || "")}</description>

<pubDate>${post.publishedAt?.toUTCString()}</pubDate>

<author>${escapeXml(post.author.name)}</author>

<category>${escapeXml(post.category?.name || "News")}</category>

</item>

`).join("");


const xml = `<?xml version="1.0" encoding="UTF-8"?>

<rss version="2.0">

<channel>

<title>AZEEL NEWS</title>

<link>${SITE_URL}</link>

<description>
Breaking News, India & World Updates
</description>

<language>en-IN</language>

<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>

${items}

</channel>

</rss>`;


return new NextResponse(xml,{
headers:{
"Content-Type":"application/rss+xml; charset=utf-8"
}
});

}

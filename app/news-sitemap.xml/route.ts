import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(){

const posts = await prisma.post.findMany({

where:{
status:"PUBLISHED"
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

<loc>
https://www.azeelnews.in/article/${post.slug}
</loc>

<news:news>

<news:publication>

<news:name>Azeel News</news:name>

<news:language>en</news:language>

</news:publication>


<news:publication_date>
${new Date(post.publishedAt ?? new Date()).toISOString()}
</news:publication_date>


<news:title>
${post.headline.replace(/&/g,"&amp;")}
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
"Content-Type":"application/xml"
}
});

}

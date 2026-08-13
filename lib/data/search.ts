
import { prisma } from "@/lib/prisma";

export async function searchArticles(query:string){

if(!query.trim()){
return [];
}

const posts = await prisma.post.findMany({

where:{
status:"PUBLISHED",
OR:[
{
headline:{
contains:query,
mode:"insensitive"
}
},
{
dek:{
contains:query,
mode:"insensitive"
}
}
]
},

select:{
id:true,
slug:true,
headline:true,
dek:true,
featuredImageUrl:true,
featuredImageAlt:true,
publishedAt:true,
updatedAt:true,
views:true,

author:{
select:{
name:true,
image:true
}
},

category:{
select:{
slug:true,
name:true
}
}
},

take:5,

orderBy:{
publishedAt:"desc"
}

});


return posts.map((post)=>({

id:post.id,

slug:post.slug,

headline:post.headline,

dek:post.dek,

category:post.category.slug as
  | "india"
  | "world"
  | "politics"
  | "business"
  | "technology"
  | "sports"
  | "entertainment"
  | "health"
  | "explainers",

imageUrl:post.featuredImageUrl,

imageAlt:post.featuredImageAlt ?? post.headline,

featuredImageUrl:post.featuredImageUrl,

featuredImageAlt:post.featuredImageAlt,

author:{
name:post.author.name,
slug:post.author.name
  .toLowerCase()
  .replace(/\s+/g,"-"),
role:"JOURNALIST",
avatarUrl:post.author.image ?? ""
},

publishedAt:post.publishedAt?.toISOString() ?? post.updatedAt.toISOString(),

updatedAt:post.updatedAt.toISOString(),

views:post.views,

readingTimeMin:5,

tags:[],

isLive:false,

isBreaking:false

}));

}


export const trendingSearches = [
"India",
"Technology",
"Business",
"Sports",
"AI"
];

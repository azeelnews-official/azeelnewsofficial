import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import type { Article, CategorySlug } from "@/lib/types";


function createAuthorSlug(name:string){

return name
.toLowerCase()
.trim()
.replace(/[^a-z0-9]+/g,"-")
.replace(/^-+|-+$/g,"");

}



function bodyToParagraphs(body:string){

return body
.split(/\n\s*\n/)
.map((paragraph)=>
paragraph
.replace(/^#{1,6}\s+/gm,"")
.replace(/^\s*[-*]\s+/gm,"")
.replace(/^\s*\d+\.\s+/gm,"")
.trim()
)
.filter(Boolean);

}



export function mapPostToArticle(post:any):Article{

return {

id:post.id,

slug:post.slug,

headline:post.headline,

dek:post.dek,


category:post.category.slug as CategorySlug,


author:{

name:post.author.name,

slug:createAuthorSlug(post.author.name),

role:post.author.role,

avatarUrl:post.author.image ?? "",

},


publishedAt:
(post.publishedAt ?? post.updatedAt).toISOString(),


updatedAt:
post.updatedAt.toISOString(),


readingTimeMin:post.readingTimeMin,


imageUrl:post.featuredImageUrl,

imageAlt:post.featuredImageAlt,


isLive:post.isLive,

isBreaking:post.isBreaking,


views:post.views,


tags:
post.tags.map((item:any)=>item.tag.name),


body:
bodyToParagraphs(post.body),


};

}



const articleSelect = {

id:true,

slug:true,

headline:true,

dek:true,

body:true,

featuredImageUrl:true,

featuredImageAlt:true,

readingTimeMin:true,

views:true,

isBreaking:true,

isLive:true,

publishedAt:true,

updatedAt:true,


author:{

select:{

name:true,

image:true,

role:true,

}

},


category:{

select:{

slug:true,

name:true,

nameHi:true,

}

},


tags:{

select:{

tag:{

select:{

name:true

}

}

}

}

} as const;



const cachedPublishedArticles = unstable_cache(

async(limit:number)=>{


return prisma.post.findMany({

where:{

status:"PUBLISHED",

publishedAt:{
not:null
}

},


select:articleSelect,


orderBy:[

{
publishedAt:"desc"
},

{
createdAt:"desc"
}

],


take:limit,


});


},

["published-articles"],

{
revalidate:60
}

);

const cachedCategoryArticles = unstable_cache(

async(
categorySlug:string,
limit:number
)=>{


return prisma.post.findMany({

where:{

status:"PUBLISHED",

publishedAt:{
not:null
},


category:{

slug:categorySlug

}

},


select:articleSelect,


orderBy:[

{
publishedAt:"desc"
},

{
createdAt:"desc"
}

],


take:limit,


});


},


["category-articles"],

{
revalidate:60
}

);





export async function getPublishedArticles(limit:number = 20){


return cachedPublishedArticles(limit);


}





export async function getPublishedArticlesAsArticles(
limit:number = 20
){


const posts =
await cachedPublishedArticles(limit);



return posts.map(mapPostToArticle);


}





export async function getPublishedArticlesByCategory(
categorySlug:string,
limit:number = 50
){


return cachedCategoryArticles(
categorySlug,
limit
);


}





export async function getPublishedArticlesByCategoryAsArticles(
categorySlug:string,
limit:number = 50
){


const posts =
await cachedCategoryArticles(
categorySlug,
limit
);



return posts.map(mapPostToArticle);


}





export async function getPublishedArticleBySlug(
slug:string
){


return prisma.post.findFirst({

where:{

slug,

status:"PUBLISHED"

},


select:articleSelect


});


}
export async function getRelatedArticles(
postId:string,
categoryId:string,
limit:number = 4
){


const posts =
await prisma.post.findMany({

where:{

id:{
not:postId
},


status:"PUBLISHED",


publishedAt:{
not:null
},


categoryId,

},


select:articleSelect,


orderBy:{

publishedAt:"desc"

},


take:limit


});


return posts.map(mapPostToArticle);


}

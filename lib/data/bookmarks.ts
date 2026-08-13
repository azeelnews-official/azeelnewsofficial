import { prisma } from "@/lib/prisma";

export async function getUserBookmarks(userId:string){

const bookmarks = await prisma.bookmark.findMany({

where:{
userId
},

include:{
post:{
include:{
category:true,
author:true
}
}
},

orderBy:{
createdAt:"desc"
}

});


return bookmarks.map((bookmark)=>({

id:bookmark.post.id,

slug:bookmark.post.slug,

headline:bookmark.post.headline,

dek:bookmark.post.dek,

category:bookmark.post.category.slug,

imageUrl:bookmark.post.featuredImageUrl,

imageAlt:
bookmark.post.featuredImageAlt ??
bookmark.post.headline,

author:{
name:bookmark.post.author.name,
slug:bookmark.post.author.name
.toLowerCase()
.replace(/\s+/g,"-"),
role:bookmark.post.author.role,
avatarUrl:bookmark.post.author.image ?? ""
},

publishedAt:
(bookmark.post.publishedAt ??
bookmark.post.createdAt)
.toISOString(),

updatedAt:
bookmark.post.updatedAt.toISOString(),

views:bookmark.post.views,

readingTimeMin:
bookmark.post.readingTimeMin,

tags:[],

isLive:bookmark.post.isLive,

isBreaking:bookmark.post.isBreaking

}));

}

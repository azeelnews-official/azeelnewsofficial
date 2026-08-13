
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
featuredImageUrl:true,
category:{
select:{
slug:true
}
}
},

take:5,

orderBy:{
publishedAt:"desc"
}

});


return posts.map((post)=>({

...post,

category:post.category.slug

}));

}


export const trendingSearches = [
"India",
"Technology",
"Business",
"Sports",
"AI"
];

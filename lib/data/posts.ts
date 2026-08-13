import { prisma } from "@/lib/prisma";


export async function getPublishedPosts(limit = 20){

  return prisma.post.findMany({

    where:{
      status:"PUBLISHED",
      publishedAt:{
        not:null
      }
    },

    take:limit,

    orderBy:[
      {
        publishedAt:"desc"
      },
      {
        createdAt:"desc"
      }
    ],

    select:{

      id:true,
      slug:true,
      headline:true,
      dek:true,

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
          role:true
        }
      },

      category:{
        select:{
          slug:true,
          name:true,
          nameHi:true
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

    }

  });

}



export async function getPostBySlug(slug:string){


  return prisma.post.findFirst({

    where:{
      slug,
      status:"PUBLISHED"
    },


    select:{

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
          role:true
        }
      },


      category:{
        select:{
          slug:true,
          name:true,
          nameHi:true
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

    }

  });


}



export async function getRelatedPosts(
 categoryId:string,
 postId:string
){

return prisma.post.findMany({

where:{

status:"PUBLISHED",

categoryId,

id:{
not:postId
}

},

take:4,

orderBy:{
publishedAt:"desc"
},

select:{

id:true,
slug:true,
headline:true,
dek:true,

featuredImageUrl:true,
featuredImageAlt:true,

readingTimeMin:true,
views:true,

publishedAt:true,


category:{
select:{
slug:true,
name:true
}
},


author:{
select:{
name:true,
image:true
}
}

}

});


}




export async function searchPosts(
query:string
){

return prisma.post.findMany({

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
},

{
body:{
contains:query,
mode:"insensitive"
}
}

]

},


take:20,


orderBy:{
publishedAt:"desc"
}

});


}



export async function getTrendingPosts(){

return prisma.post.findMany({

where:{
status:"PUBLISHED"
},

take:10,

orderBy:{
views:"desc"
},

select:{

id:true,
slug:true,
headline:true,
views:true,
featuredImageUrl:true

}

});

}



export async function getAdminPosts(){

return prisma.post.findMany({

orderBy:{
createdAt:"desc"
},


include:{

author:true,

category:true

}

});

}



export async function getAdminStats(){

const [
totalPosts,
publishedPosts,
draftPosts,
totalViews,
activeUsers,
totalComments,
pendingComments
] = await Promise.all([

prisma.post.count(),

prisma.post.count({
where:{
status:"PUBLISHED"
}
}),

prisma.post.count({
where:{
status:"DRAFT"
}
}),

prisma.post.aggregate({
_sum:{
views:true
}
}),

prisma.user.count(),

prisma.comment.count(),

prisma.comment.count({
where:{
status:"PENDING"
}
})

]);


return {

totalPosts,

publishedPosts,

draftPosts,

totalViews:
totalViews._sum.views ?? 0,

activeUsers,

totalComments,

pendingComments

};

}


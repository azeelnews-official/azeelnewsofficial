import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = "https://www.azeelnews.in";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {


  const posts = await prisma.post.findMany({

    where:{
      status:"PUBLISHED",
      publishedAt:{
        not:null
      }
    },

    select:{
      slug:true,
      updatedAt:true
    },

    orderBy:{
      updatedAt:"desc"
    },

    take:5000

  });


  const categories = await prisma.category.findMany({

    select:{
      slug:true
    }

  });



  return [

    {
      url:SITE_URL,
      lastModified:new Date(),
      changeFrequency:"always",
      priority:1
    },


    ...categories.map((category)=>({

      url:`${SITE_URL}/category/${category.slug}`,
      lastModified:new Date(),
      changeFrequency:"daily" as const,
      priority:0.8

    })),


    ...posts.map((post)=>({

      url:`${SITE_URL}/article/${post.slug}`,
      lastModified:post.updatedAt,
      changeFrequency:"daily" as const,
      priority:0.7

    }))

  ];

}

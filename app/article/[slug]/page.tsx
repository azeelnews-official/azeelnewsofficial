import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { Article, CategorySlug, Comment } from "@/lib/types";

import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { AdSlot } from "@/components/home/AdSlot";
import { ArticleMeta } from "@/components/home/ArticleMeta";
import { AuthorCard } from "@/components/article/AuthorCard";
import { TagList } from "@/components/article/TagList";
import { ArticleInteractive } from "@/components/article/ArticleInteractive";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { CommentSection } from "@/components/article/CommentSection";
import { NewsletterInline } from "@/components/article/NewsletterInline";
import { GoogleNewsFollow } from "@/components/article/GoogleNewsFollow";

const SITE_URL = "https://www.azeelnews.in";

export const revalidate = 60;

function bodyToParagraphs(body?: string): string[] {
  if (!body) return [];

  return body
    .split(/\n\s*\n/)
    .map((p) =>
      p
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^\s*[-*]\s+/gm, "")
        .trim()
    )
    .filter(Boolean);
}

function createAuthorSlug(name?: string){
  return (name ?? "azeel-news")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");
}

function mapPostToArticle(post:any):Article{
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

    publishedAt:(post.publishedAt ?? post.updatedAt).toISOString(),

    updatedAt:post.updatedAt.toISOString(),

    readingTimeMin:post.readingTimeMin,

    imageUrl:post.featuredImageUrl ?? "/logo.png",
    imageAlt:post.featuredImageAlt ?? "Azeel News",

    isLive:post.isLive,
    isBreaking:post.isBreaking,

    views:post.views,

    tags:(post.tags ?? [])
      .map((x:any)=>x.tag?.name)
      .filter(Boolean),

    body:bodyToParagraphs(post.body ?? ""),
  };
}
const getArticle = unstable_cache(
  async (slug:string) => {

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
            name:true
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

  },

  ["article-cache"],

  {
    revalidate:60
  }

);


export async function generateMetadata({
  params,
}:{
  params:Promise<{slug:string}>
}):Promise<Metadata>{

  const {slug}=await params;

  const post:any = await getArticle(slug);

  if(!post){
    return {};
  }


  return {

    title:post.headline,

    description:post.dek,


    alternates:{
      canonical:`/article/${slug}`
    },


    openGraph:{

      type:"article",

      title:post.headline,

      description:post.dek,

      url:`${SITE_URL}/article/${slug}`,

      images:[
        {
          url:post.featuredImageUrl,
          width:1200,
          height:800,
          alt:post.featuredImageAlt
        }
      ]

    },


    twitter:{
      card:"summary_large_image",
      title:post.headline,
      description:post.dek,
      images:[post.featuredImageUrl]
    }

  };

}
export default async function ArticlePage({

  params

}:{
  params:Promise<{slug:string}>
}){


  const {slug}=await params;


  const post:any = await getArticle(slug);


  if(!post){
    notFound();
  }


  const article = mapPostToArticle(post);



  const relatedPosts = await prisma.post.findMany({

    where:{

      status:"PUBLISHED",

      categoryId:post.categoryId,

      id:{
        not:post.id
      }

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
          name:true
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

    },


    orderBy:{
      publishedAt:"desc"
    },


    take:4

  });



  const related:Article[] =
    relatedPosts.map(mapPostToArticle);





  const articleSchema = {

    "@context":"https://schema.org",

    "@type":"NewsArticle",

    headline: article.headline,

    description: article.dek,

    image:[article.imageUrl],

    datePublished: article.publishedAt,

    dateModified: article.updatedAt,

    author:{
      "@type":"Person",
      name:article.author.name
    },

    publisher:{
      "@type":"NewsMediaOrganization",
      name:"AZEEL NEWS",
      logo:{
        "@type":"ImageObject",
        url:`${SITE_URL}/logo.png`
      }
    },

    mainEntityOfPage:{
      "@type":"WebPage",
      "@id":`${SITE_URL}/article/${article.slug}`
    }

  };


  const breadcrumbSchema = {

    "@context":"https://schema.org",

    "@type":"BreadcrumbList",

    itemListElement:[

      {
        "@type":"ListItem",
        position:1,
        name:"Home",
        item:SITE_URL
      },

      {
        "@type":"ListItem",
        position:2,
        name:post.category.name,
        item:`${SITE_URL}/category/${post.category.slug}`
      },

      {
        "@type":"ListItem",
        position:3,
        name:article.headline,
        item:`${SITE_URL}/article/${article.slug}`
      }

    ]

  };


  return (

    <>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema)
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />


      <TopBar/>

      <Header/>


      <main className="mx-auto max-w-[1400px] px-4 py-8">


        <nav className="mb-5 flex items-center gap-2 text-xs text-ink-300">


          <Link href="/">
            Home
          </Link>


          <ChevronRight size={12}/>


          <Link href={`/category/${post.category.slug}`}>
            {post.category.name}
          </Link>


        </nav>



        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">


          <article>


            <span className="mb-3 inline-block rounded-sm bg-azeel px-2 py-1 text-xs text-white">

              {post.category.name}

            </span>



            <h1 className="mb-3 font-display text-3xl font-bold md:text-5xl">

              {article.headline}

            </h1>



            <p className="mb-5 text-lg text-ink-600">

              {article.dek}

            </p>



            <div className="mb-6 border-b pb-6">


              <AuthorCard author={article.author}/>


              <ArticleMeta

                authorName={`Published ${new Date(article.publishedAt).toLocaleDateString("en-IN")}`}

                publishedAt={article.updatedAt}

                readingTimeMin={article.readingTimeMin}

              />


            </div>
              <div className="relative aspect-video mb-8">

                <Image

                  src={article.imageUrl || "/logo.png"}

                  alt={article.imageAlt || "Azeel News"}

                  fill

                  priority

                  sizes="(max-width:768px) 100vw, 900px"

                  className="object-cover"

                />

              </div>



              <ArticleInteractive article={article}/>



              <div className="my-8">

                <AdSlot size="inline"/>

              </div>



              <div className="mb-8">

                <TagList tags={article.tags ?? []}/>

                <GoogleNewsFollow/>

              </div>



              <CommentSection

                articleId={article.id}

                initialComments={[]}

              />


            </article>



            <aside className="flex flex-col gap-8">


              <AdSlot size="sidebar"/>


              <NewsletterInline/>


            </aside>


          </div>



          <RelatedArticles articles={related}/>


        </main>



        <Footer/>


        <CookieConsent/>


    </>

  );

}

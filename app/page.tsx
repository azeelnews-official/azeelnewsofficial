import type { Metadata } from "next";
import { unstable_cache } from "next/cache";

import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { BreakingTicker } from "@/components/layout/BreakingTicker";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { HeroSection } from "@/components/home/HeroSection";
import { ArticleCard } from "@/components/home/ArticleCard";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { CategorySection } from "@/components/home/CategorySection";
import { VideoGallery } from "@/components/home/VideoGallery";
import { AdSlot } from "@/components/home/AdSlot";

import {
  getPublishedArticlesAsArticles,
  getPublishedArticlesByCategoryAsArticles,
} from "@/lib/content/articles";


export const revalidate = 60;


export const metadata: Metadata = {
  title: "Azeel News, India & World",
  description:
    "Live updates on India and world affairs — politics, business, technology, sports and entertainment, reported and verified by AZEEL NEWS.",
  alternates:{
    canonical:"/",
  },
};



const getHomeArticles = unstable_cache(
async()=>{

return getPublishedArticlesAsArticles(50);

},
["home-articles"],
{
revalidate:60
}
);



const getCategoryArticles = unstable_cache(
async(slug:string)=>{

return getPublishedArticlesByCategoryAsArticles(
slug,
4
);

},
["home-category"],
{
revalidate:60
}
);



export default async function HomePage(){

const allArticles =
await getHomeArticles();



const heroArticle =
allArticles[0];


const topStories =
allArticles.slice(1,7);


const trending =
allArticles.slice(0,5);



const world =
await getCategoryArticles("world");


const business =
await getCategoryArticles("business");


const technology =
await getCategoryArticles("technology");



const breakingArticles =
allArticles.filter(
(article)=>article.isBreaking
);



const tickerItems =
breakingArticles
.slice(0,8)
.map(article=>({

id:article.id,

text:article.headline,

href:`/article/${article.slug}`

}));



return (

<>

<TopBar/>

<Header/>


{tickerItems.length>0 && (
<BreakingTicker items={tickerItems}/>
)}


<main id="main-content">


{heroArticle && (
<HeroSection article={heroArticle}/>
)}



<div className="mx-auto max-w-[1400px] px-4">


<div className="py-6">
<AdSlot size="leaderboard"/>
</div>



<div className="grid gap-10 lg:grid-cols-[1fr_320px]">


<div>

<h2 className="mb-6 border-b-2 border-ink-950 pb-3 font-display text-2xl font-bold text-ink-950">
Top Stories
</h2>



<div className="grid gap-8 sm:grid-cols-2">

{topStories.map(article=>(

<ArticleCard
key={article.id}
article={article}
/>

))}

</div>


</div>



<div className="flex flex-col gap-8">

<TrendingSidebar articles={trending}/>

<AdSlot size="sidebar"/>

</div>



</div>



<CategorySection
categorySlug="world"
articles={world}
/>


<CategorySection
categorySlug="business"
articles={business}
/>



<div className="py-6">
<AdSlot size="inline"/>
</div>



<CategorySection
categorySlug="technology"
articles={technology}
/>


</div>



<VideoGallery articles={trending}/>


</main>



<Footer/>

<CookieConsent/>


</>

);

}

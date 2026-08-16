import type { Metadata } from "next";
import { Film } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { getPublishedVideos } from "@/lib/data/videos";


export const metadata:Metadata={
title:"Videos",
description:"Watch latest AZEEL NEWS videos"
};


export default async function VideosPage(){

const videos =
await getPublishedVideos(50);


return (

<>

<TopBar/>
<Header/>


<main className="mx-auto max-w-[1400px] px-4 py-10">


<div className="mb-8 flex gap-2 items-center">

<Film/>
<h1 className="text-4xl font-bold">
Videos
</h1>

</div>



<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

{
videos.map(video=>(

<a
key={video.id}
href={video.videoUrl}
target="_blank"
className="font-semibold"
>

{video.title}

</a>

))
}


</div>


</main>


<Footer/>
<CookieConsent/>

</>

)

}

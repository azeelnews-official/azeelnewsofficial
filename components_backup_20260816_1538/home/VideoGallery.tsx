import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";


type Video = {
id:string;
title:string;
thumbnailUrl:string|null;
videoUrl:string;
};


export function VideoGallery({
videos
}:{
videos:Video[]
}){


return (

<section
aria-labelledby="video-heading"
className="border-y border-hairline bg-ink-950 py-10"
>

<div className="mx-auto max-w-[1400px] px-4">


<div className="mb-6 flex items-end justify-between">

<h2
id="video-heading"
className="font-display text-2xl font-bold text-white"
>
Video Gallery
</h2>


<Link
href="/videos"
className="text-sm font-semibold text-press"
>
Watch more
</Link>


</div>



<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">


{
videos.map((video)=>(


<a
key={video.id}
href={video.videoUrl}
target="_blank"
className="group"
>


<div className="relative aspect-video overflow-hidden bg-ink-800">


<Image
src={
video.thumbnailUrl ??
"/placeholder.jpg"
}
alt={video.title}
fill
sizes="25vw"
className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
/>


<div className="absolute inset-0 flex items-center justify-center">

<PlayCircle
size={40}
className="text-white/90"
/>

</div>


</div>



<h3 className="mt-3 line-clamp-2 text-sm font-semibold text-white">

{video.title}

</h3>


</a>


))

}


</div>


</div>

</section>


);

}

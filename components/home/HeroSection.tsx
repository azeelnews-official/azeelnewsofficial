import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { ArticleMeta } from "./ArticleMeta";
import { getCategoryLabel } from "@/lib/mock-data";


export function HeroSection({
  article,
}: {
  article: Article;
}) {

return (

<section
aria-labelledby="hero-headline"
className="border-b border-hairline"
>

<Link
href={`/article/${article.slug}`}
className="group grid gap-0 md:grid-cols-[1.4fr_1fr]"
>


<div className="relative aspect-[16/10] overflow-hidden bg-ink-100 md:aspect-auto">

<Image

src={article.imageUrl}

alt={article.imageAlt}

fill

priority

sizes="(min-width:768px) 60vw, 100vw"

className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"

/>


{article.isBreaking && (

<span className="absolute left-0 top-4 bg-press px-3 py-1 text-xs font-bold uppercase tracking-eyebrow text-white">

Breaking

</span>

)}

</div>



<div className="flex flex-col justify-center gap-4 bg-ink-950 px-6 py-8 md:px-10 md:py-0">


<span className="w-fit rounded-sm bg-azeel px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-eyebrow text-white">

{getCategoryLabel(article.category)}

</span>



<h1
id="hero-headline"
className="font-display text-3xl font-bold leading-[1.08] text-white transition-colors group-hover:text-ink-100 md:text-[2.6rem]"
>

{article.headline}

</h1>



<p className="text-base leading-relaxed text-ink-100 md:text-lg">

{article.dek}

</p>



<ArticleMeta

authorName={article.author.name}

publishedAt={article.publishedAt}

readingTimeMin={article.readingTimeMin}

tone="dark"

/>


</div>


</Link>


</section>

);

}

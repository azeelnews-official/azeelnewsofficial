import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import type { Article } from "@/lib/types";

export function VideoGallery({ articles }: { articles: Article[] }) {
  return (
    <section aria-labelledby="video-heading" className="border-y border-hairline bg-ink-950 py-10">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="video-heading" className="font-display text-2xl font-bold text-white">
            Video Gallery
          </h2>
          <Link href="/videos" className="text-sm font-semibold text-press hover:text-press-light">
            Watch more
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <Link key={article.id} href={`/videos/${article.slug}`} className="group">
              <div className="relative aspect-video overflow-hidden bg-ink-800">
                <Image
                  src={article.imageUrl}
                  alt={article.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle size={40} className="text-white/90 drop-shadow" />
                </div>
              </div>
              <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-press-light">
                {article.headline}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

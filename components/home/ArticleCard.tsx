"use client";

import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { ArticleMeta } from "./ArticleMeta";
import { getCategoryLabel } from "@/lib/data/constants";
import { cn } from "@/lib/utils";
import { useTranslatedText } from "@/lib/hooks/useTranslatedText";

export function ArticleCard({
  article,
  layout = "vertical",
  className,
}: {
  article: Article;
  layout?: "vertical" | "horizontal";
  className?: string;
}) {
  const horizontal = layout === "horizontal";
  const headline = useTranslatedText(article.headline);

  return (
    <article className={cn("group", className)}>
      <Link href={`/article/${article.slug}`} className={cn("flex gap-4", horizontal ? "flex-row items-start" : "flex-col")}>
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-ink-100",
            horizontal ? "aspect-[4/3] w-32 sm:w-40" : "aspect-[16/10] w-full"
          )}
        >
          <Image
            src={article.imageUrl}
            alt={article.imageAlt}
            fill
            sizes={horizontal ? "160px" : "(min-width: 1024px) 33vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-eyebrow text-azeel">
            {getCategoryLabel(article.category)}
          </span>
          <h3
            className={cn(
              "font-display font-semibold leading-snug text-ink-950 transition-colors group-hover:text-azeel-dark",
              horizontal ? "text-sm sm:text-base line-clamp-3" : "text-lg line-clamp-3"
            )}
          >
            {headline}
          </h3>
          {!horizontal && <p className="line-clamp-2 text-sm text-ink-600">{article.dek}</p>}
          <ArticleMeta
            authorName={article.author.name}
            publishedAt={article.publishedAt}
            readingTimeMin={article.readingTimeMin}
          />
        </div>
      </Link>
    </article>
  );
}

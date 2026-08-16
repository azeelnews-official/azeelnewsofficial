"use client";

import { useState } from "react";
import Image from "next/image";

export function PhotoGallery({
  articles,
}: {
  articles: any[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {articles.map((article, index) => (
          <button
            key={article.id}
            onClick={() => setOpen(index)}
            className="group relative aspect-square overflow-hidden bg-ink-100"
          >
            <Image
              src={article.imageUrl}
              alt={article.imageAlt}
              fill
              sizes="300px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>


      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative aspect-video w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={articles[open].imageUrl}
              alt={articles[open].imageAlt}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

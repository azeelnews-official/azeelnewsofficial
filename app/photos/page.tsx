"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand, ImageIcon } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { getAllArticles } from "@/lib/mock-data";

export default function PhotosPage() {
  const articles = getAllArticles();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null ? articles[openIndex] : null;

  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-10">
        <div className="mb-8 flex items-center gap-2">
          <ImageIcon className="text-azeel" size={26} />
          <h1 className="font-display text-3xl font-bold text-ink-950 md:text-4xl">Photos</h1>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {articles.map((article, i) => (
            <button
              key={article.id}
              onClick={() => setOpenIndex(i)}
              className="group relative aspect-square overflow-hidden bg-ink-100"
            >
              <Image
                src={article.imageUrl}
                alt={article.imageAlt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink-950/0 opacity-0 transition-all group-hover:bg-ink-950/40 group-hover:opacity-100">
                <Expand size={20} className="text-white" />
              </div>
            </button>
          ))}
        </div>
      </main>
      <Footer />
      <CookieConsent />

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/90 p-6"
          onClick={() => setOpenIndex(null)}
        >
          <div className="max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video w-full max-w-2xl overflow-hidden">
              <Image src={open.imageUrl} alt={open.imageAlt} fill sizes="800px" className="object-contain" />
            </div>
            <p className="mt-3 text-center text-sm text-white/80">{open.headline}</p>
          </div>
        </div>
      )}
    </>
  );
}

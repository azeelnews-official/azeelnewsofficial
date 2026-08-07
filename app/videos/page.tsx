import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Film } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { getAllArticles } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Videos",
  description: "Watch the latest video coverage from AZEEL NEWS.",
  alternates: { canonical: "/videos" },
};

export default function VideosPage() {
  const articles = getAllArticles();

  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-10">
        <div className="mb-8 flex items-center gap-2">
          <Film className="text-azeel" size={26} />
          <h1 className="font-display text-3xl font-bold text-ink-950 md:text-4xl">Videos</h1>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <Link key={article.id} href={`/article/${article.slug}`} className="group">
              <div className="relative aspect-video overflow-hidden bg-ink-100">
                <Image
                  src={article.imageUrl}
                  alt={article.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ink-950/20">
                  <PlayCircle size={40} className="text-white/90 drop-shadow" />
                </div>
              </div>
              <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-ink-900 group-hover:text-azeel-dark">
                {article.headline}
              </h3>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

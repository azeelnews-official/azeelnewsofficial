import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { BookmarksList } from "@/components/bookmarks/BookmarksList";

export const metadata: Metadata = {
  title: "Bookmarks",
  robots: { index: false, follow: true },
};

export default function BookmarksPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-8">
        <BookmarksList />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

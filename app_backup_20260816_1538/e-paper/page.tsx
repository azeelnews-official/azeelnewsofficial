import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { EpaperViewer } from "@/components/epaper/EpaperViewer";

export const metadata: Metadata = {
  title: "E-Paper",
  description: "Browse today's AZEEL NEWS print edition, page by page.",
  alternates: { canonical: "/e-paper" },
};

export default function EpaperPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-8">
        <EpaperViewer />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

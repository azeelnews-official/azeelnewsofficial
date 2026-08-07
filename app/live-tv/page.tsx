import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { LiveTvPlayer } from "@/components/live-tv/LiveTvPlayer";

export const metadata: Metadata = {
  title: "Live TV",
  description: "Watch AZEEL NEWS live channels and see today's broadcast schedule.",
  alternates: { canonical: "/live-tv" },
};

export default function LiveTvPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-8">
        <LiveTvPlayer />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

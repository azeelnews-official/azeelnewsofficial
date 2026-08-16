import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { ProfileView } from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "Your Profile",
  robots: { index: false, follow: true },
};

export default function ProfilePage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-8">
        <ProfileView />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

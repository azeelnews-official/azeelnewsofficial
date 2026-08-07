import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";

export function StaticPageLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 font-display text-3xl font-bold text-ink-950 md:text-4xl">{title}</h1>
        {updatedAt && <p className="mb-8 font-mono text-xs text-ink-300">Last updated {updatedAt}</p>}
        <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-ink-600">{children}</div>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

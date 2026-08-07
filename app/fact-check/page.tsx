import type { Metadata } from "next";
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { factChecks, type FactCheckVerdict } from "@/lib/mock-data";
import { formatRelativeTime, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Fact Check",
  description: "AZEEL NEWS verifies viral claims and separates fact from fiction.",
  alternates: { canonical: "/fact-check" },
};

const VERDICT_STYLES: Record<FactCheckVerdict, { icon: typeof CheckCircle2; label: string; className: string }> = {
  true: { icon: CheckCircle2, label: "True", className: "bg-green-50 text-green-700 border-green-200" },
  false: { icon: XCircle, label: "False", className: "bg-press/10 text-press border-press/20" },
  misleading: { icon: AlertTriangle, label: "Misleading", className: "bg-azeel/10 text-azeel-dark border-azeel/20" },
  unverified: { icon: HelpCircle, label: "Unverified", className: "bg-ink-50 text-ink-600 border-hairline" },
};

export default function FactCheckPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 flex items-center gap-2">
          <ShieldCheck className="text-azeel" size={26} />
          <h1 className="font-display text-3xl font-bold text-ink-950 md:text-4xl">Fact Check</h1>
        </div>
        <p className="mb-8 text-ink-600">
          Our fact-check desk verifies claims circulating in the news and on social media.
        </p>

        <div className="flex flex-col gap-5">
          {factChecks.map((item) => {
            const verdict = VERDICT_STYLES[item.verdict];
            return (
              <article key={item.id} className="border border-hairline bg-surface p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide", verdict.className)}>
                    <verdict.icon size={13} />
                    {verdict.label}
                  </span>
                  <span className="font-mono text-xs text-ink-300">{formatRelativeTime(item.publishedAt)}</span>
                </div>
                <p className="mb-2 font-display text-lg font-semibold italic text-ink-900">{item.claim}</p>
                <p className="text-sm leading-relaxed text-ink-600">{item.summary}</p>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

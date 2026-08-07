import type { Metadata } from "next";
import { Mail, TrendingUp, Users, MousePointerClick } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { AdSlot } from "@/components/home/AdSlot";

export const metadata: Metadata = {
  title: "Advertise With Us",
  description: "Reach millions of engaged readers across India with AZEEL NEWS advertising placements.",
  alternates: { canonical: "/advertise" },
};

const PLACEMENTS = [
  { name: "Leaderboard", size: "970×90 / 728×90", location: "Top of every page", price: "₹40 CPM" },
  { name: "Sidebar", size: "300×250", location: "Article & category sidebar", price: "₹35 CPM" },
  { name: "Inline", size: "728×200", location: "Between article paragraphs", price: "₹45 CPM" },
  { name: "Native", size: "Content card", location: "Home & category feeds", price: "₹60 CPM" },
];

export default function AdvertisePage() {
  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 font-display text-3xl font-bold text-ink-950 md:text-4xl">Advertise With Us</h1>
        <p className="mb-10 max-w-2xl text-ink-600">
          Reach a fast-growing, engaged readership across India and the diaspora — politics,
          business, and technology audiences with high intent.
        </p>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <StatCard icon={Users} label="Monthly Readers" value="4.8M+" />
          <StatCard icon={TrendingUp} label="Avg. Session" value="3m 40s" />
          <StatCard icon={MousePointerClick} label="Avg. CTR" value="1.2%" />
        </div>

        <h2 className="mb-4 font-display text-xl font-bold text-ink-950">Ad Placements &amp; Rates</h2>
        <div className="mb-10 overflow-x-auto border border-hairline bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink-300">
                <th className="px-4 py-3 font-medium">Placement</th>
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Rate</th>
              </tr>
            </thead>
            <tbody>
              {PLACEMENTS.map((p) => (
                <tr key={p.name} className="border-b border-hairline last:border-0">
                  <td className="px-4 py-3 font-medium text-ink-900">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-600">{p.size}</td>
                  <td className="px-4 py-3 text-ink-600">{p.location}</td>
                  <td className="px-4 py-3 font-semibold text-azeel-dark">{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-4 font-display text-xl font-bold text-ink-950">Example Placement</h2>
        <div className="mb-10">
          <AdSlot size="leaderboard" />
        </div>

        <div className="border border-hairline bg-ink-950 p-8 text-center text-white">
          <h2 className="mb-2 font-display text-xl font-bold">Ready to get started?</h2>
          <p className="mb-5 text-sm text-ink-300">
            Request our full media kit and rate card, or talk to our advertising team.
          </p>
          <a
            href="mailto:ads@azeelnews.in?subject=Advertising%20Inquiry"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-white/90"
          >
            <Mail size={15} /> ads@azeelnews.in
          </a>
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="border border-hairline bg-surface p-5 text-center">
      <Icon size={20} className="mx-auto mb-2 text-azeel" />
      <p className="font-display text-2xl font-bold text-ink-950">{value}</p>
      <p className="text-xs text-ink-300">{label}</p>
    </div>
  );
}

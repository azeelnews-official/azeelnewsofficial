import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/pages/StaticPageLayout";

export const metadata: Metadata = { title: "About Us", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <StaticPageLayout title="About AZEEL NEWS">
      <p>
        AZEEL NEWS is an independent digital news publication covering India and the world —
        politics, business, technology, sports, and culture. We report fast, verify carefully,
        and deliver stories that matter.
      </p>
      <p>
        Founded to bring premium, ad-supported journalism to a digital-first audience, our
        newsroom is built around a simple principle: readers deserve reporting they can trust,
        presented clearly, without noise.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">What We Cover</h2>
      <p>
        National and state politics, business and markets, technology and science, sports,
        entertainment, health, and explainers that break down complex stories — in both English
        and Hindi.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Get in Touch</h2>
      <p>
        Story tips, corrections, or feedback:{" "}
        <a href="mailto:contact@azeelnews.in" className="text-azeel hover:text-azeel-dark">contact@azeelnews.in</a>.
        For everything else, see our{" "}
        <a href="/contact" className="text-azeel hover:text-azeel-dark">Contact page</a>.
      </p>
    </StaticPageLayout>
  );
}

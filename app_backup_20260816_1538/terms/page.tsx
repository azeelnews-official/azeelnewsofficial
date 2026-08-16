import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/pages/StaticPageLayout";

export const metadata: Metadata = { title: "Terms of Use", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <StaticPageLayout title="Terms of Use" updatedAt="August 1, 2026">
      <p>
        By accessing or using azeelnews.com, you agree to these terms. If you do not agree,
        please do not use the site.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Use of Content</h2>
      <p>
        Articles, images, and other content are owned by AZEEL NEWS or its licensors and are for
        personal, non-commercial use. Republishing or redistributing content without written
        permission is prohibited.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Accounts &amp; Conduct</h2>
      <p>
        You are responsible for activity under your account. Comments and submissions must not be
        unlawful, defamatory, or infringing; we reserve the right to remove content and suspend
        accounts that violate these terms.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Disclaimer of Warranties</h2>
      <p>
        The site is provided &ldquo;as is&rdquo; without warranties of any kind. We work to keep
        reporting accurate but do not guarantee completeness or uninterrupted availability.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Changes</h2>
      <p>We may update these terms from time to time; continued use after changes constitutes acceptance.</p>
    </StaticPageLayout>
  );
}

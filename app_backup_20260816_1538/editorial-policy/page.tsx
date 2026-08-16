import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/pages/StaticPageLayout";

export const metadata: Metadata = { title: "Editorial Policy", alternates: { canonical: "/editorial-policy" } };

export default function EditorialPolicyPage() {
  return (
    <StaticPageLayout title="Editorial Policy" updatedAt="August 1, 2026">
      <p>
        AZEEL NEWS is committed to accurate, fair, and independent journalism. This policy
        outlines the standards our newsroom follows.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Independence</h2>
      <p>
        Editorial decisions are made independently of advertisers, sponsors, and any commercial
        relationship. Sponsored content is always clearly labeled as such.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Sourcing &amp; Verification</h2>
      <p>
        Reporters verify claims against multiple sources where possible and attribute information
        clearly. Anonymous sources are used only when necessary and subject to senior editor
        approval.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Corrections</h2>
      <p>
        We correct errors promptly and transparently — see our{" "}
        <a href="/correction-policy" className="text-azeel hover:text-azeel-dark">Correction Policy</a>.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Conflicts of Interest</h2>
      <p>Journalists disclose any personal or financial interest relevant to a story they cover.</p>
    </StaticPageLayout>
  );
}

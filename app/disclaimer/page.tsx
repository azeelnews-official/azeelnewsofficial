import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/pages/StaticPageLayout";

export const metadata: Metadata = { title: "Disclaimer", alternates: { canonical: "/disclaimer" } };

export default function DisclaimerPage() {
  return (
    <StaticPageLayout title="Disclaimer" updatedAt="August 1, 2026">
      <p>
        The information published on AZEEL NEWS is for general informational purposes only. While
        we make every effort to ensure accuracy at the time of publication, we make no
        representations or warranties about the completeness or reliability of any information.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Opinions</h2>
      <p>
        Opinion, editorial, and analysis pieces reflect the views of their authors and not
        necessarily those of AZEEL NEWS or its editorial staff.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">External Links</h2>
      <p>
        Our site may link to third-party websites. We are not responsible for the content or
        practices of external sites.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Financial &amp; Health Content</h2>
      <p>
        Content covering markets, health, or legal matters is for informational purposes only and
        is not professional advice. Consult a qualified professional before acting on it.
      </p>
    </StaticPageLayout>
  );
}

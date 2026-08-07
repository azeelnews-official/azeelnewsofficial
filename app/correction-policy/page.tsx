import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/pages/StaticPageLayout";

export const metadata: Metadata = { title: "Correction Policy", alternates: { canonical: "/correction-policy" } };

export default function CorrectionPolicyPage() {
  return (
    <StaticPageLayout title="Correction Policy" updatedAt="August 1, 2026">
      <p>
        Accuracy matters to us. When we get something wrong, we fix it and tell readers what
        changed.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">How Corrections Work</h2>
      <p>
        Minor errors (typos, formatting) are fixed without a note. Factual errors that affect the
        substance of a story are corrected with a visible editor&rsquo;s note at the top of the
        article stating what was changed and when.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Reporting an Error</h2>
      <p>
        If you spot an error, email{" "}
        <a href="mailto:corrections@azeelnews.in" className="text-azeel hover:text-azeel-dark">
          corrections@azeelnews.in
        </a>{" "}
        with the article link and a description of the issue. We review every report.
      </p>
    </StaticPageLayout>
  );
}

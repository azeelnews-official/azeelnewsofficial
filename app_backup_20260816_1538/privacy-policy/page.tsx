import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/pages/StaticPageLayout";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy" } };

export default function PrivacyPolicyPage() {
  return (
    <StaticPageLayout title="Privacy Policy" updatedAt="August 1, 2026">
      <p>
        AZEEL NEWS (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates azeelnews.com. This policy
        explains what information we collect when you use the site, how we use it, and the
        choices available to you.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Information We Collect</h2>
      <p>
        Account details you provide at signup (name, email), content you create (comments,
        bookmarks), and standard technical data (IP address, browser type, pages visited) collected
        automatically through cookies and similar technologies — see our cookie banner for controls.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">How We Use It</h2>
      <p>
        To operate and improve the site, personalize your feed, send the newsletter you opt into,
        moderate comments, and measure aggregate readership. We do not sell personal data to
        third parties.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Your Choices</h2>
      <p>
        You can update or delete your account from your profile, unsubscribe from the newsletter
        via the link in any email, and control non-essential cookies through the consent banner.
      </p>
      <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Contact</h2>
      <p>
        Questions about this policy: <a href="mailto:contact@azeelnews.in" className="text-azeel hover:text-azeel-dark">contact@azeelnews.in</a>.
      </p>
    </StaticPageLayout>
  );
}

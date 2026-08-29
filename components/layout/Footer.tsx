import { connection } from "next/server";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Linkedin, Send, MessageCircle } from "lucide-react";
import { categories } from "@/lib/data/constants";
import { FooterNewsletterForm } from "./FooterNewsletterForm";
import { getWidgets } from "@/lib/data/widgets";

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Advertise With Us", href: "/advertise" },
  { label: "Careers", href: "/careers" },
];

const POLICY_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Editorial Policy", href: "/editorial-policy" },
  { label: "Correction Policy", href: "/correction-policy" },
];

const RESOURCE_LINKS = [
  { label: "RSS Feed", href: "/rss.xml" },
  { label: "Sitemap", href: "/sitemap.xml" },
  { label: "E-Paper", href: "/e-paper" },
  { label: "Fact Check", href: "/fact-check" },
];

const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/azeelnews" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/azeelnews" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@azeelnews" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/azeelnews" },
  { icon: Send, label: "Telegram", href: "https://t.me/azeelnews" },
  { icon: MessageCircle, label: "WhatsApp Channel", href: "https://whatsapp.com/channel/azeelnews" },
];

export async function Footer() {
  await connection();

  const widgetAreas = await getWidgets();
  const footerArea = widgetAreas.find((area) => area.slug === "footer");
  const enabledWidgets = new Set(
    footerArea?.widgets
      .filter((widget) => widget.enabled)
      .sort((a, b) => a.order - b.order)
      .map((widget) => widget.slug) ?? []
  );

  return (
    <footer className="border-t border-hairline-dark bg-ink-950 text-ink-100">
      <div className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/azeel.jpeg"
                alt="Azeel News"
                className="h-10 w-10 rounded-full object-contain ring-2 ring-slate-300 dark:ring-white/20 object-cover"
              />

              <span className="font-display text-2xl font-black tracking-masthead text-white">
                AZEEL <span className="text-press">NEWS</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-300">
              Independent, verified reporting across India and the world — politics, business,
              technology, sports and culture.
            </p>
            <div className="mt-5 flex gap-3">
              {enabledWidgets.has("social-links") &&
              SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full border border-ink-800 p-2 text-ink-300 transition-colors hover:border-azeel hover:text-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Categories" links={categories.slice(0, 6).map((c) => ({ label: c.label, href: `/category/${c.slug}` }))} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Legal" links={POLICY_LINKS} />

          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-white">
              Newsletter
            </h3>
            <p className="mb-3 text-sm text-ink-300">Top stories, once a day, in your inbox.</p>
            <FooterNewsletterForm />
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {RESOURCE_LINKS.map((l) => (
                <Link key={l.label} href={l.href} className="text-ink-300 hover:text-white">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-ink-800 pt-6 text-xs text-ink-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Azeel News | All rights reserved.</p>
          <p>Azeel News | Powered by Azeel Technologies.</p>
        </div>
      </div>
    
<div className="mt-8">



</div>

</footer>

  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-white">{title}</h3>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-ink-300 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

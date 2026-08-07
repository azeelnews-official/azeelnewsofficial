"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin, Send } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";

const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/azeelnews" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/azeelnews" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@azeelnews" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/azeelnews" },
  { icon: Send, label: "Telegram", href: "https://t.me/azeelnews" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
  }

  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 font-display text-3xl font-bold text-ink-950 md:text-4xl">Contact Us</h1>
        <p className="mb-10 text-ink-600">We&rsquo;d love to hear from you — tips, feedback, or questions.</p>

        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-5">
            <ContactCard icon={Mail} label="Editorial" value="contact@azeelnews.in" href="mailto:contact@azeelnews.in" />
            <ContactCard icon={Mail} label="Advertising" value="ads@azeelnews.in" href="mailto:ads@azeelnews.in" />
            <ContactCard icon={Phone} label="Newsroom" value="+91 98765 43210" href="tel:+919876543210" />
            <ContactCard icon={MapPin} label="Office" value="Connaught Place, New Delhi, India" />

            <div>
              <p className="mb-2 text-sm font-semibold text-ink-800">Follow us</p>
              <div className="flex gap-2">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="rounded-full border border-hairline p-2.5 text-ink-600 transition-colors hover:border-azeel hover:text-azeel"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-hairline bg-surface p-6">
            {sent ? (
              <p className="text-sm text-ink-800">
                Thanks, {name || "friend"} — your message has been received. We&rsquo;ll get back to you at {email}.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="contact-name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="w-full resize-none rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
                  />
                </div>
                <button
                  type="submit"
                  className="w-fit rounded-md bg-azeel px-5 py-2.5 text-sm font-semibold text-white hover:bg-azeel-dark"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="rounded-md bg-azeel/10 p-2 text-azeel">
        <Icon size={16} />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">{label}</p>
        <p className="text-sm font-medium text-ink-900">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="border border-hairline bg-surface p-4 transition-colors hover:border-azeel">
      {content}
    </a>
  ) : (
    <div className="border border-hairline bg-surface p-4">{content}</div>
  );
}

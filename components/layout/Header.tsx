"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Radio, Film, Image as ImageIcon, TrendingUp, Newspaper, ShieldCheck } from "lucide-react";
import { categories, readerNotifications } from "@/lib/data/constants";
import { SearchOverlay } from "./SearchOverlay";
import { AccountMenu } from "./AccountMenu";
import { NotificationsBell } from "@/components/shared/NotificationsBell";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const UTILITY_LINKS = [
  { label: "Live TV", href: "/live-tv", icon: Radio },
  { label: "Videos", href: "/videos", icon: Film },
  { label: "Photos", href: "/photos", icon: ImageIcon },
  { label: "Trending", href: "/trending", icon: TrendingUp },
  { label: "E-Paper", href: "/e-paper", icon: Newspaper },
  { label: "Fact Check", href: "/fact-check", icon: ShieldCheck },
];

export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, loading } = useAuth();
  const { locale } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:py-4">
        <button
          className="text-ink-800 md:hidden"
          aria-label="Open menu"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          {navOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link href="/" className="flex flex-col items-center md:items-start" aria-label="AZEEL NEWS home">
          <span className="font-display text-3xl font-black tracking-masthead text-ink-950 md:text-4xl">
            AZEEL <span className="text-press">NEWS</span>
          </span>
          <span className="mt-0.5 hidden font-mono text-[10px] tracking-eyebrow text-ink-300 md:block">
            REPORTED. VERIFIED. DELIVERED.
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2 text-ink-800 transition-colors hover:bg-ink-50"
          >
            <Search size={20} />
          </button>
          {!loading && (user ? (
            <div className="flex items-center gap-3">
              <NotificationsBell initialNotifications={readerNotifications} />
              <AccountMenu />
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-azeel-dark md:inline-block"
            >
              Sign In
            </Link>
          ))}
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {/* Desktop mega navigation */}
      <nav className="hidden border-t border-hairline bg-ink-950 md:block" aria-label="Primary">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-4">
          <ul className="flex items-center overflow-x-auto">
            {categories.map((cat) => (
              <li key={cat.slug} className="shrink-0">
                <Link
                  href={`/category/${cat.slug}`}
                  className="block whitespace-nowrap px-3.5 py-2.5 text-[13px] font-semibold uppercase tracking-wide text-ink-100 transition-colors hover:bg-ink-900 hover:text-white"
                >
                  {locale === "hi" ? cat.labelHi : cat.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex shrink-0 items-center gap-1">
            {UTILITY_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="flex items-center gap-1.5 px-2.5 py-2.5 text-[13px] font-medium text-ink-300 transition-colors hover:text-press xl:px-3"
                >
                  <Icon size={14} />
                  <span className="hidden xl:inline">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {navOpen && (
        <nav className="border-t border-hairline bg-ink-950 md:hidden" aria-label="Primary">
          <ul className="max-h-[70vh] overflow-y-auto">
            {categories.map((cat) => (
              <li key={cat.slug} className="border-b border-ink-800">
                <Link
                  href={`/category/${cat.slug}`}
                  className="block px-4 py-3 text-sm font-semibold uppercase tracking-wide text-ink-100"
                  onClick={() => setNavOpen(false)}
                >
                  {locale === "hi" ? cat.labelHi : cat.label}
                </Link>
              </li>
            ))}
            {UTILITY_LINKS.map(({ label, href }) => (
              <li key={label} className="border-b border-ink-800">
                <Link
                  href={href}
                  className="block px-4 py-3 text-sm font-medium text-ink-300"
                  onClick={() => setNavOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

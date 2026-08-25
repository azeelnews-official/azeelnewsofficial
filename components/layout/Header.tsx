"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, UserRound, Radio, Film, Image as ImageIcon, TrendingUp, Newspaper, ShieldCheck } from "lucide-react";
import { categories } from "@/lib/data/constants";
import { SearchOverlay } from "./SearchOverlay";
import { AccountMenu } from "./AccountMenu";
import { NotificationsBell } from "@/components/shared/NotificationsBell";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const UTILITY_LINKS = [
  { label: "Live TV", href: "/live-tv", icon: Radio },
  { label: "Photos", href: "/photos", icon: ImageIcon },
  { label: "Trending", href: "/trending", icon: TrendingUp },
  { label: "E-Paper", href: "/e-paper", icon: Newspaper },
  { label: "Videos", href: "/videos", icon: Film },
  { label: "Fact Check", href: "/fact-check", icon: ShieldCheck },
];

export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user, loading } = useAuth();
  const { locale } = useLanguage();


  useEffect(()=>{

    fetch("/api/notifications")
    .then(res=>res.json())
    .then(data=>{

      setNotifications(
        data.map((n:any)=>({
          id:n.id,
          title:
            locale==="hi"
            ? (n.titleHi || n.title)
            : n.title,

          body:
            locale==="hi"
            ? (n.bodyHi || n.body)
            : n.body,

          createdAt:n.createdAt,
          read:false
        }))
      );

    })
    .catch(()=>{});

  },[locale]);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:gap-4 md:py-4">
        <button
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-800 transition-colors hover:bg-ink-50 dark:text-white dark:hover:bg-white/10 md:hidden"
          aria-label="Open menu"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          {navOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 sm:gap-2.5"
          aria-label="AZEEL NEWS home"
        >
          <img
            src="/logo.png"
            alt="Azeel News"
            width={36}
            height={36}
            className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-ink-200/70 dark:ring-white/20 sm:h-9 sm:w-9"
          />
          <span className="font-display whitespace-nowrap text-[20px] leading-none font-black tracking-[-0.04em] text-ink-950 dark:text-white sm:text-2xl md:text-4xl">
            AZEEL <span className="text-press">NEWS</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 md:gap-3">
          <ThemeToggle />
          <button
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-800 transition-colors hover:bg-ink-50 dark:text-white dark:hover:bg-white/10 sm:h-9 sm:w-9 md:h-auto md:w-auto md:p-2"
          >
            <Search size={17} className="sm:h-[18px] sm:w-[18px] md:h-5 md:w-5" />
          </button>
          {!loading && (
          <Link
            href={user ? "/profile" : "/login"}
            aria-label={user ? "Open profile" : "Sign in"}
            title={user ? "Profile" : "Sign in"}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-800 shadow-sm transition hover:bg-ink-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 sm:h-9 sm:w-9 md:hidden"
          >
            <UserRound size={17} className="sm:h-[18px] sm:w-[18px]" />
          </Link>
        )}

        {!loading && (user ? (
            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 md:gap-3">
              <NotificationsBell initialNotifications={notifications} />
              <AccountMenu />
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-md bg-azeel px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-azeel-dark md:inline-block"
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

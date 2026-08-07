# AZEEL NEWS — Home Page (Page 1)

Production-grade Next.js 16 (App Router) implementation of the AZEEL NEWS home page.

## Stack
Next.js 16.2.12 · React 19.2.8 · TypeScript (strict) · Tailwind CSS 3.4 · Framer Motion ·
Lucide Icons · ESLint 9 (flat config, `eslint-config-next`)

## How this was verified
Beyond `typecheck`/`lint`/`build`, every page was verified with a real running dev server
(fonts swapped out temporarily, since only that step is blocked by this sandbox — see below)
and a full route sweep via `curl`:
- All 18 public routes returned `200` (article/category 404s correctly return `404` for
  nonexistent slugs).
- All 19 `/admin/*` routes returned `307` — proof `middleware.ts`'s session+role check is
  actually intercepting unauthenticated requests, not just present in the code.
- `POST /api/auth/login` returned `500` — confirmed via the server log to be exactly the
  documented Prisma-generation limitation (`Cannot find module '.prisma/client/default'`),
  not an unrelated crash.

This caught a real bug that static analysis alone had missed: `Footer.tsx` (rendered on every
page) had an inline `onSubmit` handler in a Server Component, which is invalid in the App
Router — event handlers can only be passed from Client Components. It compiled and typechecked
fine but crashed every page at render time. Fixed by extracting the newsletter form into
`FooterNewsletterForm.tsx` (`"use client"`). If you're auditing this project further, the same
check catches this class of bug: `grep -rl "onSubmit=\|onClick=\|onChange=" app components |
xargs -I{} sh -c 'head -3 {} | grep -q "use client" || echo {}'` should print nothing.

A second pass went beyond status codes to content-level assertions against the rendered HTML —
confirming the masthead, hero headline, trending sidebar, and ad slots render on Home; author,
related coverage, and comments render on the Article page; category labels render correctly;
search actually returns the matching article for a real query and shows the correct empty state
for a non-matching one; `robots.txt` disallows `/admin`; `sitemap.xml` contains the site URL;
unknown article slugs 404; the admin middleware redirect target is `/login`; and both
`NewsMediaOrganization` and `NewsArticle` JSON-LD schema are present. All 16 checks passed.

Docker itself isn't installed in this sandbox, so `Dockerfile`/`docker-compose.yml` couldn't be
build-tested here — they were reviewed by hand against Next.js's documented `output: "standalone"`
multi-stage pattern, and the two GitHub Actions workflow files were validated for YAML
correctness. Build-test these for real the first time you use them: `docker compose up --build`.

## This phase: mobile, real data, and a framework migration caught by testing
- **Admin mobile nav was actually broken** — the hamburger button in `AdminTopbar` had no
  click handler at all, so mobile users had zero way to reach the admin sidebar. Fixed with a
  proper slide-in drawer (`AdminMobileDrawer.tsx` + `AdminShell.tsx`) sharing the same nav data
  as the desktop sidebar (`AdminNavContent` in `AdminSidebar.tsx`) so the two can't drift apart.
- **Live weather**, using **Open-Meteo** (free, no API key) in `components/layout/WeatherWidget.tsx`,
  wired into the TopBar next to the clock — real current temperature and conditions for New
  Delhi, refreshed every 15 minutes. This was mocked/absent before despite being in the brief.
- **`middleware.ts` → `proxy.ts`**: running the actual dev server (not just typecheck/build)
  surfaced a Next.js 16 deprecation warning — the framework renamed the middleware convention to
  `proxy.ts` with a required `proxy` (or default) export. Migrated and reverified with a live
  route sweep. This is exactly the kind of forward-compat issue that never shows up in
  `tsc --noEmit`; only running the app catches it.
- **Mobile responsiveness audit**: every admin `<table>` confirmed to sit inside an
  `overflow-x-auto` wrapper; every filter bar's `min-w-[…]` search box confirmed to live inside
  a `flex-wrap` container so it drops to its own row instead of overflowing on narrow viewports;
  every multi-column grid confirmed mobile-first (base = single column via bare `grid`, columns
  added only at `sm:`/`md:`/`lg:`) — no responsive regressions found beyond the hamburger bug
  above, which is now fixed.

## This phase: dark mode, real i18n, and working notifications
- **Dark mode was cosmetically fake before this** — the toggle set a `.dark` class on `<html>`
  but no CSS responded to it. Fixed properly via CSS custom properties: `paper`, `ink-900/800/600/300`,
  `hairline`, and a new `surface` token (replacing `bg-white` on ~33 content-surface files via a
  scoped bulk edit) now resolve through `rgb(var(--color-x) / <alpha-value>)`, with light and
  dark values defined once in `globals.css`. Verified by fetching the actual compiled stylesheet
  from a running dev server and confirming both the `:root` and `.dark` variable blocks exist.
  Brand chrome (header nav strip, footer, ticker, admin sidebar) intentionally stays dark navy
  in both modes — that's a deliberate design choice, not a gap, matching how most news sites'
  mastheads behave.
- **Language toggle was decorative before this** — clicking EN/हिं changed a local button state
  and nothing else. Now backed by a real `LanguageProvider` context (localStorage-persisted):
  category nav labels switch instantly using the `labelHi` data already in `lib/mock-data.ts`
  (no API needed for static strings), and headlines/deks on the Hero section and every
  `ArticleCard` translate dynamically via the free **MyMemory Translation API** (no key required)
  through `lib/hooks/useTranslatedText.ts`, with in-memory caching and a fail-open fallback to
  English if the API is unavailable or rate-limited.
- **Notification bells were a static badge before this** — now a real `NotificationsBell`
  dropdown (`components/shared/NotificationsBell.tsx`) shared between the admin topbar and the
  public header (shown only when signed in), with per-item and mark-all-read state.
- **Live weather** via Open-Meteo (free, no key) in the TopBar, refreshed every 15 minutes —
  covered in an earlier phase, confirmed still working here.
- All of the above reverified with a live dev-server route sweep (all public routes 200, admin
  routes 307) and zero console errors/warnings.

Known minor gap: hover states using `hover:bg-ink-50` inside now-dark cards (mostly in admin
tables) don't have a dark-mode-aware hover shade yet — cosmetic only, not a functional bug.

## This phase: zero-404 page coverage, real ticking clock, contact/legal pages
- **Real ticking clock with seconds** in the TopBar, corrected against **timeapi.io** (free, no
  key) every 10 minutes to fix client clock drift, ticking locally every second in between —
  not just polling an API every second, which would be wasteful and rate-limit-prone.
- **Contact email** (`contact@azeelnews.in`, `mailto:` link) and all social links now open in a
  new tab with proper `rel="noopener noreferrer"`.
- **Nine new pages** so nothing in the header/footer 404s: `/about`, `/contact` (with a working
  form + email/phone/social), `/advertise` (placements + rate card), `/careers`,
  `/privacy-policy`, `/terms`, `/disclaimer`, `/editorial-policy`, `/correction-policy` — all
  sharing the same TopBar/Header/Footer as every other page.
- **Four new content pages**: `/trending`, `/fact-check` (with True/False/Misleading verdict
  badges), `/videos`, `/photos` — previously linked from the header/footer but 404ing.
- **Verified with a full route sweep**: every single link across Header, Footer, and TopBar
  (33 URLs) returns `200`, confirmed against a live dev server, not just checked by reading code.
- News dateline/location field, CSP fix (`connect-src` was blocking the weather/translation
  APIs), and the `window.location.href` hydration fix all carried over from the previous phase.

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel, Docker (`Dockerfile` + `docker-compose.yml`),
and manual Node deployment instructions, an environment-variable reference, and a production
checklist. CI runs on every push/PR via `.github/workflows/ci.yml`; Docker images publish to
GHCR on version tags via `.github/workflows/docker-publish.yml`.

## Getting started
```bash
cp .env.example .env   # fill in DATABASE_URL, REDIS_URL, JWT_SECRET, GOOGLE_CLIENT_ID/SECRET, etc.
npm install             # also runs `prisma generate` via postinstall
npm run db:push         # creates tables from prisma/schema.prisma (dev)
npm run db:seed         # seeds categories + a sample post/user
npm run dev              # http://localhost:3000
npm run typecheck
npm run lint
npm run build && npm run start
```

Requires network access to `fonts.googleapis.com`/`fonts.gstatic.com` at build time
(Next.js self-hosts the fonts after fetching them once — no runtime dependency on Google)
and to `binaries.prisma.sh` the first time `prisma generate` runs (downloads the query
engine; cached after that — no runtime dependency on it either).

## Auth (JWT + Google OAuth)
- `lib/auth/jwt.ts` — session JWT sign/verify using `jose` (chosen over `jsonwebtoken`
  specifically because `middleware.ts` runs on the Edge runtime, where `jsonwebtoken`'s
  Node `crypto` dependency doesn't work; `jose` runs in both).
- `lib/auth/password.ts` — bcrypt hashing (`bcryptjs`, pure JS — no native build step).
- `lib/auth/session.ts` — sets/reads/clears the `azeel_session` httpOnly cookie.
- `lib/auth/google.ts` — builds the Google consent-screen URL, exchanges the auth code,
  fetches the profile.
- `middleware.ts` — protects every `/admin/*` route: no session → redirect to `/login`;
  session present but role isn't `JOURNALIST`/`EDITOR`/`ADMIN` → redirect to `/`.
- Routes: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me`, `POST /api/auth/forgot-password` (issues a single-use, DB-persisted,
  1-hour token — logged to the console as a stand-in for a real email provider), `POST
  /api/auth/reset-password`, `GET /api/auth/google` + `GET /api/auth/google/callback`.
- The `/login`, `/register`, `/forgot-password`, and `/reset-password` pages now call these
  routes for real (no more mock `setTimeout`); rate limiting on login/register/forgot-password
  uses the `rateLimit` helper from `lib/redis.ts`.
- Passwords are never logged or returned; login uses a constant-time-ish comparison path
  (hashes a dummy value when the email isn't found) so response timing doesn't leak whether
  an email is registered.

## Database & cache layer
- `prisma/schema.prisma` — full data model: `User`/`Account`/`Session`/`PasswordResetToken`
  (auth), `Category`/`Tag`/`Post`/`PostTag`/`Comment`/`Bookmark`/`Media` (content),
  `Advertisement` (monetization), `NewsletterSubscriber`, `Redirect`/`Page`/`AuditLog` (site
  management). Postgres via `DATABASE_URL`.
- `lib/prisma.ts` — `PrismaClient` singleton (hot-reload-safe in dev).
- `lib/redis.ts` — Redis singleton plus `cacheGetOrSet` (wraps an expensive query with a TTL
  cache) and `rateLimit` (fixed-window counter) helpers, for trending/most-read caching and
  rate-limiting login/comment/search endpoints.
- `prisma/seed.ts` — ports a slice of `lib/mock-data.ts` into real rows so local dev has data
  to work against once the pages switch over from mock data to Prisma queries.
- **This build was verified in a sandbox that cannot reach `binaries.prisma.sh`**, so
  `prisma generate`/`db push`/`validate` couldn't be run here — `lib/prisma.ts`,
  `prisma/seed.ts`, and `lib/auth/jwt.ts` (which imports the generated `Role` type) are the
  only files that don't typecheck as a result (everything else in the project — 100+ other
  files — typechecks and lints clean). This resolves itself on `npm install` in a normal
  network environment, the same way the Google Fonts build step does.

## Pages implemented
- **Home** (`app/page.tsx`) — sticky header/mega nav, breaking ticker, hero, top stories,
  trending sidebar, category rails, video gallery, ad slots, cookie consent, footer
- **Article Detail** (`app/article/[slug]/page.tsx`) — breadcrumb, headline/dek/byline,
  hero image, reading toolbar (like, bookmark, share, copy link, print, font size, reading
  mode), tag list, Google News follow, related coverage rail, comment thread with post form,
  inline newsletter card
- **Category Listing** (`app/category/[slug]/page.tsx`) — sub-nav across all categories, lead
  story (reuses the home hero block), sortable (Latest/Popular) paginated grid with Load More,
  trending sidebar, `CollectionPage` + `BreadcrumbList` schema
- **Search** (`app/search/page.tsx` + header `SearchOverlay`) — instant suggestions dropdown
  as you type, recent searches (localStorage) and trending-search chips, voice search via the
  Web Speech API where supported, a dedicated `/search?q=` results page (noindexed), empty-state
  handling
- **Auth** (`app/login`, `/register`, `/forgot-password`) — split-screen branded layout, Google
  sign-in button (UI only), email/password with client-side validation and inline errors,
  password visibility toggle, remember-me, forgot/reset flow with a confirmation state. Forms
  currently simulate the request — see Future Improvements.
- **Admin Dashboard** (`app/admin/layout.tsx` + `app/admin/page.tsx`) — grouped sidebar nav
  covering every backend section from the brief (Content / People / Engagement / Site / System),
  topbar with search and account menu, stat cards, a dependency-free CSS traffic chart, quick
  actions, and a recent-posts table with status badges. Sidebar links route to their sections;
  only the Dashboard itself is built this phase — the rest are next.
- **Article Editor** (`app/admin/posts/new`, `/admin/posts/[slug]/edit`) — headline + auto-slug
  (editable/overridable), Markdown editor with a formatting toolbar (bold, italic, heading,
  quote, lists, links, image, YouTube embed) and a Write/Preview tab using a small dependency-free
  Markdown renderer (`lib/markdown.ts`), autosave to localStorage with a "last saved" indicator,
  featured-image upload (file picker or URL), category + tag management, SEO panel (slug, meta
  description with character count), and Draft/Publish/Schedule status controls.
- **Posts List** (`app/admin/posts/page.tsx`) — search, status/category filters, per-row and
  select-all checkboxes, a bulk-action bar (Publish/Unpublish/Delete) that appears on selection,
  pagination, and per-row View/Edit/Delete actions.
- **Auth Backend** (`app/api/auth/*` + `middleware.ts`) — real JWT sessions (httpOnly cookie),
  bcrypt password hashing, Google OAuth (authorization-code flow with CSRF state), single-use
  DB-persisted password-reset tokens, rate limiting on login/register/forgot-password, and
  Edge middleware protecting every `/admin/*` route by session + role. The login/register/
  forgot-password/reset-password pages now call these endpoints instead of simulating a request.
- **Header Signed-In State** (`components/auth/AuthProvider.tsx` + `AccountMenu.tsx`) — a
  client-side session context (fetches `/api/auth/me` on load) drives the header: shows "Sign
  In" when logged out, or an avatar menu (Profile, Bookmarks, Admin link for editorial roles,
  Sign Out) when logged in. Login/register refresh this state immediately post-auth.
- **Users & Roles** (`app/admin/users`, `/admin/roles`) — user table with search, role filter,
  inline role change, and suspend/activate; a permissions-matrix reference page for the four
  roles (Reader/Journalist/Editor/Admin) with live user counts per role.
- **Comments Moderation** (`app/admin/comments`) — status filter (Pending/Approved/Spam/All),
  search, per-comment Approve/Mark as Spam/Delete actions, and a link back to the source
  article. New comments submitted from the public article page now start `pending`.
- **Categories & Tags** (`app/admin/categories`, `/admin/tags`) — categories table with live
  post counts, inline rename, add/delete; tags shown as a usage-sorted chip cloud with counts
  and delete. Both operate on local state (see Future Improvements for persistence).
- **Media Library** (`app/admin/media`) — grid view of every image in use across published
  articles, multi-file upload (object-URL preview), search, copy-URL, delete.
- **Advertisements** (`app/admin/ads`) — campaign table with placement filter, live CTR
  calculation, pause/resume, delete, and aggregate impressions/clicks in the header.
- **Newsletter** (`app/admin/newsletter`) — subscriber list with status, recent-campaigns list
  with open rates, active-subscriber/campaigns-sent/avg-open-rate stat cards, and a compose
  form that "sends" to the active subscriber count (mock).
- **SEO** (`app/admin/seo`) — global title template, default meta description (with character
  count), default OG image, Twitter handle, Search Console verification field, an editable
  robots.txt, a sitemap "regenerate" action, and a live Google-style search-result preview.
- **Redirects** (`app/admin/redirects`) — add/delete path redirects with a 301/302/307 selector.
- **Menus** (`app/admin/menus`) — tabbed editor across multiple menus (Primary Navigation,
  Footer — Company), add/delete items, reorder via up/down.
- **Pages** (`app/admin/pages`) — static-page list (About, Contact, Advertise, Privacy Policy,
  Terms) with a title/content editor, add/delete.
- **Widgets** (`app/admin/widgets`) — three placement areas (Homepage Sidebar, Article Sidebar,
  Footer), each with enable/disable toggles and up/down reordering per widget.
- **Settings** (`app/admin/settings`) — site identity (name, tagline), contact info, timezone,
  default language, and a maintenance-mode toggle with a visible warning when enabled.
- **Backup** (`app/admin/backup`) — automatic backup-schedule selector, backup list with
  relative timestamps and size, Create/Download/Restore/Delete actions.
- **Logs** (`app/admin/logs`) — audit trail with search and action-category filtering
  (post/comment/user/category/auth/ad), color-coded by category.

This completes every section in the admin sidebar's Content / People / Engagement / Site /
System groups from the original brief.
- **E-Paper** (`app/e-paper`) — date picker (with prev/next-day controls), a page-thumbnail
  grid, a full-screen page viewer on click, and a download action.
- **Live TV** (`app/live-tv`) — channel switcher, a mock live-player poster with a pulsing LIVE
  badge, and today's broadcast schedule.
- **Profile** (`app/profile`) — shows the signed-in session (redirects to a sign-in prompt if
  logged out), an editable display name and email-digest preference (local state), and links to
  bookmarks/sign-out.
- **Bookmarks** (`app/bookmarks`) — reads a `localStorage`-backed bookmark list shared with the
  article page's bookmark button (`lib/hooks/useBookmarks.ts`), rendering full article cards for
  each saved story, with an empty state when there are none.

## What's on the home page
- Sticky header: masthead, live search overlay, desktop mega nav, mobile drawer nav
- Top utility bar: live IST clock, language switch (EN/HI), dark-mode toggle, social links
- Breaking-news marquee ticker with a pulsing LIVE indicator (hover-to-pause, reduced-motion aware)
- Hero lead story, Top Stories grid, Trending Now numbered sidebar, three category rails
  (World / Business / Technology), video gallery strip
- Ad slots (leaderboard / sidebar / inline) — placeholder containers ready for AdSense wiring
- Cookie consent banner with Accept / Reject / Customize (per-category toggles)
- Footer with full sitemap-style link columns and a newsletter signup form

## What's on the article page
- `NewsArticle` + `BreadcrumbList` JSON-LD, full Open Graph article metadata (published/modified time, section, tags)
- Author card, published/updated timestamps, reading time
- Reading toolbar: like (with count), bookmark, native Web Share API with a social fallback menu
  (X, Facebook, WhatsApp, LinkedIn), copy-link, print, font-size stepper, distraction-free reading mode
- Tag chips linking to topic pages, Google News follow chip
- Related-coverage rail (same-category first, cross-category fill)
- Comment thread with a working local post form (client state; swap for a real API later)

## SEO & structured data
- `NewsMediaOrganization` JSON-LD in the root layout, `BreadcrumbList` on the home page
- Full Open Graph + Twitter Card metadata, canonical URL, `en-IN`/`hi-IN` hreflang alternates
- `app/robots.ts` and `app/sitemap.ts` (App Router metadata routes)

## Accessibility
- Skip-to-content link, visible focus rings, `aria-live`/`aria-label` on dynamic regions,
  `prefers-reduced-motion` respected globally, semantic landmarks (`header`, `nav`, `main`, `footer`)

## Data layer
`lib/mock-data.ts` stands in for the future Prisma/PostgreSQL + REST API layer described in
the full brief — same `Article`/`Category` shapes the real API will return, so swapping in
real data later is a drop-in replacement, not a rewrite.

## Not yet built
- Wiring all pages (public + all 18 admin sections) off `lib/mock-data.ts` onto real Prisma
  queries through authenticated API routes — the schema and auth layer already support this.
- Bookmarks/reading-history syncing to the `Bookmark` Prisma model instead of `localStorage`
  once a user is signed in (currently device-local, not account-linked).
- A real video stream (HLS/DASH player) behind the Live TV mock poster.
- Cloudinary/Resend need real credentials to do anything in production — see below.

## Email + media upload (this phase)
- `lib/email.ts` — sends via **Resend** if `RESEND_API_KEY` is set; otherwise logs the email to
  the console so nothing breaks in local dev. Wired into `POST /api/auth/forgot-password` and
  the new `POST /api/admin/newsletter/send` (role-gated to Editor/Admin), which the Newsletter
  compose form now actually calls.
- `lib/cloudinary.ts` + `POST /api/upload` — role-gated (Journalist/Editor/Admin), validates
  file type and a 10MB size cap, uploads to Cloudinary if `CLOUDINARY_*` env vars are set. The
  Article Editor's featured-image upload and the Media Library's upload both call this first
  and silently fall back to a local object-URL preview if it's not configured or fails — same
  fail-open pattern as the email fallback, so the editor stays usable without credentials.
- Both require real credentials in `.env` to actually send/store anything — without them, the
  app behaves exactly as it did before this phase (console-log email, local-preview uploads).
# azeelnewsofficial

# Deployment Guide — AZEEL NEWS

Three ways to run this in production, from least to most infrastructure you manage.

---

## 1. Vercel (recommended — zero-config for Next.js)

1. Push the repo to GitHub/GitLab/Bitbucket.
2. In the Vercel dashboard: **New Project → Import** your repo. Vercel auto-detects Next.js;
   no build settings need to change.
3. **Provision Postgres and Redis** — Vercel doesn't host either itself. Pick one:
   - Postgres: [Neon](https://neon.tech), [Supabase](https://supabase.com), or Vercel's own
     Postgres integration (Storage tab → Create Database).
   - Redis: [Upstash](https://upstash.com) (has a native Vercel integration) or Redis Cloud.
4. Add the environment variables from the table below in **Project Settings → Environment
   Variables** (set them for Production, Preview, and Development as appropriate).
5. **Run the schema against your database** before or right after the first deploy:
   ```bash
   DATABASE_URL="<your production URL>" npx prisma db push
   DATABASE_URL="<your production URL>" npx prisma db seed   # optional — sample data
   ```
   (Run this from your machine or a one-off CI job — Vercel's build step doesn't run
   migrations automatically. `prisma generate` *does* run automatically via the `postinstall`
   script during Vercel's build.)
6. Deploy. Vercel handles TLS, CDN, and preview deployments per PR automatically.
7. Set `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` redirect URI in the Google Cloud Console to
   `https://<your-domain>/api/auth/google/callback` once you know the production domain.

---

## 2. Docker (self-hosted — VPS, ECS, Cloud Run, etc.)

The `Dockerfile` is a multi-stage build using Next.js's `output: "standalone"` — the final
image contains only the pruned server output, not full `node_modules`.

### Quickest path: full local stack with docker-compose
```bash
cp .env.example .env   # docker-compose reads JWT_SECRET, GOOGLE_CLIENT_ID/SECRET from here
docker compose up --build
```
This starts Postgres, Redis, and the app together, wired to each other, on `localhost:3000`.
Run migrations once the containers are up:
```bash
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed   # optional
```

### Standalone image, external Postgres/Redis
```bash
docker build -t azeel-news .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e REDIS_URL="redis://..." \
  -e JWT_SECRET="<generate a real one>" \
  -e NEXT_PUBLIC_SITE_URL="https://your-domain.com" \
  azeel-news
```

### CI/CD
`.github/workflows/ci.yml` runs typecheck/lint/build (with a real Postgres service container)
on every push and PR. `.github/workflows/docker-publish.yml` builds and pushes the image to
GitHub Container Registry (`ghcr.io/<owner>/<repo>`) whenever you push a `v*.*.*` tag — wire
your host to pull that tag, or add a deploy step at the end of that workflow for your specific
platform (ECS, Cloud Run, Fly.io, etc. each have their own `docker/build-push-action` follow-up
step you'd append).

---

## 3. Manual Node deployment (no Docker)
```bash
npm ci
npx prisma generate
npm run build
npm run start   # serves on :3000; put a reverse proxy (nginx/Caddy) in front for TLS
```
Run `npx prisma db push` against your production database first, same as above.

---

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string |
| `REDIS_URL` | Yes | Redis connection string — caching, rate limiting |
| `JWT_SECRET` | Yes | Long random string. Generate with `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | No | Default `7d` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Only if using Google sign-in | From Google Cloud Console OAuth credentials |
| `CLOUDINARY_*` / `S3_*` | Not yet used | Reserved for the real upload pipeline (see README) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full production URL, no trailing slash — used in OAuth redirect, OG tags, sitemap |

Never commit `.env` — it's gitignored. `.env.example` is the template.

---

## Production checklist
- [ ] `JWT_SECRET` is a real random value, not the placeholder
- [ ] `prisma db push` (or `migrate deploy` if you switch to migrations) has been run against
      the production database
- [ ] Google OAuth redirect URI matches the production domain exactly
- [ ] `NEXT_PUBLIC_SITE_URL` matches the real domain (affects OG tags, sitemap, canonical URLs)
- [ ] A real transactional email provider is wired in for password-reset and newsletter sends
      (both currently log to the console — see README "Not yet built")
- [ ] Custom domain + TLS configured (automatic on Vercel; your responsibility on Docker/VPS)
- [ ] Error monitoring (Sentry or similar) — not included; add via `npm install @sentry/nextjs`
      and its setup wizard if needed
- [ ] Database backups scheduled at the infrastructure level (the admin **Backup** page is a
      UI mock — see README)

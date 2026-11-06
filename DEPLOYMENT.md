# lorn.lol — Deployment Guide

## Prerequisites

Before deploying, you need:

1. **PostgreSQL database** — [Neon.tech](https://neon.tech) (free tier recommended)
2. **Discord OAuth app** — already configured (`1460381998051889225`)
3. **Environment variables** — set in your platform dashboard (see below)

---

## Environment Variables

Set these in your deployment platform's dashboard (never commit them):

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=https://lorn.lol
DISCORD_CLIENT_ID=1460381998051889225
DISCORD_CLIENT_SECRET=4JhagLZ1vBu6O8nnPjDOq5c43-aa0oKj
DISCORD_BOT_TOKEN=<your bot token>
LORN_OWNER_DISCORD_ID=409564774444171265
PREMIUM_MODE_FREE=true
ENABLE_PREMIUM=false
BOT_SECRET=<secure random string>
REDIS_URL=<optional: redis connection string>
```

---

## Vercel (Recommended ⭐)

**Easiest option — full Next.js support, zero config.**

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `github.com/luvrless/lorn.lol`
3. Framework: **Next.js** (auto-detected)
4. Add all environment variables above
5. Click **Deploy**

> **Build command:** `npm run build` (auto-detected)  
> **Output directory:** `.next` (auto-detected)

After deploy, add these redirect URIs in [Discord Developer Portal](https://discord.com/developers/applications/1460381998051889225/oauth2):
- `https://lorn.lol/api/auth/callback/discord`

---

## Netlify

**Also easy — full Next.js SSR support via plugin.**

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Connect `github.com/luvrless/lorn.lol`
3. Build settings are auto-read from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
4. Go to **Site settings → Environment variables** → add all vars above
5. Go to **Site settings → Build & deploy → Dependency management** → install `@netlify/plugin-nextjs` (should be auto-detected from `netlify.toml`)
6. Click **Deploy site**

---

## Cloudflare Pages

**More complex — requires the `@cloudflare/next-on-pages` adapter.**

> ⚠️ Cloudflare Pages has limitations with Node.js APIs. If you use Redis (`ioredis`) or other Node-only packages heavily, some routes may fail at the edge. Set `REDIS_URL` to empty to disable Redis gracefully.

### Setup in Cloudflare Dashboard

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages** → **Create a project**
2. Connect `github.com/luvrless/lorn.lol`
3. Set build settings:
   - **Framework preset:** `Next.js (Edge)`  
   - **Build command:** `npx @cloudflare/next-on-pages@1`
   - **Build output directory:** `.vercel/output/static`
   - **Node.js version:** `20`
4. Add all environment variables above in **Settings → Environment variables**
5. Click **Save and Deploy**

### `wrangler.toml` (already configured)

```toml
name = "lorn-lol"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

---

## Database Setup (after first deploy)

Run these once after your database URL is configured:

```bash
# Push schema to database
npx prisma db push

# Seed badges and system config
npm run db:seed
```

Or if deploying to Vercel, use the Vercel CLI:
```bash
vercel env pull .env.local
npx prisma db push
npm run db:seed
```

---

## Discord OAuth Redirect URIs

In [Discord Developer Portal](https://discord.com/developers/applications/1460381998051889225/oauth2/general), add:

- `https://lorn.lol/api/auth/callback/discord`
- `https://<your-preview-url>/api/auth/callback/discord` (for previews)

---

## Post-Deploy Checklist

- [ ] Home page renders at `https://lorn.lol`
- [ ] Discord login works → redirects to `/dashboard`
- [ ] Public profile `https://lorn.lol/<username>` loads correctly
- [ ] `/admin` returns **404** to non-staff users
- [ ] `/admin` loads for Discord user `409564774444171265` (owner)
- [ ] All 26 badges load from `/badges/*.svg`
- [ ] Premium page shows "Free for all users" banner
- [ ] Admin → Settings can toggle Free Mode on/off

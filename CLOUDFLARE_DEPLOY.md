# Cloudflare Pages Deployment Guide

## Cloudflare Dashboard Settings

Go to: Workers & Pages → Your Project → Settings → Builds & deployments

### Build Configuration

**Framework preset:** None

**Build command:**
```
cd apps/web && npx @cloudflare/next-on-pages
```

**Build output directory:**
```
apps/web/.vercel/output/static
```

**Root directory:** `/`

**Deploy command:** **(LEAVE EMPTY - DELETE IF PRESENT)**

### Environment Variables

Settings → Environment Variables → Production:
- `SANITY_STUDIO_API_PROJECT_ID` = `e3cginxl`
- `SANITY_STUDIO_DATASET` = `production`
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `e3cginxl`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `NODE_VERSION` = `22.16.0`

## What This Does
- Uses `@cloudflare/next-on-pages` (standard for Next.js on Cloudflare)
- Full SSR support on Cloudflare's edge network
- Dynamic routes, API routes, server components all work
- The `.vercel/output/static` path is just the build tool's output format (still deploying to Cloudflare, not Vercel)

# Cloudflare Pages Build Configuration

## Build Settings

In your Cloudflare Pages project settings, configure:

**Build command:**
```
cd apps/web && npx @cloudflare/next-on-pages
```

**Build output directory:**
```
apps/web/.vercel/output/static
```

**Root directory:** 
```
/
```

**Environment variables:**
Add these to your Cloudflare Pages project:
- `SANITY_STUDIO_API_PROJECT_ID` = `e3cginxl`
- `SANITY_STUDIO_DATASET` = `production`
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `e3cginxl`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `NODE_VERSION` = `22.16.0`

## Framework preset
Select: **Next.js (Pages Router)** or **None** (manual configuration)

## Notes
- Using `@cloudflare/next-on-pages` for Next.js on Cloudflare Pages
- Supports SSR, dynamic routes, and API routes on the edge

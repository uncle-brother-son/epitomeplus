# Cloudflare Pages Deployment Guide

## IMPORTANT: Build Settings in Cloudflare Dashboard

Go to your Cloudflare Pages project → Settings → Builds & deployments

### Build Configuration

**Framework preset:**
- Select: **None** 

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

**❌ IMPORTANT: Leave "Build command" EMPTY or remove any "npx wrangler deploy" command**
- Cloudflare Pages auto-deploys after build
- Do NOT use `wrangler deploy` - that's for Workers, not Pages

### Environment Variables

Add these in Settings → Environment Variables → Production:
- `SANITY_STUDIO_API_PROJECT_ID` = `e3cginxl`
- `SANITY_STUDIO_DATASET` = `production`
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `e3cginxl`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `NODE_VERSION` = `22.16.0`

## How it Works
1. GitHub pushes trigger auto-deployment
2. Cloudflare runs the build command
3. Output is automatically deployed from the build directory
4. Using `@cloudflare/next-on-pages` for full Next.js SSR support on Cloudflare's edge network

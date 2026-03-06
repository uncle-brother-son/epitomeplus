# Cloudflare Workers Deployment Guide

## Migration Complete ✅

Your project has been migrated from **static export** to **@opennextjs/cloudflare** (Cloudflare Workers).

### What Changed

**Configuration:**
- ✅ Removed `output: 'export'` from next.config.ts
- ✅ Enabled Next.js image optimization (removed `unoptimized: true`)
- ✅ Added @opennextjs/cloudflare@1.3.0 (latest secure version)
- ✅ Created wrangler.toml configuration
- ✅ Updated .gitignore for Cloudflare build outputs

**Your Code:**
- ✅ No changes needed - all components, pages, and queries work exactly as before

### New Build Process

**Local Development (unchanged):**
```bash
npm run dev
```

**Production Build:**
```bash
# Step 1: Build Next.js app
npm run build

# Step 2: Generate Cloudflare Workers output
npm run deploy
```

This creates `.open-next/` directory with optimized Workers code.

### Cloudflare Workers Deployment

**You're configured for Cloudflare Workers (not Pages).**

**To deploy:**

```bash
# Build the Next.js app and generate Workers bundle
npm run build && npm run deploy

# Deploy to Cloudflare Workers
npx wrangler deploy
```

**First-time setup:**
- Login to Cloudflare: `npx wrangler login`
- The deploy command will create the Worker in your account

**Environment Variables:**
Add environment variables using wrangler:

```bash
# Set individual secrets
npx wrangler secret put NEXT_PUBLIC_SANITY_PROJECT_ID
npx wrangler secret put NEXT_PUBLIC_SANITY_DATASET

# Or add to wrangler.toml under [vars] for non-sensitive values
```

### Benefits You Now Have

1. **Image Optimization** 🖼️
   - Automatic WebP/AVIF conversion
   - Responsive image sizing
   - Better performance and smaller file sizes

2. **Future API Routes** 📮
   - Can now add `/app/api/` routes
   - Perfect for contact forms, email sending, webhooks
   - Server-side logic without separate backend

3. **Incremental Static Regeneration (ISR)** 🔄
   - Can add `revalidate` to pages to update content periodically
   - No need for full rebuilds on content changes

4. **Full Server Components** ⚡
   - Dynamic data fetching at request time (if needed)
   - Better SEO with server-rendered metadata

5. **Next.js 16 Support** 🚀
   - Unlike @cloudflare/next-on-pages
   - Stay current with latest Next.js features

### Testing Locally

Test the Cloudflare Worker locally:

```bash
npm run build
npm run deploy
npx wrangler dev
```

Then visit `http://localhost:8787` to preview your site running on the Worker.

### Deployment Workflow

**Deploying to Cloudflare Workers:**

```bash
# Build and deploy in one go
npm run build && npm run deploy && npx wrangler deploy
```

**Custom domains:**
Add a route in Cloudflare dashboard or via wrangler.toml:

```toml
routes = [
  { pattern = "epitomeplus.com/*", zone_name = "epitomeplus.com" }
]
```

**CI/CD:**
Add to your GitHub Actions or deployment pipeline:

```yaml
- run: npm run build && npm run deploy
- run: npx wrangler deploy
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### Troubleshooting

**Build fails?**
- Make sure `npm run build` succeeds first
- Then run `npm run deploy`

**Images not optimizing?**
- Check that Sanity images are coming through
- Verify `cdn.sanity.io` is in remotePatterns (already configured)

**Need to rollback to static?**
- Revert next.config.ts changes (add back `output: 'export'` and `unoptimized: true`)
- Remove @opennextjs/cloudflare from package.json
- Change build command back to `next build`

### Next Steps

1. Test the build locally: `npm run build && npm run deploy && npx wrangler dev`
2. Login to Cloudflare: `npx wrangler login`
3. Deploy to production: `npx wrangler deploy`
4. Verify everything works at your Worker URL or custom domain

---

**Questions?** Check the docs:
- https://opennext.js.org/cloudflare
- https://developers.cloudflare.com/pages/framework-guides/nextjs/

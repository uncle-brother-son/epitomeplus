import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Only these paths are real routes. Everything else is rejected here, before
// it reaches the page renderer, so scanner/bot probes (/.env, /wp-login.php,
// /app/.env ...) can never be rendered and cached to KV as 404 pages.
const ALLOWED_PATHS = [
  /^\/$/,
  /^\/(motion|stills)(\/[^/]+)?\/?$/,
  /^\/about\/?$/,
  /^\/info\/[^/]+\/?$/,
  /^\/api\/revalidate\/?$/,
  /^\/sitemap\.xml$/,
  /^\/robots\.txt$/,
  /^\/favicon\.ico$/,
]

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''

  if (host.startsWith('www.')) {
    const url = request.nextUrl.clone()
    url.host = host.replace(/^www\./, '')
    url.protocol = 'https'
    url.port = ''
    return NextResponse.redirect(url, { status: 301 })
  }

  const { pathname } = request.nextUrl
  if (!ALLOWED_PATHS.some((re) => re.test(pathname))) {
    return NextResponse.rewrite(new URL('/_not-found', request.url), { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|_worker.js|favicon.ico).*)'],
}


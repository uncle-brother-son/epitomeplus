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
    return new NextResponse(
      '<!doctype html><html><head><meta charset="utf-8"><title>404</title></head><body><h1>404 - Page Not Found</h1><p><a href="/">Go Back Home</a></p></body></html>',
      { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|_worker.js|favicon.ico).*)'],
}


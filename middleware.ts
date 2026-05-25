import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// ── User-facing route lists ────────────────────────────────────
const REQUIRES_AUTH = ['/dashboard', '/assessment', '/results', '/teams', '/pulse', '/payment']
const AUTH_ONLY     = ['/login', '/signup', '/forgot-password']

// ── Admin route constants ──────────────────────────────────────
const ADMIN_ROOT         = '/admin'
const ADMIN_LOGIN_PATH   = '/admin/login'
const PUBLIC_ADMIN_PATHS = [ADMIN_LOGIN_PATH, '/admin/_next', '/admin/favicon']

// ── Security headers ───────────────────────────────────────────
function secureResponse(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }
  return response
}

function safeReturnUrl(url: string | null): string {
  if (!url) return '/dashboard'
  if (url.startsWith('//') || url.startsWith('http')) return '/dashboard'
  return url.startsWith('/') ? url : '/dashboard'
}

// ── Admin branch ───────────────────────────────────────────────
async function handleAdmin(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl

  // Public admin paths — let through
  if (PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Admin API auth routes — let through (handle their own auth)
  if (pathname.startsWith('/api/admin/auth')) {
    return NextResponse.next()
  }

  // All other admin API routes — let through (requireAdmin() handles it)
  if (pathname.startsWith('/api/admin')) {
    return NextResponse.next()
  }

  // Admin UI pages — verify token from cookie
  const token = req.cookies.get('admin_token')?.value

  if (!token) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Lightweight edge check — full role enforcement is inside each API route
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      const loginUrl = new URL(ADMIN_LOGIN_PATH, req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  } catch {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, req.url)
    return NextResponse.redirect(loginUrl)
  }

  return secureResponse(NextResponse.next())
}

// ── User branch ────────────────────────────────────────────────
async function handleUser(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl

  const isProtected = REQUIRES_AUTH.some(p => pathname.startsWith(p))
  const isAuthOnly  = AUTH_ONLY.some(p => pathname.startsWith(p))

  if (!isProtected && !isAuthOnly) {
    return secureResponse(NextResponse.next())
  }

  let session = null
  try {
    const res      = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            )
          },
        },
      }
    )
    const { data } = await supabase.auth.getSession()
    session = data.session
  } catch {
    // Session unavailable — treat as unauthenticated
  }

  // Not logged in → send to login
  if (isProtected && !session) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('returnUrl', pathname)
    return secureResponse(NextResponse.redirect(url))
  }

  // Already logged in → redirect away from auth pages
  if (isAuthOnly && session) {
    const returnUrl = req.nextUrl.searchParams.get('returnUrl')
    const url       = req.nextUrl.clone()
    url.pathname    = safeReturnUrl(returnUrl)
    url.search      = ''
    return secureResponse(NextResponse.redirect(url))
  }

  return secureResponse(NextResponse.next())
}

// ── Main middleware ────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip static assets — neither branch needs to handle these
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Route to admin branch
  if (pathname.startsWith(ADMIN_ROOT) || pathname.startsWith('/api/admin')) {
    return handleAdmin(req)
  }

  // Skip non-admin API routes — they handle their own auth
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  return handleUser(req)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
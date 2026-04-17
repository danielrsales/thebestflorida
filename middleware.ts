import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session
  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl
  const role = session?.user?.user_metadata?.role as string | undefined

  // ── Unauthenticated: protect all private routes ─────────────────────────
  const isPrivate =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/admin')

  if (isPrivate && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── Authenticated: role-based routing ────────────────────────────────────
  if (session) {
    // Clients should not access /dashboard → send to /account
    if (pathname.startsWith('/dashboard') && role === 'client') {
      return NextResponse.redirect(new URL('/account', request.url))
    }

    // Contractors should not access /account → send to /dashboard
    if (pathname.startsWith('/account') && role === 'contractor') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // /admin → is_admin check is handled by the admin layout (Server Component DB query)
    // Middleware only blocks unauthenticated access (handled above)

    // Redirect authenticated users away from auth pages
    if (pathname === '/login' || pathname === '/signup' || pathname === '/signup/client') {
      const dest = role === 'client' ? '/account' : '/dashboard'
      return NextResponse.redirect(new URL(dest, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
    '/signup/client',
  ],
}

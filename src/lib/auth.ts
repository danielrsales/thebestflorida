import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

function getServerClient() {
  const cookieStore = cookies()
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove(name, options) {
          try { cookieStore.set({ name, value: '', ...options }) } catch {}
        },
      },
    }
  )
}

/** Returns the current session or null. Safe to call in Server Components. */
export async function getSession() {
  const supabase = getServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/** Returns the current user or null. */
export async function getUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user ?? null
}

/**
 * Require authentication in a Server Component or Route Handler.
 * Redirects to /login if not authenticated.
 */
export async function requireAuth(redirectTo = '/login') {
  const user = await getUser()
  if (!user) redirect(redirectTo)
  return user
}

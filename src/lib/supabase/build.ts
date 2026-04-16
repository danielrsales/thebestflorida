/**
 * Cookie-free Supabase client for use in generateStaticParams (build time).
 * Uses the anon key directly — no request context needed.
 */
import { createClient } from '@supabase/supabase-js'

export function createBuildClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  const testPost = {
    title: 'Debug Test Post',
    slug: `debug-test-${Date.now()}`,
    content: 'Test content',
    author: 'Debug',
    published: false,
  }

  const { data, error } = await supabase
    .from('tbf_posts')
    .insert(testPost)
    .select()
    .single()

  return NextResponse.json({
    success: !error,
    data,
    error: error ? { message: error.message, details: error.details, hint: error.hint, code: error.code } : null,
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { adminCreatePost } from '@/lib/posts'

export const dynamic = 'force-dynamic'

async function assertAdmin() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false

  const { data } = await supabase
    .from('tbf_contractors')
    .select('is_admin')
    .eq('user_id', session.user.id)
    .maybeSingle()

  return !!data?.is_admin
}

export async function POST(req: NextRequest) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await req.json()
  const { title, slug, excerpt, content, cover_image, category, author, published, published_at } = body

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'title, slug, and content are required.' }, { status: 400 })
  }

  try {
    const post = await adminCreatePost({
      title, slug, excerpt: excerpt ?? null, content,
      cover_image: cover_image ?? null,
      category: category ?? null,
      author: author ?? 'TheBestFlorida Team',
      published: !!published,
      published_at: published_at ?? null,
    })
    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}

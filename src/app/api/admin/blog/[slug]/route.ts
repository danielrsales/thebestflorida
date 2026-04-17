import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { adminUpdatePost, adminDeletePost } from '@/lib/posts'

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

interface RouteContext {
  params: { slug: string }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await req.json()
  try {
    const post = await adminUpdatePost(params.slug, body)
    return NextResponse.json(post)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    await adminDeletePost(params.slug)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 })
  }
}

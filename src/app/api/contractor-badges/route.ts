import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { assignBadge, revokeBadge } from '@/lib/badges'

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

  const { contractor_id, badge_id, verification_url, expires_at, notes } = await req.json()
  if (!contractor_id || !badge_id) {
    return NextResponse.json({ error: 'contractor_id and badge_id are required.' }, { status: 400 })
  }

  try {
    await assignBadge(contractor_id, badge_id, { verification_url, expires_at, notes })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { contractor_id, badge_id } = await req.json()
  if (!contractor_id || !badge_id) {
    return NextResponse.json({ error: 'contractor_id and badge_id are required.' }, { status: 400 })
  }

  try {
    await revokeBadge(contractor_id, badge_id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error' },
      { status: 500 }
    )
  }
}

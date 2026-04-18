import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { adminApproveReview, adminRejectReview, addContractorResponse } from '@/lib/reviews'

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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await req.json()
  const { action, reason, response } = body

  try {
    if (action === 'approve') {
      await adminApproveReview(params.id)
    } else if (action === 'reject') {
      await adminRejectReview(params.id, reason)
    } else if (action === 'respond') {
      if (!response) return NextResponse.json({ error: 'Response text required.' }, { status: 400 })
      await addContractorResponse(params.id, response)
    } else {
      return NextResponse.json({ error: 'Invalid action.' }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error' },
      { status: 500 }
    )
  }
}

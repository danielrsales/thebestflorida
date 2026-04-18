import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createReview } from '@/lib/reviews'
import { sendReviewVerificationEmail } from '@/lib/email-verification'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    contractor_id, reviewer_name, reviewer_email, reviewer_phone,
    rating_overall, rating_quality, rating_punctuality, rating_price, rating_communication,
    title, content, pros, cons,
    service_type, project_cost_range, project_date, would_recommend, photos,
  } = body

  if (!contractor_id || !reviewer_name || !reviewer_email || !content || !rating_overall) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  if (rating_overall < 1 || rating_overall > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5.' }, { status: 400 })
  }

  // Resolve contractor slug for email
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { data: contractor } = await supabase
    .from('tbf_contractors')
    .select('slug, business_name')
    .eq('id', contractor_id)
    .maybeSingle()

  if (!contractor) {
    return NextResponse.json({ error: 'Contractor not found.' }, { status: 404 })
  }

  const token = randomUUID()

  try {
    await createReview({
      contractor_id,
      reviewer_name,
      reviewer_email,
      reviewer_phone: reviewer_phone ?? null,
      verification_token: token,
      rating_overall,
      rating_quality: rating_quality ?? null,
      rating_punctuality: rating_punctuality ?? null,
      rating_price: rating_price ?? null,
      rating_communication: rating_communication ?? null,
      title: title ?? null,
      content,
      pros: pros ?? null,
      cons: cons ?? null,
      service_type: service_type ?? null,
      project_cost_range: project_cost_range ?? null,
      project_date: project_date ?? null,
      would_recommend: would_recommend ?? true,
      photos: photos ?? null,
    })

    await sendReviewVerificationEmail({
      to: reviewer_email,
      name: reviewer_name,
      contractorName: contractor.business_name,
      token,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to submit review.' },
      { status: 500 }
    )
  }
}

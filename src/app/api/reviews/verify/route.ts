import { NextRequest, NextResponse } from 'next/server'
import { verifyReview } from '@/lib/reviews'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Missing token.' }, { status: 400 })
  }

  const review = await verifyReview(token)
  if (!review) {
    return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

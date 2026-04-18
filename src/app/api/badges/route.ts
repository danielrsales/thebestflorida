import { NextResponse } from 'next/server'
import { getAllBadges } from '@/lib/badges'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const badges = await getAllBadges()
    return NextResponse.json(badges)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error' },
      { status: 500 }
    )
  }
}

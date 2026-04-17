import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    keyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    keyStart: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20) || 'none',
  })
}

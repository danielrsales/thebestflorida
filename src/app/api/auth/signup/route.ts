import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

  const body = await req.json()
  const { type = 'contractor', name, email, password, phone, city } = body

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  // ── 1. Create Supabase Auth user ──────────────────────────────────────────
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role: type },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const userId = authData.user.id

  try {
    if (type === 'client') {
      await signupClient({ supabaseAdmin, userId, name, email, phone, city })
    } else {
      const { categorySlugs } = body as { categorySlugs?: string[] }
      if (!categorySlugs?.length || !city) {
        throw new Error('Service category and city are required.')
      }
      await signupContractor({ supabaseAdmin, userId, name, email, phone, city, categorySlugs })
    }

    // ── Welcome email ─────────────────────────────────────────────────────
    if (resend) {
      const isContractor = type !== 'client'
      await resend.emails.send({
        from: 'TheBestFlorida <noreply@thebestflorida.com>',
        to: email,
        subject: `Welcome to TheBestFlorida${isContractor ? ', Pro!' : '!'}`,
        html: buildWelcomeEmail({ name, type, city }),
      }).catch(() => {
        console.error('[signup] Failed to send welcome email to', email)
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => null)
    const message = err instanceof Error ? err.message : 'Unexpected error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function signupClient({
  supabaseAdmin, userId, name, email, phone, city,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseAdmin: any
  userId: string
  name: string
  email: string
  phone?: string
  city?: string
}) {
  const { data: cityRow } = await supabaseAdmin
    .from('tbf_cities')
    .select('id')
    .ilike('name', (city ?? '').trim())
    .maybeSingle()

  const { error } = await supabaseAdmin.from('tbf_clients').insert({
    user_id: userId,
    name,
    email,
    phone: phone || null,
    city_id: cityRow?.id ?? null,
  })

  if (error) throw new Error(error.message)
}

async function signupContractor({
  supabaseAdmin, userId, name, email, phone, city, categorySlugs,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseAdmin: any
  userId: string
  name: string
  email: string
  phone?: string
  city: string
  categorySlugs: string[]
}) {
  // Resolve city
  const { data: cityRow } = await supabaseAdmin
    .from('tbf_cities')
    .select('id')
    .ilike('name', city.trim())
    .maybeSingle()

  // Build unique slug
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const slug = `${baseSlug}-${Date.now()}`

  // Create contractor
  const { data: contractor, error: contractorError } = await supabaseAdmin
    .from('tbf_contractors')
    .insert({
      user_id: userId,
      name,
      business_name: name,
      email,
      phone: phone || null,
      slug,
      city_id: cityRow?.id ?? null,
      status: 'pending',
      is_insured: false,
      is_bonded: false,
      is_background_checked: false,
      rating: 0,
      reviews_count: 0,
    })
    .select('id')
    .single()

  if (contractorError) throw new Error(contractorError.message)

  // Resolve and link all categories
  if (categorySlugs.length > 0) {
    const { data: categories } = await supabaseAdmin
      .from('tbf_categories')
      .select('id, slug')
      .in('slug', categorySlugs)

    if (categories?.length) {
      await supabaseAdmin.from('tbf_contractor_categories').insert(
        categories.map((c: { id: number; slug: string }) => ({
          contractor_id: contractor.id,
          category_id: c.id,
        }))
      )
    }
  }
}

function buildWelcomeEmail({ name, type, city }: { name: string; type: string; city?: string }) {
  if (type === 'client') {
    return `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px 24px;color:#111">
        <h1 style="font-size:22px;margin-bottom:8px">Welcome, ${name}!</h1>
        <p style="color:#555;line-height:1.6">
          Your account on <strong>TheBestFlorida</strong> is ready. You can now request quotes
          from verified local pros${city ? ` in ${city}` : ' across Florida'}.
        </p>
        <a href="https://www.thebestflorida.com" style="display:inline-block;margin-top:20px;background:#2563eb;color:#fff;font-weight:600;padding:10px 20px;border-radius:8px;text-decoration:none">
          Find a Pro
        </a>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
        <p style="font-size:12px;color:#9ca3af">TheBestFlorida — Find Top-Rated Service Pros in Florida</p>
      </div>
    `
  }
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px 24px;color:#111">
      <h1 style="font-size:22px;margin-bottom:8px">Welcome, ${name}!</h1>
      <p style="color:#555;line-height:1.6">
        Your contractor profile on <strong>TheBestFlorida</strong> is <strong>pending review</strong>.
        Our team will verify your profile within 1–2 business days.
      </p>
      ${city ? `<p style="color:#555;line-height:1.6;margin-top:12px">Once approved, you'll appear in search results for customers in <strong>${city}, Florida</strong>.</p>` : ''}
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
      <p style="font-size:12px;color:#9ca3af">TheBestFlorida — Find Top-Rated Service Pros in Florida</p>
    </div>
  `
}

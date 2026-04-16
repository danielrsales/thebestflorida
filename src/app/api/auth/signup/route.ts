import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

// Mark as dynamic so Next.js doesn't try to collect data at build time
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Lazy init — env vars only available at request time on Vercel
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

  const { name, email, password, phone, categorySlug, city } = await req.json()

  if (!name || !email || !password || !categorySlug || !city) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  // ── 1. Create Supabase Auth user ──────────────────────────────────────────
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const userId = authData.user.id

  try {
    // ── 2. Resolve category ID ──────────────────────────────────────────────
    const { data: category } = await supabaseAdmin
      .from('tbf_categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle()

    // ── 3. Resolve city ID (search by name, case-insensitive) ───────────────
    const { data: cityRow } = await supabaseAdmin
      .from('tbf_cities')
      .select('id')
      .ilike('name', city.trim())
      .maybeSingle()

    // ── 4. Build unique slug ────────────────────────────────────────────────
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const slug = `${baseSlug}-${Date.now()}`

    // ── 5. Create contractor record ─────────────────────────────────────────
    const { data: contractor, error: contractorError } = await supabaseAdmin
      .from('tbf_contractors')
      .insert({
        user_id: userId,
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

    // ── 6. Link category ────────────────────────────────────────────────────
    if (category?.id) {
      await supabaseAdmin.from('tbf_contractor_categories').insert({
        contractor_id: contractor.id,
        category_id: category.id,
      })
    }

    // ── 7. Send welcome email ───────────────────────────────────────────────
    if (resend) {
      await resend.emails.send({
        from: 'TheBestFlorida <noreply@thebestflorida.com>',
        to: email,
        subject: 'Welcome to TheBestFlorida!',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px 24px;color:#111">
            <h1 style="font-size:22px;margin-bottom:8px">Welcome, ${name}! 🎉</h1>
            <p style="color:#555;line-height:1.6">
              Your contractor account on <strong>TheBestFlorida</strong> has been created and is
              <strong>pending review</strong>. Our team will verify your profile within 1–2 business days.
            </p>
            <p style="color:#555;line-height:1.6;margin-top:16px">
              Once approved, you&apos;ll appear in search results for customers looking for
              ${categorySlug.replace(/-/g, ' ')} services in ${city}, Florida.
            </p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
            <p style="font-size:12px;color:#9ca3af">
              TheBestFlorida — Find Top-Rated Service Pros in Florida
            </p>
          </div>
        `,
      }).catch(() => {
        // Non-fatal: log but don't fail the request
        console.error('[signup] Failed to send welcome email to', email)
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    // Rollback: delete the auth user so the email isn't locked
    await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => null)
    const message = err instanceof Error ? err.message : 'Unexpected error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { Resend } from 'resend'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thebestflorida.com'

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendReviewVerificationEmail({
  to,
  name,
  contractorName,
  token,
}: {
  to: string
  name: string
  contractorName: string
  token: string
}): Promise<void> {
  const resend = getResend()
  if (!resend) {
    console.warn('[email-verification] RESEND_API_KEY not set, skipping email')
    return
  }

  const verifyUrl = `${SITE_URL}/review/verify/${token}`

  await resend.emails.send({
    from: 'TheBestFlorida <noreply@thebestflorida.com>',
    to,
    subject: `Verify your review for ${contractorName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px 24px;color:#111">
        <h1 style="font-size:20px;margin-bottom:8px">Almost there, ${name}!</h1>
        <p style="color:#555;line-height:1.6">
          Please verify your email to publish your review for <strong>${contractorName}</strong>.
        </p>
        <a href="${verifyUrl}"
          style="display:inline-block;margin-top:20px;background:#2563eb;color:#fff;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:15px">
          Verify My Review
        </a>
        <p style="margin-top:24px;font-size:13px;color:#888">
          This link expires in 48 hours. If you didn't submit a review, you can ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
        <p style="font-size:12px;color:#9ca3af">TheBestFlorida — Find Top-Rated Service Pros in Florida</p>
      </div>
    `,
  }).catch((err) => {
    console.error('[email-verification] Failed to send verification email:', err)
  })
}

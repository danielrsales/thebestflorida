import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
import { verifyReview } from '@/lib/reviews'

interface Props {
  params: { token: string }
}

export const metadata = {
  title: 'Verify Review — TheBestFlorida',
}

export default async function VerifyReviewPage({ params }: Props) {
  const review = await verifyReview(params.token)
  const success = !!review

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">
        {success ? (
          <>
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Review verified!</h1>
            <p className="text-gray-500 text-sm mb-6">
              Thank you! Your review has been verified and is now pending admin approval.
              It will be published shortly.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm"
            >
              Back to TheBestFlorida
            </Link>
          </>
        ) : (
          <>
            <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Link expired or invalid</h1>
            <p className="text-gray-500 text-sm mb-6">
              This verification link has already been used or has expired.
              If you recently submitted a review, it may already be verified.
            </p>
            <Link
              href="/"
              className="inline-block bg-gray-100 text-gray-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              Go to homepage
            </Link>
          </>
        )}
      </div>
    </main>
  )
}

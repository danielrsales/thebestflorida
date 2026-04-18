import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { ReviewForm } from '@/components/reviews/ReviewForm'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('tbf_contractors')
    .select('business_name')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .maybeSingle()
  if (!data) return {}
  return {
    title: `Review ${data.business_name} — TheBestFlorida`,
    description: `Share your experience with ${data.business_name}. Help others in Florida find trusted service professionals.`,
  }
}

export default async function ReviewPage({ params }: Props) {
  const supabase = createServerClient()
  const { data: contractor } = await supabase
    .from('tbf_contractors')
    .select('id, slug, business_name, city:tbf_cities(name)')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .maybeSingle()

  if (!contractor) notFound()

  const city = (contractor.city as unknown as { name: string } | null)?.name

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href={`/pro/${params.slug}`} className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <p className="text-xs text-gray-500">Writing a review for</p>
            <p className="font-bold text-gray-900">{contractor.business_name}{city ? ` — ${city}, FL` : ''}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className="w-8 h-8 text-yellow-400" fill="currentColor" />
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            How was your experience?
          </h1>
          <p className="text-gray-500 text-sm">
            Your review helps others in Florida find trusted professionals.
            We verify all reviews by email before publishing.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <ReviewForm
            contractorId={contractor.id}
            contractorSlug={contractor.slug}
            businessName={contractor.business_name}
          />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By submitting, you agree that your review is honest and based on a real experience.
        </p>
      </div>
    </main>
  )
}

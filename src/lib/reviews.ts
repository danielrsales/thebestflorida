import { createClient } from '@supabase/supabase-js'

export interface Review {
  id: string
  contractor_id: string
  reviewer_name: string
  reviewer_email: string
  reviewer_phone: string | null
  verified: boolean
  verification_token: string | null
  rating_overall: number
  rating_quality: number | null
  rating_punctuality: number | null
  rating_price: number | null
  rating_communication: number | null
  title: string | null
  content: string
  pros: string | null
  cons: string | null
  service_type: string | null
  project_cost_range: string | null
  project_date: string | null
  would_recommend: boolean
  photos: string[] | null
  contractor_response: string | null
  contractor_response_at: string | null
  status: 'pending' | 'approved' | 'rejected'
  approved_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function getApprovedReviews(contractorId: string): Promise<Review[]> {
  const supabase = getPublicClient()
  const { data } = await supabase
    .from('tbf_reviews')
    .select('*')
    .eq('contractor_id', contractorId)
    .eq('status', 'approved')
    .eq('verified', true)
    .order('created_at', { ascending: false })
  return (data ?? []) as Review[]
}

export async function createReview(
  review: Omit<Review, 'id' | 'verified' | 'status' | 'approved_at' | 'rejection_reason' | 'contractor_response' | 'contractor_response_at' | 'created_at' | 'updated_at'>
    & { verification_token: string }
): Promise<Review> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('tbf_reviews')
    .insert({ ...review, verified: false, status: 'pending' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as Review
}

export async function verifyReview(token: string): Promise<Review | null> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('tbf_reviews')
    .update({ verified: true, verification_token: null })
    .eq('verification_token', token)
    .select()
    .single()
  if (error || !data) return null
  return data as Review
}

export async function adminGetAllReviews(): Promise<(Review & { contractor_slug?: string; contractor_name?: string })[]> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('tbf_reviews')
    .select('*, contractor:tbf_contractors(slug, business_name)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r: Review & { contractor?: { slug: string; business_name: string } | null }) => ({
    ...r,
    contractor_slug: r.contractor?.slug,
    contractor_name: r.contractor?.business_name,
  }))
}

export async function adminApproveReview(id: string): Promise<void> {
  const supabase = getAdminClient()
  const { error } = await supabase
    .from('tbf_reviews')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function adminRejectReview(id: string, reason?: string): Promise<void> {
  const supabase = getAdminClient()
  const { error } = await supabase
    .from('tbf_reviews')
    .update({ status: 'rejected', rejection_reason: reason ?? null })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function addContractorResponse(reviewId: string, response: string): Promise<void> {
  const supabase = getAdminClient()
  const { error } = await supabase
    .from('tbf_reviews')
    .update({ contractor_response: response, contractor_response_at: new Date().toISOString() })
    .eq('id', reviewId)
  if (error) throw new Error(error.message)
}

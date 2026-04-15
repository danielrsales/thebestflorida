export interface Category {
  id: number
  name: string
  slug: string
  icon: string
  description: string | null
  lead_price: number
  display_order: number
}

export interface City {
  id: number
  name: string
  slug: string
  state: string
  county: string | null
  population: number | null
}

export interface Contractor {
  id: number
  slug: string
  business_name: string
  tagline: string | null
  description: string | null
  logo_url: string | null
  cover_image_url: string | null
  phone: string | null
  email: string | null
  website: string | null
  city_id: number | null
  city?: { name: string; slug: string } | null
  year_established: number | null
  is_insured: boolean
  is_bonded: boolean
  is_background_checked: boolean
  rating: number
  reviews_count: number
  response_time_hours: number | null
  is_verified: boolean
  is_sponsored: boolean
  sponsor_tier: string | null
  status: string
}

export interface ContractorReview {
  id: number
  contractor_id: number
  reviewer_name: string
  reviewer_location: string | null
  is_verified_customer: boolean
  rating: number
  title: string | null
  content: string | null
  project_type: string | null
  project_cost_range: string | null
  created_at: string
}

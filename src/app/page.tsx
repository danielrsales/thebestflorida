import { createServerClient } from '@/lib/supabase/server'
import { Hero } from '@/components/home/Hero'
import { PopularCategories } from '@/components/home/PopularCategories'
import { FeaturedPros } from '@/components/home/FeaturedPros'
import { DunaHubPartnership } from '@/components/home/DunaHubPartnership'
import { BlogSection } from '@/components/home/BlogSection'
import { FinalCTA } from '@/components/home/FinalCTA'

export const revalidate = 3600

interface BlogPost {
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  category: string | null
  published_at: string | null
  created_at: string
}

async function getFeaturedPros() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('tbf_contractors')
    .select('id, slug, business_name, logo_url, rating, reviews_count, tagline, city:tbf_cities(name), categories:tbf_contractor_categories(name:tbf_categories(name))')
    .eq('status', 'active')
    .order('rating', { ascending: false })
    .limit(4)
  return data ?? []
}

async function getRecentPosts(): Promise<BlogPost[]> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('tbf_posts')
    .select('slug, title, excerpt, cover_image, category, published_at, created_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(3)
  return (data ?? []) as BlogPost[]
}

export default async function HomePage() {
  const [pros, posts] = await Promise.all([getFeaturedPros(), getRecentPosts()])

  return (
    <>
      <Hero />
      <PopularCategories />
      <FeaturedPros pros={pros} />
      <DunaHubPartnership />
      <BlogSection posts={posts} />
      <FinalCTA />
    </>
  )
}

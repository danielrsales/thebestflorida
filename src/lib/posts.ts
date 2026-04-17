/**
 * Unified blog API.
 * Reads from tbf_posts (Supabase DB) first; falls back to MDX files for legacy posts.
 */

import { createClient } from '@supabase/supabase-js'
import readingTime from 'reading-time'
import { getAllPosts as getMdxPosts, getPostBySlug as getMdxPostBySlug } from '@/lib/blog'
import type { PostMeta, Post } from '@/lib/blog'

// ─── Supabase DB post ─────────────────────────────────────────────────────────

export interface DbPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  category: string | null
  author: string
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

function dbPostToMeta(p: DbPost): PostMeta {
  const stats = readingTime(p.content)
  return {
    slug: p.slug,
    title: p.title,
    date: (p.published_at ?? p.created_at).slice(0, 10),
    description: p.excerpt ?? '',
    author: p.author,
    category: p.category,
    city: null,
    image: p.cover_image,
    tags: [],
    readingTime: stats.text,
    draft: !p.published,
  }
}

function dbPostToPost(p: DbPost): Post {
  return { ...dbPostToMeta(p), content: p.content }
}

function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

// ─── Public API (used by /blog pages) ────────────────────────────────────────

/**
 * Returns all published posts: DB posts first (newest), then legacy MDX posts.
 * DB slugs override MDX slugs if they match.
 */
export async function getAllPostsCombined(): Promise<PostMeta[]> {
  const supabase = getPublicClient()

  const { data: dbPosts } = await supabase
    .from('tbf_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  const db: PostMeta[] = (dbPosts ?? []).map(dbPostToMeta)
  const dbSlugs = new Set(db.map((p) => p.slug))

  // MDX posts that don't conflict with DB slugs
  const mdx = getMdxPosts().filter((p) => !dbSlugs.has(p.slug))

  return [...db, ...mdx]
}

/**
 * Returns a single post by slug. DB takes precedence over MDX.
 */
export async function getPostBySlugCombined(slug: string): Promise<Post | null> {
  const supabase = getPublicClient()

  const { data } = await supabase
    .from('tbf_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (data) return dbPostToPost(data as DbPost)

  // Fallback to MDX file
  return getMdxPostBySlug(slug)
}

/**
 * Returns all published slugs (DB + MDX, deduped). Used by generateStaticParams.
 */
export async function getAllSlugsCombined(): Promise<string[]> {
  const posts = await getAllPostsCombined()
  return posts.map((p) => p.slug)
}

// ─── Admin API (used by admin pages + API routes) ─────────────────────────────

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export async function adminGetAllPosts(): Promise<DbPost[]> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('tbf_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as DbPost[]
}

export async function adminGetPost(slug: string): Promise<DbPost | null> {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from('tbf_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  return data as DbPost | null
}

export async function adminCreatePost(post: Omit<DbPost, 'id' | 'created_at' | 'updated_at'>): Promise<DbPost> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('tbf_posts')
    .insert({ ...post, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as DbPost
}

export async function adminUpdatePost(slug: string, update: Partial<DbPost>): Promise<DbPost> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('tbf_posts')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('slug', slug)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as DbPost
}

export async function adminDeletePost(slug: string): Promise<void> {
  const supabase = getAdminClient()
  const { error } = await supabase.from('tbf_posts').delete().eq('slug', slug)
  if (error) throw new Error(error.message)
}

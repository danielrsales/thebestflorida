import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PostMeta {
  slug: string
  title: string
  date: string           // ISO string "YYYY-MM-DD"
  description: string
  author: string
  category: string | null
  city: string | null
  image: string | null   // absolute path under /public, e.g. "/images/blog/foo.jpg"
  tags: string[]
  readingTime: string    // e.g. "5 min read"
  draft: boolean
}

export interface Post extends PostMeta {
  content: string        // raw MDX body (frontmatter stripped)
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog')

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseMeta(slug: string, raw: string): PostMeta {
  const { data, content } = matter(raw)
  const stats = readingTime(content)

  return {
    slug,
    title:       data.title        ?? 'Untitled',
    date:        data.date         ? String(data.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
    description: data.description  ?? '',
    author:      data.author       ?? 'Editorial Team',
    category:    data.category     ?? null,
    city:        data.city         ?? null,
    image:       data.image        ?? null,
    tags:        Array.isArray(data.tags) ? data.tags : [],
    readingTime: stats.text,
    draft:       data.draft        ?? false,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Returns all published posts sorted by date descending. */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => /\.(md|mdx)$/.test(f))

  const posts = files.map((file) => {
    const slug = file.replace(/\.(md|mdx)$/, '')
    const raw  = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8')
    return parseMeta(slug, raw)
  })

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Returns a single post's metadata + raw MDX body (frontmatter stripped). */
export function getPostBySlug(slug: string): Post | null {
  const candidates = [
    path.join(CONTENT_DIR, `${slug}.mdx`),
    path.join(CONTENT_DIR, `${slug}.md`),
  ]

  const filePath = candidates.find((p) => fs.existsSync(p))
  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)

  return {
    ...parseMeta(slug, raw),
    content, // body with frontmatter stripped
  }
}

/** Returns all published post slugs (for generateStaticParams). */
export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug)
}

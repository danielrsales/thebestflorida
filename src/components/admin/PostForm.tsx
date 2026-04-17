'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Eye, EyeOff, Upload, X, ExternalLink } from 'lucide-react'
import { MarkdownEditor } from '@/components/admin/MarkdownEditor'
import { createClient } from '@/lib/supabase/client'
import type { DbPost } from '@/lib/posts'

interface PostFormProps {
  initial?: Partial<DbPost>
  mode: 'create' | 'edit'
}

const CATEGORIES = [
  'home-services', 'legal', 'health', 'education', 'dining',
  'entertainment', 'sports', 'real-estate', 'automotive', 'beauty',
  'travel', 'nightlife', 'pets', 'events', 'general',
]

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function PostForm({ initial = {}, mode }: PostFormProps) {
  const router = useRouter()

  const [title, setTitle]       = useState(initial.title ?? '')
  const [slug, setSlug]         = useState(initial.slug ?? '')
  const [slugEdited, setSlugEdited] = useState(!!initial.slug)
  const [excerpt, setExcerpt]   = useState(initial.excerpt ?? '')
  const [content, setContent]   = useState(initial.content ?? '')
  const [coverImage, setCoverImage] = useState(initial.cover_image ?? '')
  const [category, setCategory] = useState(initial.category ?? '')
  const [author, setAuthor]     = useState(initial.author ?? 'TheBestFlorida Team')
  const [published, setPublished] = useState(initial.published ?? false)

  const [saving, setSaving]         = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [error, setError]           = useState('')

  // Auto-generate slug from title
  function handleTitleChange(v: string) {
    setTitle(v)
    if (!slugEdited) setSlug(slugify(v))
  }

  function handleSlugChange(v: string) {
    setSlug(slugify(v))
    setSlugEdited(true)
  }

  // Cover image upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10 MB.'); return }

    setUploadingImg(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `blog/${Date.now()}-${slug || 'cover'}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('blog-images')
      .upload(path, file, { upsert: true })

    if (uploadErr) { setError(uploadErr.message); setUploadingImg(false); return }

    const { data } = supabase.storage.from('blog-images').getPublicUrl(path)
    setCoverImage(data.publicUrl)
    setUploadingImg(false)
  }

  async function handleSubmit(e: React.FormEvent, publishNow?: boolean) {
    e.preventDefault()
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError('Title, slug, and content are required.')
      return
    }
    setError('')
    setSaving(true)

    const isPublished = publishNow !== undefined ? publishNow : published

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      cover_image: coverImage || null,
      category: category || null,
      author: author.trim() || 'TheBestFlorida Team',
      published: isPublished,
      published_at: isPublished ? (initial.published_at ?? new Date().toISOString()) : null,
    }

    const url = mode === 'create'
      ? '/api/admin/blog'
      : `/api/admin/blog/${initial.slug}`

    const res = await fetch(url, {
      method: mode === 'create' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const json = await res.json()
    setSaving(false)

    if (!res.ok) { setError(json.error ?? 'Failed to save.'); return }

    router.push('/admin/blog')
    router.refresh()
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col flex-1 min-h-0">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="text-gray-400 hover:text-gray-100 text-sm transition-colors"
          >
            ← Posts
          </button>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300 text-sm font-medium">{mode === 'create' ? 'New post' : title || 'Edit'}</span>
        </div>

        <div className="flex items-center gap-2">
          {published && initial.slug && (
            <a
              href={`/blog/${initial.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View
            </a>
          )}

          {/* Save draft */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, false)}
            disabled={saving}
            className="flex items-center gap-1.5 text-sm text-gray-300 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <EyeOff className="w-3.5 h-3.5" />
            Save draft
          </button>

          {/* Publish */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
            disabled={saving}
            className="flex items-center gap-1.5 text-sm text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
            {published ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Main: title + content */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto gap-4 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title…"
            className="w-full text-2xl font-bold bg-transparent text-gray-100 placeholder:text-gray-600 border-none outline-none"
          />

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="flex-1 bg-transparent text-gray-400 outline-none border-b border-gray-700 focus:border-blue-500 focus:text-gray-200 transition-colors pb-0.5"
              placeholder="post-slug"
            />
          </div>

          <div className="flex-1 min-h-[400px]">
            <MarkdownEditor value={content} onChange={setContent} height={550} />
          </div>
        </div>

        {/* Right sidebar: meta */}
        <aside className="w-72 shrink-0 border-l border-gray-700 overflow-y-auto p-5 space-y-5">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPublished(false)}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                  !published
                    ? 'border-gray-500 bg-gray-700 text-gray-200'
                    : 'border-gray-700 text-gray-500 hover:text-gray-300'
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setPublished(true)}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                  published
                    ? 'border-green-600 bg-green-900/40 text-green-400'
                    : 'border-gray-700 text-gray-500 hover:text-gray-300'
                }`}
              >
                Published
              </button>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Excerpt</label>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description for SEO and card preview…"
              className="w-full bg-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:border-blue-500 resize-none placeholder:text-gray-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="">— None —</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cover image</label>
            {coverImage ? (
              <div className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="Cover" className="w-full aspect-video object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg py-6 cursor-pointer hover:border-blue-500 transition-colors">
                {uploadingImg ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-500 mb-1" />
                    <span className="text-xs text-gray-500">Upload image</span>
                    <span className="text-[10px] text-gray-600 mt-0.5">Max 10 MB</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImg} />
              </label>
            )}
            {/* Or paste URL */}
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Or paste image URL…"
              className="mt-2 w-full bg-gray-700 text-gray-400 text-xs rounded-lg px-2.5 py-1.5 border border-gray-600 focus:outline-none focus:border-blue-500 placeholder:text-gray-600"
            />
          </div>

          {/* Save indicator */}
          <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-700">
            <Save className="w-3.5 h-3.5" />
            <span>Cmd+S not supported — use buttons above</span>
          </div>
        </aside>
      </div>
    </form>
  )
}

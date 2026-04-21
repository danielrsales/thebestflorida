import { NextResponse } from 'next/server'
import { adminCreatePost } from '@/lib/posts'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const post = await adminCreatePost({
      title: 'Debug Blog Test',
      slug: `debug-blog-${Date.now()}`,
      content: 'Test content from adminCreatePost',
      excerpt: null,
      cover_image: null,
      category: null,
      author: 'Debug',
      published: false,
      published_at: null,
    })
    return NextResponse.json({ success: true, post })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}

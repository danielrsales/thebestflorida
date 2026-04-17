import { notFound } from 'next/navigation'
import { adminGetPost } from '@/lib/posts'
import { PostForm } from '@/components/admin/PostForm'

interface Props {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: Props) {
  const post = await adminGetPost(params.slug)
  if (!post) notFound()

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <PostForm mode="edit" initial={post} />
    </div>
  )
}

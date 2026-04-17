import { PostForm } from '@/components/admin/PostForm'

export default function NewPostPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <PostForm mode="create" />
    </div>
  )
}

import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, FileText, LogOut } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth('/login')

  // Verify admin
  const supabase = createServerClient()
  const { data: contractor } = await supabase
    .from('tbf_contractors')
    .select('is_admin')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!contractor?.is_admin) redirect('/')

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-gray-800 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-800">
          <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">Admin</span>
          <br />
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to site
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>
          <Link
            href="/admin/blog"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Blog Posts
          </Link>
        </nav>

        <div className="px-3 pb-4 border-t border-gray-800 pt-3">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-900/30 hover:text-red-400 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}

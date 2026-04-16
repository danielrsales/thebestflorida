import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth('/login')

  // Only contractors (role = 'contractor' or no role set yet) can access dashboard
  const role = user.user_metadata?.role as string | undefined
  if (role === 'client') redirect('/account')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}

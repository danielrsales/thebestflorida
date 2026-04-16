'use client'

import { useAuth } from '@/providers/AuthProvider'
import { Bell } from 'lucide-react'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
            {(user?.user_metadata?.name as string)?.[0]?.toUpperCase() ?? 'P'}
          </div>
          <div className="text-sm hidden sm:block">
            <p className="font-medium text-gray-900 leading-tight">
              {(user?.user_metadata?.name as string) ?? 'Pro'}
            </p>
            <p className="text-xs text-gray-500 truncate max-w-[140px]">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

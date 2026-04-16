import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: { value: string; positive: boolean }
  color?: 'blue' | 'green' | 'orange' | 'purple'
}

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   ring: 'bg-blue-100' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  ring: 'bg-green-100' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', ring: 'bg-orange-100' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', ring: 'bg-purple-100' },
}

export function StatsCard({ label, value, icon: Icon, trend, color = 'blue' }: StatsCardProps) {
  const c = colorMap[color]
  return (
    <div className={cn('rounded-xl border p-5 flex items-start gap-4', c.bg)}>
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', c.ring)}>
        <Icon className={cn('w-5 h-5', c.icon)} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        {trend && (
          <p className={cn('text-xs mt-0.5', trend.positive ? 'text-green-600' : 'text-red-500')}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </div>
  )
}

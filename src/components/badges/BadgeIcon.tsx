import {
  BadgeCheck, Shield, UserCheck, Star, Zap, Trophy,
  Clock, Briefcase, CheckCircle, HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BADGE_COLORS } from '@/lib/badges'
import type { ContractorBadge } from '@/lib/badges'

const ICON_MAP: Record<string, React.ElementType> = {
  BadgeCheck, Shield, UserCheck, Star, Zap, Trophy,
  Clock, Briefcase, CheckCircle,
}

interface BadgeIconProps {
  badge: ContractorBadge['badge']
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function BadgeIcon({ badge, size = 'md', showLabel = true }: BadgeIconProps) {
  if (!badge) return null

  const Icon = ICON_MAP[badge.icon ?? ''] ?? HelpCircle
  const colorClass = BADGE_COLORS[badge.color] ?? BADGE_COLORS.blue
  const sizeMap = {
    sm: { icon: 'w-3 h-3', text: 'text-xs', pad: 'px-2 py-0.5' },
    md: { icon: 'w-3.5 h-3.5', text: 'text-xs', pad: 'px-2.5 py-1' },
    lg: { icon: 'w-4 h-4', text: 'text-sm', pad: 'px-3 py-1.5' },
  }
  const s = sizeMap[size]

  return (
    <span
      title={badge.description ?? badge.name}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        colorClass, s.pad, s.text
      )}
    >
      <Icon className={s.icon} />
      {showLabel && badge.name}
    </span>
  )
}

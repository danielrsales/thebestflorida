import { BadgeIcon } from './BadgeIcon'
import type { ContractorBadge } from '@/lib/badges'

interface BadgeListProps {
  badges: ContractorBadge[]
  size?: 'sm' | 'md' | 'lg'
  maxVisible?: number
}

export function BadgeList({ badges, size = 'md', maxVisible }: BadgeListProps) {
  if (badges.length === 0) return null

  const visible = maxVisible ? badges.slice(0, maxVisible) : badges
  const hidden = maxVisible ? badges.length - maxVisible : 0

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((cb) => (
        <BadgeIcon key={cb.id} badge={cb.badge} size={size} />
      ))}
      {hidden > 0 && (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-gray-200 text-xs text-gray-500 bg-gray-50">
          +{hidden} more
        </span>
      )}
    </div>
  )
}

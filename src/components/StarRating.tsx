import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number          // 0–5, supports decimals
  count?: number          // review count to display
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean    // show the numeric rating
  className?: string
}

export function StarRating({
  rating,
  count,
  size = 'md',
  showNumber = true,
  className,
}: StarRatingProps) {
  const sizeMap = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' }
  const textMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }
  const starSize = sizeMap[size]
  const textSize = textMap[size]

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.min(1, Math.max(0, rating - (i - 1)))
          return (
            <span key={i} className="relative inline-block">
              {/* Empty star */}
              <Star className={cn(starSize, 'text-gray-200')} fill="currentColor" />
              {/* Filled overlay */}
              {fill > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star className={cn(starSize, 'text-yellow-400')} fill="currentColor" />
                </span>
              )}
            </span>
          )
        })}
      </div>

      {showNumber && (
        <span className={cn('font-semibold text-gray-800', textSize)}>
          {rating.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className={cn('text-gray-500', textSize)}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}

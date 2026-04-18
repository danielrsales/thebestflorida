'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StarRatingInput({ value, onChange, label, size = 'md', className }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0)
  const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  const starSize = sizeMap[size]

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                starSize,
                'transition-colors',
                (hovered || value) >= i ? 'text-yellow-400' : 'text-gray-200'
              )}
              fill="currentColor"
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-1 text-sm text-gray-500">
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][value]}
          </span>
        )}
      </div>
    </div>
  )
}

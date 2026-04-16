'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  max?: number
  id?: string
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Search…',
  max,
  id,
}: ComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase())
      )
    : options

  const selectedOptions = options.filter((o) => value.includes(o.value))

  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      if (max && value.length >= max) return
      onChange([...value, optionValue])
    }
    setQuery('')
  }

  function remove(optionValue: string, e: React.MouseEvent) {
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <div
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id ?? 'combobox'}-listbox`}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'min-h-[38px] w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer',
          'flex flex-wrap items-center gap-1.5',
          'focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent',
          open && 'ring-2 ring-blue-500 border-transparent'
        )}
      >
        {selectedOptions.map((o) => (
          <span
            key={o.value}
            className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full"
          >
            {o.label}
            <button
              type="button"
              onClick={(e) => remove(o.value, e)}
              className="hover:text-blue-900"
              tabIndex={-1}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] outline-none bg-transparent text-sm placeholder:text-gray-400"
          onClick={(e) => e.stopPropagation()}
        />

        <ChevronDown className={cn('w-4 h-4 text-gray-400 ml-auto flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </div>

      {/* Dropdown */}
      {open && (
        <div id={`${id ?? 'combobox'}-listbox`} role="listbox" className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-400">No results.</p>
          ) : (
            filtered.map((option) => {
              const selected = value.includes(option.value)
              const atMax = !selected && max !== undefined && value.length >= max
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={atMax}
                  onClick={() => toggle(option.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm text-left',
                    'hover:bg-gray-50 transition-colors',
                    selected && 'text-blue-700 bg-blue-50',
                    atMax && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  {option.label}
                  {selected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                </button>
              )
            })
          )}
        </div>
      )}

      {max && (
        <p className="mt-1 text-xs text-gray-400">
          {value.length}/{max} selected
        </p>
      )}
    </div>
  )
}

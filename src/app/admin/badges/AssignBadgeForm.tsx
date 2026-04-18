'use client'

import { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import type { Badge } from '@/lib/badges'

interface AssignBadgeFormProps {
  contractorId: string
  badges: Badge[]
  assignedBadgeIds: string[]
}

export function AssignBadgeForm({ contractorId, badges, assignedBadgeIds }: AssignBadgeFormProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [assigned, setAssigned] = useState<Set<string>>(new Set(assignedBadgeIds))
  const [selectedBadgeId, setSelectedBadgeId] = useState('')

  async function assign() {
    if (!selectedBadgeId) return
    setLoading('assign')
    const res = await fetch('/api/contractor-badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractor_id: contractorId, badge_id: selectedBadgeId }),
    })
    setLoading(null)
    if (res.ok) {
      setAssigned((prev) => new Set(Array.from(prev).concat(selectedBadgeId)))
      setSelectedBadgeId('')
    } else {
      alert('Failed to assign badge.')
    }
  }

  async function revoke(badgeId: string) {
    setLoading(badgeId)
    const res = await fetch('/api/contractor-badges', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractor_id: contractorId, badge_id: badgeId }),
    })
    setLoading(null)
    if (res.ok) {
      setAssigned((prev) => new Set(Array.from(prev).filter((id) => id !== badgeId)))
    } else {
      alert('Failed to revoke badge.')
    }
  }

  const available = badges.filter((b) => !assigned.has(b.id))

  return (
    <div className="flex flex-col gap-2 shrink-0">
      {/* Revoke buttons */}
      <div className="flex flex-wrap gap-1">
        {Array.from(assigned).map((badgeId) => {
          const badge = badges.find((b) => b.id === badgeId)
          if (!badge) return null
          return (
            <button
              key={badgeId}
              onClick={() => revoke(badgeId)}
              disabled={loading === badgeId}
              title={`Remove ${badge.name}`}
              className="flex items-center gap-1 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full hover:bg-red-900/40 hover:text-red-400 transition-colors"
            >
              {loading === badgeId ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
              {badge.name}
            </button>
          )
        })}
      </div>

      {/* Assign dropdown */}
      {available.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedBadgeId}
            onChange={(e) => setSelectedBadgeId(e.target.value)}
            className="text-xs bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-gray-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">— Add badge —</option>
            {available.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <button
            onClick={assign}
            disabled={!selectedBadgeId || loading === 'assign'}
            className="flex items-center gap-1 text-xs bg-blue-900/40 text-blue-400 border border-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-900/60 transition-colors disabled:opacity-50"
          >
            {loading === 'assign' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Assign
          </button>
        </div>
      )}
    </div>
  )
}

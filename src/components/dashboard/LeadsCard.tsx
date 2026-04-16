import Link from 'next/link'
import { ExternalLink, Inbox } from 'lucide-react'

interface Lead {
  id: string | number
  name: string
  service: string
  city?: string
  created_at: string
}

interface LeadsCardProps {
  leads: Lead[]
  dunahubUrl?: string
}

export function LeadsCard({ leads, dunahubUrl = 'https://app.dunahub.com' }: LeadsCardProps) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h2 className="font-semibold text-gray-900">Recent Leads</h2>
        <Link
          href={dunahubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Manage in DunaHub
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
          <Inbox className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No leads yet.</p>
          <p className="text-xs text-gray-400 mt-1">
            Leads from customers will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y">
          {leads.map((lead) => (
            <li key={lead.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {lead.service}{lead.city ? ` · ${lead.city}` : ''}
                </p>
              </div>
              <span className="text-xs text-gray-400 ml-4 shrink-0">
                {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* DunaHub promo banner */}
      <div className="bg-blue-50 border-t px-5 py-3 flex items-center justify-between gap-4">
        <p className="text-xs text-blue-700">
          Manage your full CRM pipeline on <strong>DunaHub</strong>
        </p>
        <Link
          href={dunahubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Open DunaHub
        </Link>
      </div>
    </div>
  )
}

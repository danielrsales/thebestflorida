'use client'

import { Check, Search, ClipboardList, MessageSquare, ExternalLink } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

const FREE_FEATURES = [
  'Public profile on TheBestFlorida',
  'Appear in search results',
  'Receive lead notifications',
  'Free CRM to manage your leads (DunaHub)',
  'Eligible for Top 15 certification',
]

const LEAD_STEPS = [
  { icon: Search, label: 'Homeowner searches for a service' },
  { icon: ClipboardList, label: 'Lead is created in your CRM' },
  { icon: MessageSquare, label: 'You respond and close the deal' },
]

export default function SubscriptionPage() {
  return (
    <>
      <DashboardHeader
        title="Your Plan"
        subtitle="Everything you need to grow your business in Florida"
      />
      <main className="flex-1 p-6 space-y-6 max-w-2xl">

        {/* Free plan card */}
        <div className="rounded-2xl border-2 border-green-400 bg-white p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xl font-bold text-gray-900">Free</p>
              <p className="text-sm text-gray-500 mt-0.5">forever</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              <Check className="w-3 h-3" />
              Current plan
            </span>
          </div>

          <ul className="space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* How leads work */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5">
          <div>
            <h2 className="font-semibold text-gray-900">How you receive leads</h2>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              When Florida homeowners search for services on TheBestFlorida, their requests become
              leads. All leads are managed through DunaHub, your free CRM.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {LEAD_STEPS.map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex items-center gap-3 sm:gap-0 flex-1">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 w-full sm:w-auto flex-1">
                  <Icon className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-xs text-gray-700 leading-snug">{label}</span>
                </div>
                {i < LEAD_STEPS.length - 1 && (
                  <span className="text-gray-300 text-lg font-light hidden sm:block mx-2">→</span>
                )}
              </div>
            ))}
          </div>

          <a
            href="https://dunahub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            Open DunaHub
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Coming soon */}
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Coming soon</span>
          </div>
          <h2 className="font-semibold text-gray-700">Lead credits</h2>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
            Soon you&apos;ll be able to purchase lead credits to access exclusive marketplace
            opportunities from homeowners in your area.
          </p>
        </div>

      </main>
    </>
  )
}

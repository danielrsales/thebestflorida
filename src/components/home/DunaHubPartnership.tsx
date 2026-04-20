import { CheckCircle, ExternalLink } from 'lucide-react'

const BENEFITS = [
  'Visual sales pipeline',
  'Lead management dashboard',
  'WhatsApp integration',
  'Automated follow-ups',
  'Customer quotes & invoices',
]

export function DunaHubPartnership() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #60a5fa 1px, transparent 0)', backgroundSize: '48px 48px' }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              Partner Program
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Powered by{' '}
              <span className="text-blue-400">DunaHub</span>
            </h2>

            <p className="text-lg font-semibold text-blue-300 mb-4">
              Free CRM for Florida Service Businesses
            </p>

            <p className="text-gray-400 leading-relaxed mb-8">
              TheBestFlorida partners with DunaHub to help local businesses deliver exceptional
              customer service. Every contractor on our platform gets <strong className="text-white">FREE access</strong> to
              professional tools built for service companies.
            </p>

            <ul className="space-y-3 mb-8">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <a
                href="https://dunahub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Get Your Free CRM
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-2 rounded-xl font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                100% Free for TheBestFlorida contractors
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-sm mx-auto">
              {/* Mock CRM card */}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">DunaHub CRM</p>
                    <p className="text-white font-bold text-lg">Sales Pipeline</p>
                  </div>
                  <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">D</span>
                  </div>
                </div>

                {/* Pipeline columns */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: 'New Leads', count: 8, color: 'bg-blue-500' },
                    { label: 'In Progress', count: 5, color: 'bg-yellow-500' },
                    { label: 'Closed', count: 12, color: 'bg-green-500' },
                  ].map((col) => (
                    <div key={col.label} className="bg-gray-800 rounded-xl p-3 text-center">
                      <div className={`w-6 h-1.5 ${col.color} rounded-full mx-auto mb-2`} />
                      <p className="text-xl font-bold text-white">{col.count}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{col.label}</p>
                    </div>
                  ))}
                </div>

                {/* Mock leads */}
                <div className="space-y-2">
                  {[
                    { name: 'Mike Johnson', service: 'Lawn Maintenance', value: '$350' },
                    { name: 'Sarah Williams', service: 'Pool Cleaning', value: '$180' },
                    { name: 'Carlos Reyes', service: 'HVAC Repair', value: '$620' },
                  ].map((lead) => (
                    <div key={lead.name} className="flex items-center justify-between bg-gray-800/60 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600/40 flex items-center justify-center text-xs text-blue-300 font-bold">
                          {lead.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-200">{lead.name}</p>
                          <p className="text-xs text-gray-500">{lead.service}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-green-400">{lead.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                  <p className="text-xs text-gray-500">Revenue this month</p>
                  <p className="text-sm font-bold text-white">$4,820</p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                FREE
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

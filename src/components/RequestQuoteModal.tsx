'use client'

import { useState } from 'react'
import { X, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { TABLES } from '@/types'
import type { Contractor } from '@/types'

interface RequestQuoteModalProps {
  contractor: Contractor
  categorySlug?: string
  open: boolean
  onClose: () => void
}

type Step = 'form' | 'success'

export function RequestQuoteModal({ contractor, categorySlug, open, onClose }: RequestQuoteModalProps) {
  const [step, setStep] = useState<Step>('form')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: '',
  })

  function patch(update: Partial<typeof fields>) {
    setFields((f) => ({ ...f, ...update }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const supabase = createClient()
      const { error: dbError } = await supabase
        .from(TABLES.quote_requests)
        .insert({
          contractor_id: contractor.id,
          name:         fields.name.trim(),
          email:        fields.email.trim(),
          phone:        fields.phone.trim(),
          city:         fields.city.trim() || null,
          message:      fields.message.trim(),
          service_type: categorySlug ?? null,
        })

      if (dbError) throw dbError
      setStep('success')
    } catch {
      setError('Something went wrong. Please try again or call directly.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    onClose()
    // reset after animation
    setTimeout(() => { setStep('form'); setError(null); setFields({ name: '', email: '', phone: '', city: '', message: '' }) }, 300)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-200 font-medium">Request a free quote from</p>
            <h2 className="text-white font-bold text-lg leading-tight">{contractor.business_name}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-blue-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'success' ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quote request sent!</h3>
            <p className="text-gray-500 text-sm mb-6">
              {contractor.business_name} will contact you shortly.
              {contractor.response_time_hours && (
                <> They typically respond within <strong>{contractor.response_time_hours} hours</strong>.</>
              )}
            </p>
            {contractor.phone && (
              <p className="text-sm text-gray-500 mb-6">
                Need it faster?{' '}
                <a href={`tel:${contractor.phone}`} className="text-blue-600 font-semibold hover:underline">
                  Call directly: {contractor.phone}
                </a>
              </p>
            )}
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Your name *</label>
                <Input
                  required
                  placeholder="John Smith"
                  value={fields.name}
                  onChange={(e) => patch({ name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                <Input
                  required
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={fields.phone}
                  onChange={(e) => patch({ phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
              <Input
                required
                type="email"
                placeholder="you@email.com"
                value={fields.email}
                onChange={(e) => patch({ email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Your city</label>
              <Input
                placeholder="e.g. Miami, Tampa, Orlando"
                value={fields.city}
                onChange={(e) => patch({ city: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Describe your project *</label>
              <textarea
                required
                rows={3}
                placeholder="Tell them what you need done, timeline, any specific requirements..."
                value={fields.message}
                onChange={(e) => patch({ message: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 text-base"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
              ) : (
                'Send Free Quote Request'
              )}
            </Button>

            <p className="text-xs text-gray-400 text-center">
              No spam. Your info is only shared with {contractor.business_name}.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

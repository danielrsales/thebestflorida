'use client'

import { useState } from 'react'
import { Loader2, CheckCircle, Upload, X } from 'lucide-react'
import { StarRatingInput } from './StarRatingInput'
import { createClient } from '@/lib/supabase/client'

interface ReviewFormProps {
  contractorId: string
  contractorSlug: string
  businessName: string
}

const SERVICE_TYPES = [
  'Repair', 'Installation', 'Maintenance', 'Inspection',
  'Cleaning', 'Renovation', 'New Construction', 'Consultation', 'Other',
]

const COST_RANGES = [
  'Under $500', '$500–$1,000', '$1,000–$5,000',
  '$5,000–$10,000', '$10,000–$25,000', 'Over $25,000',
]

export function ReviewForm({ contractorId, contractorSlug, businessName }: ReviewFormProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [uploadingPhotos, setUploadingPhotos] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [ratingOverall, setRatingOverall] = useState(0)
  const [ratingQuality, setRatingQuality] = useState(0)
  const [ratingPunctuality, setRatingPunctuality] = useState(0)
  const [ratingPrice, setRatingPrice] = useState(0)
  const [ratingComm, setRatingComm] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [costRange, setCostRange] = useState('')
  const [wouldRecommend, setWouldRecommend] = useState(true)
  const [photos, setPhotos] = useState<string[]>([])

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (photos.length + files.length > 5) { setError('Maximum 5 photos.'); return }

    setUploadingPhotos(true)
    const supabase = createClient()
    const uploaded: string[] = []

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) { setError('Each photo must be under 10 MB.'); continue }
      const ext = file.name.split('.').pop()
      const path = `reviews/${contractorSlug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('blog-images').upload(path, file, { upsert: true })
      if (uploadErr) { setError(uploadErr.message); continue }
      const { data } = supabase.storage.from('blog-images').getPublicUrl(path)
      uploaded.push(data.publicUrl)
    }

    setPhotos((prev) => [...prev, ...uploaded])
    setUploadingPhotos(false)
    e.target.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !content.trim() || ratingOverall === 0) {
      setError('Please fill in your name, email, rating, and review.')
      return
    }
    setError('')
    setSubmitting(true)

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contractor_id: contractorId,
        reviewer_name: name.trim(),
        reviewer_email: email.trim(),
        reviewer_phone: phone.trim() || null,
        rating_overall: ratingOverall,
        rating_quality: ratingQuality || null,
        rating_punctuality: ratingPunctuality || null,
        rating_price: ratingPrice || null,
        rating_communication: ratingComm || null,
        title: title.trim() || null,
        content: content.trim(),
        pros: pros.trim() || null,
        cons: cons.trim() || null,
        service_type: serviceType || null,
        project_cost_range: costRange || null,
        would_recommend: wouldRecommend,
        photos: photos.length ? photos : null,
      }),
    })

    const json = await res.json()
    setSubmitting(false)

    if (!res.ok) { setError(json.error ?? 'Failed to submit review.'); return }
    setStep('success')
  }

  if (step === 'success') {
    return (
      <div className="text-center py-12 px-4">
        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Review submitted!</h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          We sent a verification link to your email. Please click it to publish your review.
        </p>
        <p className="text-sm text-gray-400 mt-4">Check your spam folder if you don&apos;t see it within a few minutes.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Your info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Your Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)} required
              placeholder="John Smith"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="john@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
            <input
              type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Overall rating */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Overall Rating *</h3>
        <StarRatingInput value={ratingOverall} onChange={setRatingOverall} size="lg" />
      </div>

      {/* Sub-ratings */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Rate by Category (optional)</h3>
        <div className="grid grid-cols-2 gap-3">
          <StarRatingInput value={ratingQuality} onChange={setRatingQuality} label="Quality of Work" />
          <StarRatingInput value={ratingPunctuality} onChange={setRatingPunctuality} label="Punctuality" />
          <StarRatingInput value={ratingPrice} onChange={setRatingPrice} label="Price / Value" />
          <StarRatingInput value={ratingComm} onChange={setRatingComm} label="Communication" />
        </div>
      </div>

      {/* Review content */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Your Review</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Title (optional)</label>
          <input
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review *</label>
          <textarea
            rows={5} value={content} onChange={(e) => setContent(e.target.value)} required
            placeholder={`Tell others about your experience with ${businessName}…`}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What did you like? (optional)</label>
            <textarea
              rows={2} value={pros} onChange={(e) => setPros(e.target.value)}
              placeholder="Pros…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What could be improved? (optional)</label>
            <textarea
              rows={2} value={cons} onChange={(e) => setCons(e.target.value)}
              placeholder="Cons…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Project details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Project Details (optional)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option value="">— Select —</option>
              {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Cost</label>
            <select value={costRange} onChange={(e) => setCostRange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
              <option value="">— Select —</option>
              {COST_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="recommend" checked={wouldRecommend} onChange={(e) => setWouldRecommend(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label htmlFor="recommend" className="text-sm text-gray-700">I would recommend {businessName}</label>
        </div>
      </div>

      {/* Photos */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Add Photos (optional)</h3>
        <div className="flex flex-wrap gap-2">
          {photos.map((url, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Photo ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
              <button type="button" onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {photos.length < 5 && (
            <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
              {uploadingPhotos ? (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-0.5">Add photo</span>
                </>
              )}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhotos} />
            </label>
          )}
        </div>
        <p className="text-xs text-gray-400">Up to 5 photos, max 10 MB each</p>
      </div>

      <button
        type="submit"
        disabled={submitting || ratingOverall === 0}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Submit Review
      </button>

      <p className="text-xs text-gray-400 text-center">
        Your review will be published after email verification and admin approval.
      </p>
    </form>
  )
}

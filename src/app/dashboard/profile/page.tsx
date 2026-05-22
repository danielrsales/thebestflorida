'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/providers/AuthProvider'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Combobox, type ComboboxOption } from '@/components/ui/Combobox'

interface ContractorProfile {
  id: number
  name: string
  business_name: string
  tagline: string | null
  description: string | null
  phone: string | null
  email: string | null
  website: string | null
  city: string | null
  state: string | null
  year_established: number | null
  license_number: string | null
  service_area: string | null
  is_insured: boolean
  is_bonded: boolean
  is_background_checked: boolean
}

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [profile, setProfile] = useState<ContractorProfile | null>(null)
  const [categoryOptions, setCategoryOptions] = useState<ComboboxOption[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [contractorId, setContractorId] = useState<number | null>(null)

  function patch(update: Partial<ContractorProfile>) {
    setProfile((p) => p ? { ...p, ...update } : p)
  }

  useEffect(() => {
    if (!user) return
    const supabase = createClient()

    Promise.all([
      supabase
        .from('tbf_contractors')
        .select('id, name, business_name, tagline, description, phone, email, website, city, state, year_established, license_number, service_area, is_insured, is_bonded, is_background_checked')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('tbf_categories')
        .select('id, name, slug')
        .order('name'),
    ]).then(([{ data: contractor }, { data: categories }]) => {
      if (contractor) {
        setProfile(contractor as ContractorProfile)
        setContractorId(contractor.id)

        supabase
          .from('tbf_contractor_categories')
          .select('category_id, tbf_categories(slug)')
          .eq('contractor_id', contractor.id)
          .then(({ data: links }) => {
            const slugs = (links ?? []).flatMap((l) => {
              const cat = l.tbf_categories as unknown as { slug: string } | null
              return cat ? [cat.slug] : []
            })
            setSelectedCategories(slugs)
          })
      }
      if (categories) {
        setCategoryOptions(categories.map((c) => ({ value: c.slug, label: c.name })))
      }
      setLoading(false)
    })
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile || !contractorId) return
    setError('')
    setSaving(true)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from('tbf_contractors')
        .update({
          name: profile.name,
          business_name: profile.business_name,
          tagline: profile.tagline || null,
          description: profile.description || null,
          phone: profile.phone || null,
          email: profile.email || null,
          website: profile.website || null,
          city: profile.city || null,
          state: profile.state || 'Florida',
          year_established: profile.year_established || null,
          license_number: profile.license_number || null,
          service_area: profile.service_area || null,
          is_insured: profile.is_insured,
          is_bonded: profile.is_bonded,
          is_background_checked: profile.is_background_checked,
        })
        .eq('id', contractorId)

      if (updateError) throw updateError

      // Sync categories
      await supabase
        .from('tbf_contractor_categories')
        .delete()
        .eq('contractor_id', contractorId)

      if (selectedCategories.length > 0) {
        const { data: cats } = await supabase
          .from('tbf_categories')
          .select('id, slug')
          .in('slug', selectedCategories)

        if (cats?.length) {
          await supabase.from('tbf_contractor_categories').insert(
            cats.map((c) => ({ contractor_id: contractorId, category_id: c.id }))
          )
        }
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <DashboardHeader title="Profile" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <DashboardHeader title="Profile" />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <p className="text-gray-700 font-medium mb-1">Complete your profile to appear on TheBestFlorida</p>
            <p className="text-sm text-gray-500">No contractor profile was found for your account.</p>
          </div>
        </div>
      </>
    )
  }

  const initials = profile.business_name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <>
      <DashboardHeader title="Profile" subtitle="Update your public business information" />
      <main className="flex-1 p-6">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">

          {/* Avatar / company name banner */}
          <div className="bg-white rounded-xl border p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{profile.business_name}</p>
              <p className="text-sm text-gray-500">{profile.city || '—'}{profile.state ? `, ${profile.state}` : ''}</p>
            </div>
          </div>

          {/* Basic info */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Basic information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company Name" required>
                <input
                  type="text"
                  required
                  value={profile.business_name}
                  onChange={(e) => patch({ business_name: e.target.value })}
                  className={inputCls}
                />
              </Field>

              <Field label="Owner Name" required>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Tagline">
              <input
                type="text"
                value={profile.tagline ?? ''}
                onChange={(e) => patch({ tagline: e.target.value })}
                placeholder="e.g. Trusted Orlando plumbers since 2005"
                className={inputCls}
              />
            </Field>

            <Field label="Description">
              <div className="relative">
                <textarea
                  rows={4}
                  maxLength={500}
                  value={profile.description ?? ''}
                  onChange={(e) => patch({ description: e.target.value })}
                  placeholder="Describe your business, experience, and what makes you stand out…"
                  className={`${inputCls} resize-none`}
                />
                <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                  {(profile.description ?? '').length}/500
                </span>
              </div>
            </Field>

            <Field label="Service categories">
              <Combobox
                options={categoryOptions}
                value={selectedCategories}
                onChange={setSelectedCategories}
                placeholder="Search categories…"
                max={5}
              />
            </Field>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Location</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="City" required>
                <input
                  type="text"
                  required
                  value={profile.city ?? ''}
                  onChange={(e) => patch({ city: e.target.value })}
                  placeholder="Orlando"
                  className={inputCls}
                />
              </Field>

              <Field label="State">
                <input
                  type="text"
                  value={profile.state ?? 'Florida'}
                  onChange={(e) => patch({ state: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Service area / cities served">
              <input
                type="text"
                value={profile.service_area ?? ''}
                onChange={(e) => patch({ service_area: e.target.value })}
                placeholder="e.g. Orlando, Kissimmee, Sanford, Lake Mary"
                className={inputCls}
              />
            </Field>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Contact</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone">
                <input
                  type="tel"
                  value={profile.phone ?? ''}
                  onChange={(e) => patch({ phone: e.target.value })}
                  placeholder="(407) 555-0100"
                  className={inputCls}
                />
              </Field>

              <Field label="Email" required>
                <input
                  type="email"
                  required
                  value={profile.email ?? ''}
                  onChange={(e) => patch({ email: e.target.value })}
                  className={inputCls}
                />
              </Field>

              <Field label="Website">
                <input
                  type="url"
                  value={profile.website ?? ''}
                  onChange={(e) => patch({ website: e.target.value })}
                  placeholder="https://"
                  className={inputCls}
                />
              </Field>

              <Field label="Year established">
                <input
                  type="number"
                  min={1900}
                  max={new Date().getFullYear()}
                  value={profile.year_established ?? ''}
                  onChange={(e) => patch({ year_established: e.target.value ? Number(e.target.value) : null })}
                  placeholder="2010"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* Credentials */}
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Credentials</h2>

            <Field label="License number">
              <input
                type="text"
                value={profile.license_number ?? ''}
                onChange={(e) => patch({ license_number: e.target.value })}
                placeholder="e.g. CFC1234567"
                className={inputCls}
              />
            </Field>

            <div className="space-y-3">
              {([
                { key: 'is_insured', label: 'Insured' },
                { key: 'is_bonded', label: 'Bonded' },
                { key: 'is_background_checked', label: 'Background checked' },
              ] as const).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile[key]}
                    onChange={(e) => patch({ [key]: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pb-8">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save profile
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">Profile saved!</span>
            )}
          </div>
        </form>
      </main>
    </>
  )
}

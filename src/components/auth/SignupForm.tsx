'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Combobox, type ComboboxOption } from '@/components/ui/Combobox'

export function SignupForm() {
  const router = useRouter()
  const [categoryOptions, setCategoryOptions] = useState<ComboboxOption[]>([])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [categorySlugs, setCategorySlugs] = useState<string[]>([])
  const [city, setCity] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('tbf_categories')
      .select('id, name, slug')
      .order('name')
      .then(({ data }) => {
        if (data) {
          setCategoryOptions(data.map((c) => ({ value: c.slug, label: c.name })))
        }
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (categorySlugs.length === 0) {
      setError('Select at least one service category.')
      return
    }
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contractor',
        name, email, password, phone,
        categorySlugs,
        city,
      }),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    // Auto-login with the credentials just created (email_confirm: true, no verification needed)
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      // Fallback: send to login with a success banner
      router.push('/login?registered=true')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">List your business</h1>
        <p className="text-sm text-gray-500 mb-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
          {' · '}
          <Link href="/signup/client" className="text-blue-600 hover:underline font-medium">
            Sign up as a customer
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Business or full name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Sunshine Plumbing LLC"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(407) 555-0100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service categories <span className="text-red-500">*</span>
            </label>
            <Combobox
              options={categoryOptions}
              value={categorySlugs}
              onChange={setCategorySlugs}
              placeholder="Search categories…"
              max={5}
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Orlando"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  )
}

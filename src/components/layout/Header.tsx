'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, LayoutDashboard, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'

export function Header() {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()

  const role = user?.user_metadata?.role as string | undefined
  const dashboardHref = role === 'client' ? '/account' : '/dashboard'
  const dashboardLabel = role === 'client' ? 'My Account' : 'Dashboard'

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">
              <span className="text-orange-500">The</span>
              <span className="text-blue-600">Best</span>
              <span className="text-green-600">Florida</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/landscaping" className="text-gray-600 hover:text-gray-900">Services</Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">Guides</Link>
            {!user && (
              <Link href="/for-pros" className="text-gray-600 hover:text-gray-900">For Pros</Link>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {dashboardLabel}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-gray-500 hover:text-red-600"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/signup">List Your Business</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3 text-sm">
          <Link href="/landscaping" className="block text-gray-700" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/blog" className="block text-gray-700" onClick={() => setOpen(false)}>Guides</Link>

          {user ? (
            <>
              <Link href={dashboardHref} className="flex items-center gap-1.5 text-gray-700" onClick={() => setOpen(false)}>
                <User className="w-4 h-4" />
                {dashboardLabel}
              </Link>
              <button
                className="block text-gray-500 text-left"
                onClick={() => { signOut(); setOpen(false) }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/for-pros" className="block text-gray-700" onClick={() => setOpen(false)}>For Pros</Link>
              <Link href="/login" className="block text-gray-700" onClick={() => setOpen(false)}>Log in</Link>
              <Button className="w-full bg-orange-500 hover:bg-orange-600" asChild>
                <Link href="/signup">List Your Business</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  )
}

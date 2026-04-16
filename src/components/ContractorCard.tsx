'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Shield, CheckCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/StarRating'
import { RequestQuoteModal } from '@/components/RequestQuoteModal'
import type { Contractor } from '@/types'

interface ContractorCardProps {
  contractor: Contractor
  categorySlug?: string
}

export function ContractorCard({ contractor, categorySlug }: ContractorCardProps) {
  const [quoteOpen, setQuoteOpen] = useState(false)

  const badges = [
    contractor.is_insured        && { label: 'Insured',            color: 'bg-green-50 text-green-700 border-green-200' },
    contractor.is_bonded         && { label: 'Bonded',             color: 'bg-green-50 text-green-700 border-green-200' },
    contractor.is_background_checked && { label: 'Background Checked', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ].filter(Boolean) as { label: string; color: string }[]

  return (
    <>
      <div className={[
        'bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden',
        contractor.is_sponsored ? 'ring-2 ring-yellow-400' : '',
      ].join(' ')}>

        {/* Sponsored ribbon */}
        {contractor.is_sponsored && (
          <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 flex items-center gap-1.5">
            ⭐ Featured Pro
            {contractor.sponsor_tier && (
              <span className="ml-auto capitalize">{contractor.sponsor_tier}</span>
            )}
          </div>
        )}

        <div className="p-5 flex gap-4 flex-1">
          {/* Logo */}
          <div className="flex-shrink-0">
            {contractor.logo_url ? (
              <Image
                src={contractor.logo_url}
                alt={contractor.business_name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-lg object-cover border border-gray-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {contractor.business_name[0]}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <Link
                href={`/pro/${contractor.slug}`}
                className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors leading-tight"
              >
                {contractor.business_name}
              </Link>
              {contractor.is_verified && (
                <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              )}
            </div>

            {contractor.tagline && (
              <p className="text-sm text-gray-500 mt-0.5 truncate">{contractor.tagline}</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <StarRating
                rating={contractor.rating}
                count={contractor.reviews_count}
                size="sm"
              />
              {contractor.city && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {contractor.city.name}, FL
                </span>
              )}
              {contractor.response_time_hours !== null && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  Responds in {contractor.response_time_hours}h
                </span>
              )}
            </div>

            {/* Trust badges */}
            {badges.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {badges.map((b) => (
                  <span
                    key={b.label}
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${b.color}`}
                  >
                    <Shield className="w-2.5 h-2.5" />
                    {b.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-4 pt-1 flex gap-2 border-t border-gray-50">
          {contractor.phone && (
            <a
              href={`tel:${contractor.phone}`}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
          )}
          <Link href={`/pro/${contractor.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Profile
            </Button>
          </Link>
          <Button
            size="sm"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setQuoteOpen(true)}
          >
            Get Quote
          </Button>
        </div>
      </div>

      <RequestQuoteModal
        contractor={contractor}
        categorySlug={categorySlug}
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
      />
    </>
  )
}

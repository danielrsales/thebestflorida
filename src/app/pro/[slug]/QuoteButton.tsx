'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RequestQuoteModal } from '@/components/RequestQuoteModal'
import type { Contractor } from '@/types'

export function QuoteButton({ contractor }: { contractor: Contractor }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 text-base font-semibold"
        onClick={() => setOpen(true)}
      >
        Request Free Quote
      </Button>
      <RequestQuoteModal
        contractor={contractor}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

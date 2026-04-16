import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.thebestflorida.com'
const SITE_NAME = 'TheBestFlorida'
const DEFAULT_DESCRIPTION =
  'We handpick the best service companies in Florida. Find trusted landscapers, plumbers, electricians, pool cleaners, and more near you. Free quotes from verified local pros.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Find Top-Rated Service Pros in Florida`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Find Top-Rated Service Pros in Florida`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Top-Rated Florida Service Pros`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thebestflorida',
    title: `${SITE_NAME} — Find Top-Rated Service Pros in Florida`,
    description: DEFAULT_DESCRIPTION,
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}

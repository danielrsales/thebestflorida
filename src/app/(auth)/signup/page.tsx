import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join TheBestFlorida as a verified contractor and connect with customers across Florida.',
  robots: { index: false },
}

export default function SignupPage() {
  return <SignupForm />
}

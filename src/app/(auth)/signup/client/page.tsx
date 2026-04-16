import type { Metadata } from 'next'
import { SignupClientForm } from '@/components/auth/SignupClientForm'

export const metadata: Metadata = {
  title: 'Create Customer Account',
  description: 'Sign up to request quotes from verified local pros in Florida.',
  robots: { index: false },
}

export default function SignupClientPage() {
  return <SignupClientForm />
}

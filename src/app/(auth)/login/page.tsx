import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your TheBestFlorida contractor account.',
  robots: { index: false },
}

export default function LoginPage() {
  return <LoginForm />
}

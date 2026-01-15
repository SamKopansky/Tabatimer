import { SignInForm } from '@/components/auth/signin-form'
import { SuccessMessage } from '@/components/auth/success-message'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata = {
  title: 'Sign In | Tabatimer',
  description: 'Sign in to your account',
}

export default function SignInPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={null}>
          <SuccessMessage />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <SignInForm />
        </Suspense>
        <div className="mt-4 text-center text-sm space-y-2">
          <div>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>
          <div>
            <Link href="/magic-link" className="text-blue-600 hover:underline">
              Sign in with Magic Link instead
            </Link>
          </div>
          <div>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

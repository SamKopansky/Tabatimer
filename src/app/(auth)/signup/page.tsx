import { SignUpForm } from '@/components/auth/signup-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const metadata = {
  title: 'Sign Up | Tabatimer',
  description: 'Create your account to start training',
}

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>Enter your email and password to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <div className="mt-4 text-center text-sm space-y-2">
          <div>
            <Link href="/magic-link" className="text-blue-600 hover:underline">
              Use Magic Link instead (no password needed)
            </Link>
          </div>
          <div>
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { MagicLinkForm } from '@/components/auth/magic-link-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const metadata = {
  title: 'Magic Link Sign In | Tabatimer',
  description: 'Sign in with a magic link sent to your email',
}

export default function MagicLinkPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in with Magic Link</CardTitle>
        <CardDescription>Enter your email to receive a sign-in link</CardDescription>
      </CardHeader>
      <CardContent>
        <MagicLinkForm />
        <div className="mt-4 text-center text-sm space-y-2">
          <div>
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in with password
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Authentication Error | Tabatimer',
  description: 'An error occurred during authentication',
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string; description?: string }
}) {
  const errorType = searchParams.error || 'unknown'
  const description = searchParams.description || 'An unexpected error occurred'

  const errorMessages: Record<string, string> = {
    auth_callback: 'Failed to complete authentication',
    access_denied: 'Access was denied',
    server_error: 'A server error occurred',
    unknown: 'An unknown error occurred',
  }

  const errorTitle = errorMessages[errorType] || errorMessages.unknown

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">{errorTitle}</CardTitle>
        <CardDescription className="text-center">
          We couldn&apos;t complete your authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">{description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href="/login">Return to Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
        <p className="text-xs text-slate-500 text-center">
          If this problem persists, please contact support.
        </p>
      </CardContent>
    </Card>
  )
}

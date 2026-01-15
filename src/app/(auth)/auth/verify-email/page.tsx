import { ResendVerificationForm } from '@/components/auth/resend-verification-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export const metadata = {
  title: 'Verify Email | Tabatimer',
  description: 'Check your email to verify your account',
}

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-blue-100 p-3">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
        <CardDescription className="text-center">
          We&apos;ve sent you a verification link
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600 text-center">
          Please check your email inbox and click the verification link to activate your account.
        </p>
        <div className="border-t pt-4">
          <p className="text-sm text-slate-600 text-center mb-3">
            Didn&apos;t receive the email?
          </p>
          <ResendVerificationForm defaultEmail={searchParams.email} />
        </div>
        <p className="text-xs text-slate-500 text-center">
          Check your spam folder or try resending the verification email.
        </p>
      </CardContent>
    </Card>
  )
}

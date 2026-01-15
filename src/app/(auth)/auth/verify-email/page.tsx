import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export const metadata = {
  title: 'Verify Email | Tabatimer',
  description: 'Check your email to verify your account',
}

export default function VerifyEmailPage() {
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
        <p className="text-xs text-slate-500 text-center">
          Didn&apos;t receive the email? Check your spam folder or contact support.
        </p>
      </CardContent>
    </Card>
  )
}

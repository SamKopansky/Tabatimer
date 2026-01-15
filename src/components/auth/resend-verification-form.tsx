'use client'

import { resendVerificationEmail } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'

interface ResendVerificationFormProps {
  defaultEmail?: string
}

export function ResendVerificationForm({ defaultEmail = '' }: ResendVerificationFormProps) {
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState(defaultEmail)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await resendVerificationEmail(formData)

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Email sent successfully!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send email' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm">
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
        />
      </div>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Resend Verification Email'
        )}
      </Button>
    </form>
  )
}

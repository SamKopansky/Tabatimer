'use client'

import { sendMagicLink } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, Sparkles } from 'lucide-react'
import { useState, useTransition } from 'react'

export function MagicLinkForm() {
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(
    null
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setResult(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const response = await sendMagicLink(formData)
      setResult(response)
    })
  }

  // If magic link was sent successfully, show success state
  if (result?.success) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">Check your email</h3>
          <p className="text-sm text-slate-600">{result.message}</p>
          <p className="text-xs text-slate-500">
            The link will expire in 60 minutes for security reasons.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setResult(null)
            setEmail('')
          }}
        >
          Send another magic link
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
          autoComplete="email"
          autoFocus
        />
      </div>

      {result?.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {result.error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending magic link...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Send Magic Link
          </>
        )}
      </Button>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
        <p className="font-medium mb-1">What&apos;s a magic link?</p>
        <p className="text-xs">
          We&apos;ll send you a secure link to your email. Click it to sign in instantly without
          needing a password.
        </p>
      </div>
    </form>
  )
}

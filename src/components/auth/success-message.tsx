'use client'

import { useSearchParams } from 'next/navigation'

export function SuccessMessage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  if (!message) {
    return null
  }

  return (
    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800 border border-green-200">
      {message}
    </div>
  )
}

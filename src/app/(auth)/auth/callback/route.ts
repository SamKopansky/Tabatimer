import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

/**
 * Auth callback handler for Supabase authentication.
 * This handles email verification and OAuth callbacks.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // Handle auth errors
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(error_description || '')}`
    )
  }

  // Exchange the code for a session
  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/error?error=auth_callback&description=${encodeURIComponent(exchangeError.message)}`
      )
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  }

  // If no code was provided, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/login`)
}

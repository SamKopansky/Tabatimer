import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

/**
 * Get the current authenticated user from the session.
 * Returns null if no user is authenticated.
 *
 * @returns Promise<User | null> - The authenticated user or null
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching user:', error.message)
    return null
  }

  return user
}

/**
 * Require authentication for a route. If the user is not authenticated,
 * redirect to the login page.
 *
 * @param redirectTo - Optional URL to redirect back to after login (default: current path)
 * @returns Promise<User> - The authenticated user (guaranteed to exist)
 */
export async function requireAuth(redirectTo?: string): Promise<User> {
  const user = await getUser()

  if (!user) {
    const loginUrl = redirectTo
      ? `/login?redirect=${encodeURIComponent(redirectTo)}`
      : '/login'
    redirect(loginUrl)
  }

  return user
}

/**
 * Check if a user is authenticated without redirecting.
 * Useful for conditional rendering or logic.
 *
 * @returns Promise<boolean> - True if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return user !== null
}

/**
 * Get the user's session.
 * Returns null if no active session exists.
 */
export async function getSession() {
  const supabase = await createClient()

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error('Error fetching session:', error.message)
    return null
  }

  return session
}

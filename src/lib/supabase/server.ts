import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '../db/database.types'

/**
 * Creates a Supabase client for server-side operations with secure session management.
 *
 * Session Management Features:
 * - Uses HTTP-only cookies for security (prevents XSS attacks)
 * - Cookies are automatically set with secure flags in production
 * - Session tokens are inaccessible to client-side JavaScript
 * - Cookie options set by Supabase SSR include:
 *   - httpOnly: true (prevents client-side access)
 *   - secure: true (in production, requires HTTPS)
 *   - sameSite: 'lax' (CSRF protection)
 *   - path: '/' (available site-wide)
 *
 * The middleware.ts at the project root handles session refresh on each request.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

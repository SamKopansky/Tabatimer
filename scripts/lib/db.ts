/**
 * Supabase Admin Client for Scripts
 *
 * Creates a Supabase client with service role privileges for database operations.
 * This client bypasses Row Level Security (RLS) and should only be used in
 * development scripts with proper safety guards.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../src/lib/db/database.types'

/**
 * Create an admin Supabase client for scripts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in environment
 * This client has full admin privileges and bypasses RLS
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL not found in environment.\n' +
      'Make sure your .env.local file is configured correctly.'
    )
  }

  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseServiceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY not found in environment.\n' +
      'This is required for admin operations in scripts.\n' +
      'Get it from: Project Settings > API > service_role key\n' +
      'Add it to your .env.local file.'
    )
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Type for the admin client
 */
export type AdminClient = ReturnType<typeof createClient>

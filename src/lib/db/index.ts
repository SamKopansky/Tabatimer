import { createClient } from '../supabase/server'

// Re-export the Supabase client creation function
// Use this for all server-side database operations
export { createClient }

// Export Database types from generated types file
export type { Database } from './database.types'

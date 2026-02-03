/**
 * Safety guard to prevent scripts from running in production
 *
 * All scripts should call assertDevelopment() before doing anything
 * to ensure they only run in local development environments.
 */

export function assertDevelopment(scriptName: string): void {
  // Check if NODE_ENV is production
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `🚨 DANGER: ${scriptName} attempted to run in production!\n` +
      'This script is for development only and must not run in production.\n' +
      'If you need to seed production data, create a separate production-safe script.'
    )
  }

  // Check if DATABASE_URL points to a local database
  const databaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''

  // Check for placeholder values
  const isPlaceholder =
    databaseUrl.includes('your-') ||
    databaseUrl.includes('example') ||
    databaseUrl === ''

  if (isPlaceholder) {
    throw new Error(
      `🚨 Configuration Error: ${scriptName} cannot run without proper setup!\n\n` +
      'Your .env.local appears to have placeholder values.\n\n' +
      'To fix this:\n' +
      '1. Make sure Supabase is running: npm run db:start\n' +
      '2. Get the local URL: npm run db:status\n' +
      '3. Update .env.local with:\n' +
      '   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321\n' +
      '   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-db:status>\n' +
      '   SUPABASE_SERVICE_ROLE_KEY=<service-key-from-db:status>\n'
    )
  }

  const isLocalDatabase =
    databaseUrl.includes('localhost') ||
    databaseUrl.includes('127.0.0.1') ||
    databaseUrl.includes('.local')

  if (!isLocalDatabase) {
    throw new Error(
      `🚨 DANGER: ${scriptName} attempting to modify non-local database!\n` +
      `Database URL: ${databaseUrl}\n\n` +
      'This script only runs against local databases for safety.\n' +
      'Your .env.local should point to: http://127.0.0.1:54321\n\n' +
      'To use local Supabase:\n' +
      '1. Run: npm run db:start\n' +
      '2. Update .env.local with local URLs from: npm run db:status\n'
    )
  }

  // All checks passed
  console.log(`✅ Safety check passed: ${scriptName} running in development mode`)
}

/**
 * Check if running in development without throwing
 * Useful for conditional logic
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV !== 'production'
}

/**
 * Require explicit confirmation before running destructive operations
 */
export async function requireConfirmation(message: string): Promise<boolean> {
  // In non-interactive environments, default to false for safety
  if (!process.stdin.isTTY) {
    console.log('⚠️  Non-interactive environment detected. Confirmation required.')
    return false
  }

  // For now, we'll implement a simple check
  // In the future, could add a proper CLI prompt library
  console.log(`\n⚠️  ${message}`)
  console.log('Press Ctrl+C to cancel, or re-run with --force flag to proceed.')

  // Check for --force flag
  return process.argv.includes('--force')
}

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

  const isLocalDatabase =
    databaseUrl.includes('localhost') ||
    databaseUrl.includes('127.0.0.1') ||
    databaseUrl.includes('.local') ||
    databaseUrl.includes('supabase.co/project') // Local Supabase project

  if (!isLocalDatabase && databaseUrl) {
    throw new Error(
      `🚨 DANGER: ${scriptName} attempting to modify non-local database!\n` +
      `Database URL: ${databaseUrl}\n` +
      'This script only runs against local databases for safety.\n' +
      'If you are certain this is a development database, update the safety check.'
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

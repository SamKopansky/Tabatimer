/**
 * Consistent logging utilities for scripts
 *
 * Provides emoji-enhanced logging to make script output clear and scannable.
 */

export const logger = {
  /**
   * Informational message (blue)
   */
  info: (message: string, ...args: any[]) => {
    console.log(`ℹ️  ${message}`, ...args)
  },

  /**
   * Success message (green)
   */
  success: (message: string, ...args: any[]) => {
    console.log(`✅ ${message}`, ...args)
  },

  /**
   * Error message (red)
   */
  error: (message: string, error?: any) => {
    if (error) {
      console.error(`❌ ${message}`, error)
    } else {
      console.error(`❌ ${message}`)
    }
  },

  /**
   * Warning message (yellow)
   */
  warn: (message: string, ...args: any[]) => {
    console.warn(`⚠️  ${message}`, ...args)
  },

  /**
   * Debug message (dimmed)
   */
  debug: (message: string, ...args: any[]) => {
    if (process.env.DEBUG) {
      console.log(`🔍 ${message}`, ...args)
    }
  },

  /**
   * Step in a multi-step process
   */
  step: (step: number, total: number, message: string) => {
    console.log(`[${step}/${total}] ${message}`)
  },

  /**
   * Section header for grouping related logs
   */
  section: (title: string) => {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`  ${title}`)
    console.log(`${'='.repeat(50)}\n`)
  },

  /**
   * Start of a task
   */
  start: (message: string) => {
    console.log(`\n🚀 ${message}`)
  },

  /**
   * Completion of entire script
   */
  complete: (message: string) => {
    console.log(`\n✨ ${message}\n`)
  },
}

/**
 * Format error for display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.message}\n${error.stack || ''}`
  }
  return String(error)
}

/**
 * Log a table of data for easy reading
 */
export function logTable(data: Array<Record<string, any>>): void {
  if (data.length === 0) {
    logger.info('No data to display')
    return
  }

  console.table(data)
}

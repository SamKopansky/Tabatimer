#!/usr/bin/env tsx

/**
 * Seed Test Users Script
 *
 * Creates test user accounts with verified emails for E2E testing and local development.
 * This script uses the Supabase Admin API to create users with specific states.
 *
 * Usage:
 *   npm run seed:users
 *   tsx scripts/seed/test-users.ts
 *   tsx scripts/seed/test-users.ts --force  # Skip confirmation
 *
 * Safety:
 *   - Only runs in development environment
 *   - Only runs against local databases
 *   - Requires SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '../lib/db'
import { assertDevelopment } from '../lib/dev-guard'
import { logger } from '../lib/logger'

// Type definitions for test users
interface TestUser {
  email: string
  password: string
  fullName?: string
  timezone?: string
  state: 'new' | 'active' | 'power' | 'empty' | 'admin'
}

// Test user definitions
const TEST_USERS: TestUser[] = [
  {
    email: 'test-new@example.local',
    password: 'TestPass123!',
    fullName: 'New Test User',
    timezone: 'America/Los_Angeles',
    state: 'new',
  },
  {
    email: 'test-active@example.local',
    password: 'TestPass123!',
    fullName: 'Active Test User',
    timezone: 'America/New_York',
    state: 'active',
  },
  {
    email: 'test-power@example.local',
    password: 'TestPass123!',
    fullName: 'Power Test User',
    timezone: 'America/Chicago',
    state: 'power',
  },
  {
    email: 'test-empty@example.local',
    password: 'TestPass123!',
    fullName: undefined,
    timezone: undefined,
    state: 'empty',
  },
  {
    email: 'test-admin@example.local',
    password: 'TestPass123!',
    fullName: 'Admin Test User',
    timezone: 'UTC',
    state: 'admin',
  },
]

async function seedTestUsers() {
  // Safety checks
  assertDevelopment('seed-test-users')

  logger.start('Seeding test users...')

  const supabase = createClient()

  // Summary tracking
  const results = {
    created: 0,
    skipped: 0,
    failed: 0,
  }

  for (let i = 0; i < TEST_USERS.length; i++) {
    const user = TEST_USERS[i]
    logger.step(i + 1, TEST_USERS.length, `Processing ${user.state} user: ${user.email}`)

    try {
      // Check if user already exists
      const { data: existingUser, error: fetchError } = await supabase.auth.admin.listUsers()

      if (fetchError) {
        logger.error(`Failed to check existing users:`, fetchError)
        results.failed++
        continue
      }

      const userExists = existingUser.users.some((u) => u.email === user.email)

      if (userExists) {
        logger.warn(`  ⏭️  User already exists: ${user.email}`)
        results.skipped++
        continue
      }

      // Create user via Supabase Admin API
      const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Mark email as verified
        user_metadata: {
          full_name: user.fullName,
        },
      })

      if (createError) {
        logger.error(`  ✗ Failed to create auth user:`, createError)
        results.failed++
        continue
      }

      if (!authUser.user) {
        logger.error(`  ✗ No user returned from create operation`)
        results.failed++
        continue
      }

      // Insert/update profile data
      if (user.fullName || user.timezone) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: authUser.user.id,
            full_name: user.fullName || null,
            timezone: user.timezone || null,
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          logger.warn(`  ⚠️  Created auth user but failed to update profile:`, profileError)
        }
      }

      logger.success(`  ✓ Created ${user.state} user: ${user.email}`)
      results.created++
    } catch (error) {
      logger.error(`  ✗ Unexpected error creating ${user.email}:`, error)
      results.failed++
    }
  }

  // Print summary
  logger.section('Summary')
  logger.info(`Created: ${results.created}`)
  logger.info(`Skipped: ${results.skipped}`)
  if (results.failed > 0) {
    logger.error(`Failed: ${results.failed}`)
  }

  if (results.created > 0) {
    logger.complete('Test users seeded successfully! 🎉')
    logger.info('You can now use these credentials to log in:')
    logger.info('  Email: test-new@example.local')
    logger.info('  Password: TestPass123!')
    logger.info('')
    logger.info('See scripts/README.md for full list of test accounts.')
  } else if (results.skipped > 0) {
    logger.complete('All test users already exist.')
  } else {
    logger.error('Failed to seed any users.')
    process.exit(1)
  }
}

// Run the script
seedTestUsers().catch((error) => {
  logger.error('Script failed:', error)
  process.exit(1)
})

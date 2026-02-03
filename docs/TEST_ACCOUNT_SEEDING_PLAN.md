# Test Account Seeding System - Implementation Plan

**Created:** 2026-02-02
**Status:** Planning
**Context:** E2E testing is difficult because email verification is required and you need valid logins to access authenticated pages.

## Problem Statement

Local testing and E2E testing with Playwright is currently difficult because:
1. Email verification is required for all new accounts
2. Can't use fake test emails due to verification feature
3. Need valid authenticated sessions to test authenticated pages
4. Manual account creation is slow and tedious
5. No consistent test data for development

## Solution: Test Account Seeding

Create a database seeding system that:
- Pre-creates test users with verified emails
- Supports multiple user states (new user, active user, premium user, etc.)
- Provides known credentials for Playwright tests
- Works only in development environment (with safety guards)
- Is easily extensible for future test data needs

## Architecture: Designing for 10+ Scripts

This is the **first script** in the project. Following the "Where does the 10th one go?" principle, we need a complete scripts taxonomy from the start.

### Scripts Directory Structure

```
scripts/
├── README.md                     # Overview, how to run scripts, safety guidelines
├── lib/                          # Shared utilities (this grows as needs emerge)
│   ├── db.ts                    # Supabase client for scripts
│   ├── logger.ts                # Console logging utilities
│   └── dev-guard.ts             # Safety check (only run in dev)
├── seed/                         # Database seeding scripts
│   ├── test-users.ts            # Seed test user accounts
│   ├── test-workouts.ts         # Seed sample workouts (future)
│   └── test-history.ts          # Seed workout history (future)
├── db/                           # Database utilities
│   ├── reset.ts                 # Reset database to clean state (future)
│   ├── backup.ts                # Backup dev database (future)
│   └── verify-rls.ts            # Test RLS policies (future)
└── dev/                          # Development tools
    ├── generate-types.ts        # Generate TypeScript types from DB (future)
    └── check-migrations.ts      # Verify migration status (future)
```

### Script Categories

**seed/** - Data creation for testing
- Test users with different states
- Sample workouts
- Historical data
- Exercise libraries

**db/** - Database operations
- Reset/clean database
- Backup and restore
- Schema verification
- RLS policy testing

**dev/** - Development utilities
- Type generation
- Migration helpers
- Data validation
- Performance testing

**lib/** - Shared code (reused across scripts)
- Database client configuration
- Logging utilities
- Environment validation
- Common types and helpers

## Test User Seeding Implementation

### User States to Support

Create test accounts representing different user states:

1. **New User** - Just signed up, minimal data
   - Email: `test-new@example.local`
   - Password: `TestPass123!`
   - Profile: Minimal info
   - Workouts: None
   - History: None

2. **Active User** - Regular user with some activity
   - Email: `test-active@example.local`
   - Password: `TestPass123!`
   - Profile: Complete profile
   - Workouts: 3-5 saved workouts
   - History: Recent workout sessions

3. **Power User** - Heavy usage
   - Email: `test-power@example.local`
   - Password: `TestPass123!`
   - Profile: Complete with preferences
   - Workouts: 20+ saved workouts
   - History: Extensive history (100+ sessions)

4. **Empty Profile User** - For testing profile setup flow
   - Email: `test-empty@example.local`
   - Password: `TestPass123!`
   - Profile: No name, no timezone
   - Workouts: None
   - History: None

5. **Test Admin** - For admin feature testing (future)
   - Email: `test-admin@example.local`
   - Password: `TestPass123!`
   - Role: Admin
   - Full privileges

### Script Structure: `scripts/seed/test-users.ts`

```typescript
#!/usr/bin/env tsx

import { createClient } from '@/lib/db/client'
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
    state: 'new'
  },
  {
    email: 'test-active@example.local',
    password: 'TestPass123!',
    fullName: 'Active Test User',
    timezone: 'America/New_York',
    state: 'active'
  },
  // ... more users
]

async function seedTestUsers() {
  assertDevelopment('seed-test-users')

  logger.info('🌱 Seeding test users...')

  const supabase = createClient()

  for (const user of TEST_USERS) {
    try {
      // Check if user exists
      // Create user via Supabase Admin API or direct DB insert
      // Set email_verified = true
      // Insert profile data
      logger.success(`✓ Created ${user.state} user: ${user.email}`)
    } catch (error) {
      logger.error(`✗ Failed to create ${user.email}:`, error)
    }
  }

  logger.info('✅ Test users seeded successfully')
}

seedTestUsers().catch(console.error)
```

### Shared Utilities

**scripts/lib/dev-guard.ts**
```typescript
export function assertDevelopment(scriptName: string) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `🚨 DANGER: ${scriptName} attempted to run in production!\n` +
      'This script is for development only.'
    )
  }

  if (!process.env.DATABASE_URL?.includes('localhost')) {
    throw new Error(
      `🚨 DANGER: ${scriptName} attempting to modify non-local database!\n` +
      'Database URL: ' + process.env.DATABASE_URL
    )
  }
}
```

**scripts/lib/logger.ts**
```typescript
export const logger = {
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  success: (msg: string) => console.log(`✅ ${msg}`),
  error: (msg: string, err?: any) => console.error(`❌ ${msg}`, err),
  warn: (msg: string) => console.warn(`⚠️  ${msg}`)
}
```

**scripts/lib/db.ts**
```typescript
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not found in environment')
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
```

## Package.json Scripts

Add convenient npm scripts:

```json
{
  "scripts": {
    "seed:users": "tsx scripts/seed/test-users.ts",
    "seed:all": "npm run seed:users",
    "db:reset": "tsx scripts/db/reset.ts",
    "db:seed": "npm run seed:all"
  }
}
```

## Environment Variables Required

Add to `.env.local`:

```bash
# Required for seeding scripts
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Safety Mechanisms

1. **Environment Check**: Scripts refuse to run in production
2. **Database URL Check**: Verify localhost/dev database
3. **Confirmation Prompts**: For destructive operations
4. **Dry Run Mode**: Option to preview without changes
5. **Clear Logging**: Show what's happening at each step

## Usage

### Running Seed Scripts

```bash
# Seed test users
npm run seed:users

# Seed all test data
npm run seed:all

# Direct execution
tsx scripts/seed/test-users.ts
```

### Using in Playwright Tests

```typescript
import { test, expect } from '@playwright/test'

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login as active test user
    await page.goto('http://localhost:3000/login')
    await page.fill('[name="email"]', 'test-active@example.local')
    await page.fill('[name="password"]', 'TestPass123!')
    await page.click('button[type="submit"]')
  })

  test('should display user profile', async ({ page }) => {
    await page.goto('http://localhost:3000/profile')
    await expect(page.locator('h1')).toContainText('Profile')
  })
})
```

## Documentation

Create `scripts/README.md`:

```markdown
# Development Scripts

This directory contains scripts for database seeding, maintenance, and development utilities.

## Safety

⚠️ All scripts include safety checks:
- Only run in development environment
- Verify database is localhost
- Require explicit confirmation for destructive operations

## Scripts

### Seeding
- `seed:users` - Create test user accounts
- `seed:all` - Seed all test data

### Database
- `db:reset` - Reset database to clean state
- `db:backup` - Backup development database

## Test Accounts

After running `npm run seed:users`:
- test-new@example.local / TestPass123!
- test-active@example.local / TestPass123!
- test-power@example.local / TestPass123!
```

## Future Enhancements

1. **Workout Seeding** (`scripts/seed/test-workouts.ts`)
   - Pre-create sample workouts for each test user
   - Various workout types (HIIT, Tabata, custom)

2. **History Seeding** (`scripts/seed/test-history.ts`)
   - Generate historical workout sessions
   - Different completion rates
   - Date ranges for testing analytics

3. **Database Reset** (`scripts/db/reset.ts`)
   - Drop all data
   - Re-run migrations
   - Re-seed test data

4. **Selective Seeding**
   - Flags to seed specific user types: `--new --active`
   - Clear existing before re-seeding: `--fresh`
   - Interactive mode: prompts for which users to create

5. **Faker Integration**
   - Use @faker-js/faker for realistic test data
   - Random names, dates, preferences
   - Configurable data volume

## Implementation Checklist

- [ ] Create `scripts/` directory structure
- [ ] Implement `scripts/lib/dev-guard.ts` (safety)
- [ ] Implement `scripts/lib/logger.ts` (logging)
- [ ] Implement `scripts/lib/db.ts` (Supabase client)
- [ ] Create test user definitions with 5 user states
- [ ] Implement `scripts/seed/test-users.ts`
- [ ] Add npm scripts to `package.json`
- [ ] Create `scripts/README.md` documentation
- [ ] Test script execution locally
- [ ] Verify safety guards work (refuse to run in production)
- [ ] Update main project README with testing section
- [ ] Add SUPABASE_SERVICE_ROLE_KEY to `.env.example`

## Technical Considerations

### User Creation Method

Two approaches:
1. **Supabase Auth Admin API** (Preferred)
   - Uses service role key
   - Properly creates auth.users entry
   - Can set email_verified = true
   - More complex but complete

2. **Direct Database Insert**
   - Insert into public.users only
   - Simpler but incomplete
   - No actual auth.users entry
   - Can't actually log in

**Recommendation:** Use Supabase Admin API for complete user creation.

### Password Hashing

For test accounts, use consistent password:
- Password: `TestPass123!`
- Let Supabase handle hashing
- Document in README

### Email Domain

Use `.local` TLD for test emails:
- `@example.local` - Won't conflict with real domains
- Clear indication these are test accounts
- Can filter/clean these easily

## Success Criteria

✅ Can run `npm run seed:users` and create all test accounts
✅ Test accounts have verified emails
✅ Can log in with test credentials
✅ Playwright tests can use test accounts reliably
✅ Scripts refuse to run in production
✅ Clear documentation for other developers
✅ Structure supports 10+ future scripts

## References

- Supabase Admin API: https://supabase.com/docs/reference/javascript/admin-api
- tsx execution: https://github.com/esbuild-kit/tsx
- Next.js scripts: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables

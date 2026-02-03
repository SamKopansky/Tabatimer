# Test Account Seeding - Setup Guide

This guide shows you how to set up and use the test account seeding system for local development and E2E testing.

## Quick Start

### 1. Make sure Supabase is running

```bash
npm run db:start
```

### 2. Configure .env.local for local Supabase

Run this command to see the configuration you need:

```bash
npm run dev:env
```

This will output something like:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### 3. Update your .env.local

Open your `.env.local` file and replace the Supabase section with the values from step 2:

```bash
# Before (Cloud Supabase - for deployed environments)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...

# After (Local Supabase - for local development)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci... (from dev:env output)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... (from dev:env output)
```

**Keep your other environment variables** (AI_MODE, ANTHROPIC_API_KEY, etc.) as they are.

### 4. Seed test users

```bash
npm run seed:users
```

This creates 5 test user accounts with verified emails:

| Email | Password | Description |
|-------|----------|-------------|
| `test-new@example.local` | `TestPass123!` | New user, minimal data |
| `test-active@example.local` | `TestPass123!` | Active user with workouts |
| `test-power@example.local` | `TestPass123!` | Power user, heavy usage |
| `test-empty@example.local` | `TestPass123!` | Empty profile for testing setup |
| `test-admin@example.local` | `TestPass123!` | Admin user (future) |

### 5. Start developing!

```bash
npm run dev
```

Then go to http://localhost:3000/login and use any test account credentials.

## Managing Two Environments

You have two options for managing local vs cloud Supabase:

### Option 1: Switch .env.local manually (Simpler)

When working locally:
- Use local Supabase values in `.env.local`
- Run `npm run dev:env` to get values

When testing against cloud:
- Temporarily switch to cloud values in `.env.local`

### Option 2: Use separate env files (Advanced)

Create two files:
- `.env.local.supabase` - Local Supabase configuration
- `.env.local.cloud` - Cloud Supabase configuration

Copy between them as needed:
```bash
# Use local
cp .env.local.supabase .env.local

# Use cloud
cp .env.local.cloud .env.local
```

## Troubleshooting

### Error: "Configuration Error: cannot run without proper setup"

Your `.env.local` has placeholder values. Follow steps 2-3 above.

### Error: "attempting to modify non-local database"

Your `.env.local` points to a cloud database. The seeding script only runs against local Supabase for safety. Follow steps 2-3 to configure local Supabase.

### Error: "SUPABASE_SERVICE_ROLE_KEY not found"

Run `npm run dev:env` and make sure you've added the `SUPABASE_SERVICE_ROLE_KEY` line to your `.env.local`.

### Supabase not running

```bash
npm run db:start
npm run db:status
```

### Users already exist

The script will skip users that already exist. To re-create them:
1. Go to Supabase Studio: http://127.0.0.1:54323
2. Navigate to Authentication > Users
3. Delete the test users
4. Re-run: `npm run seed:users`

## Using Test Accounts

### Manual Testing

1. Start dev server: `npm run dev`
2. Go to: http://localhost:3000/login
3. Use test credentials: `test-active@example.local` / `TestPass123!`
4. Test authenticated features

### Playwright E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user
    await page.goto('http://localhost:3000/login')
    await page.fill('[name="email"]', 'test-active@example.local')
    await page.fill('[name="password"]', 'TestPass123!')
    await page.click('button[type="submit"]')
  })

  test('should display profile', async ({ page }) => {
    await page.goto('http://localhost:3000/profile')
    await expect(page.locator('h1')).toContainText('Profile')
  })
})
```

## Safety Features

The seeding scripts include multiple safety checks:

✅ **Environment Check** - Refuses to run if NODE_ENV=production
✅ **Database URL Check** - Only runs against localhost/127.0.0.1
✅ **Placeholder Detection** - Catches unconfigured .env files
✅ **Clear Error Messages** - Guides you to fix configuration issues

These safety checks prevent accidentally seeding test data into production databases.

## What Gets Created

Running `npm run seed:users` creates:

1. **Auth Users** in Supabase Auth
   - Email verified (bypasses verification emails)
   - Known password for easy testing
   - User metadata with full name

2. **Profile Records** in `users` table
   - Full name
   - Timezone
   - Timestamps

Future scripts will add:
- Workouts (various types and states)
- Workout history (completed sessions)
- Exercise favorites
- User preferences

## Scripts Overview

```bash
# Database
npm run db:start      # Start local Supabase
npm run db:stop       # Stop local Supabase
npm run db:status     # Check Supabase status
npm run db:reset      # Reset database (WARNING: deletes all data)

# Seeding
npm run seed:users    # Create test user accounts
npm run seed:all      # Seed all test data (currently just users)

# Development
npm run dev:env       # Show local Supabase configuration
npm run dev           # Start Next.js dev server

# Testing
npm run test          # Run Vitest unit tests
```

## Next Steps

Now that you have test accounts:

1. **E2E Tests**: Create Playwright tests that use test accounts
2. **Manual Testing**: Test authenticated features without signup
3. **Seed More Data**: Extend with workout and history seeding
4. **CI/CD**: Seed test data in CI pipelines for E2E tests

See `docs/TEST_ACCOUNT_SEEDING_PLAN.md` for the complete implementation plan and future enhancements.

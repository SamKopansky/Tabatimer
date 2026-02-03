# Development Scripts

This directory contains scripts for database seeding, maintenance, testing, and development utilities.

## Safety

⚠️ **All scripts include safety checks:**
- Only run in development environment
- Verify database is localhost
- Require explicit confirmation for destructive operations

**These scripts will refuse to run in production or against remote databases.**

## Directory Structure

```
scripts/
├── README.md                 # This file
├── lib/                      # Shared utilities
│   ├── db.ts                # Supabase client for scripts
│   ├── logger.ts            # Console logging utilities
│   └── dev-guard.ts         # Safety checks (dev-only execution)
├── seed/                     # Database seeding scripts
│   ├── test-users.ts        # Seed test user accounts
│   └── ...                  # Future: workouts, history, etc.
├── db/                       # Database utilities
│   └── ...                  # Future: reset, backup, verify-rls
├── test-rls-policies.ts      # RLS policy testing (legacy location)
└── test-session-management.ts # Session testing (legacy location)
```

**Note:** Legacy test scripts (`test-*.ts`) are at root level. Future scripts should use the organized structure above.

## Quick Start

### Seed Test Users

```bash
npm run seed:users
```

This creates test accounts with verified emails for E2E testing and local development.

### Seed All Test Data

```bash
npm run seed:all
```

Currently same as `seed:users`, but will include workouts and history in the future.

## Test Accounts

After running `npm run seed:users`, the following accounts are available:

| Email | Password | State | Description |
|-------|----------|-------|-------------|
| `test-new@example.local` | `TestPass123!` | New User | Just signed up, minimal data |
| `test-active@example.local` | `TestPass123!` | Active User | Regular user with workouts and history |
| `test-power@example.local` | `TestPass123!` | Power User | Heavy user with 20+ workouts, 100+ sessions |
| `test-empty@example.local` | `TestPass123!` | Empty Profile | No name/timezone, for testing profile setup |
| `test-admin@example.local` | `TestPass123!` | Admin | For admin feature testing (future) |

All accounts have verified emails and can be used immediately for testing.

## Usage in Tests

### Playwright E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authenticated Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Login as active test user
    await page.goto('http://localhost:3000/login')
    await page.fill('[name="email"]', 'test-active@example.local')
    await page.fill('[name="password"]', 'TestPass123!')
    await page.click('button[type="submit"]')
  })

  test('should access protected route', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard')
    await expect(page).toHaveURL('/dashboard')
  })
})
```

### Manual Testing

1. Start development server: `npm run dev`
2. Navigate to: `http://localhost:3000/login`
3. Use any test account credentials from table above
4. Test authenticated features

## Environment Variables

Scripts require the following environment variable in `.env.local`:

```bash
# Supabase Service Role Key (Admin API access)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get this from your Supabase project settings:
1. Go to Project Settings > API
2. Copy "service_role" key (keep it secret!)
3. Add to `.env.local`

## Script Categories

### Seeding (`seed/`)

Scripts that create test data for local development and testing.

- **test-users.ts** - Create test user accounts with different states
- Future: test-workouts.ts, test-history.ts, test-exercises.ts

### Database (`db/`)

Scripts for database operations and maintenance.

- Future: reset.ts (clean database), backup.ts (save data), verify-rls.ts (test security)

### Testing (root level - legacy)

- **test-rls-policies.ts** - Tests Row Level Security policies
- **test-session-management.ts** - Tests session handling

### Shared (`lib/`)

Reusable utilities used across multiple scripts.

- **dev-guard.ts** - Safety checks to prevent production execution
- **logger.ts** - Consistent logging with emoji indicators
- **db.ts** - Configured Supabase client for script usage

## Running Scripts

All scripts should be runnable via `tsx`:

```bash
tsx scripts/script-name.ts
```

Or add them to package.json for convenience:

```json
{
  "scripts": {
    "seed:users": "tsx scripts/seed/test-users.ts",
    "db:test-rls": "tsx scripts/test-rls-policies.ts"
  }
}
```

## Adding New Scripts

When creating a new script:

1. **Choose the right category** (seed/, db/, or other)
2. **Use shared utilities** (dev-guard, logger, db client)
3. **Add npm script** to package.json for convenience
4. **Include safety checks** using `assertDevelopment()`
5. **Add clear logging** so users know what's happening
6. **Document in this README** with usage examples

### Script Template

```typescript
#!/usr/bin/env tsx

import { createClient } from '../lib/db'
import { assertDevelopment } from '../lib/dev-guard'
import { logger } from '../lib/logger'

async function myScript() {
  // Safety first!
  assertDevelopment('my-script')

  logger.info('🚀 Starting my script...')

  const supabase = createClient()

  try {
    // Do work here
    logger.success('✓ Operation completed')
  } catch (error) {
    logger.error('✗ Operation failed:', error)
    throw error
  }

  logger.info('✅ Script completed successfully')
}

myScript().catch(console.error)
```

## Naming Conventions

- Use kebab-case for script names
- Prefix with category when appropriate (e.g., `test-`, `seed-`)
- Use descriptive names that indicate what the script does
- Example: `test-rls-policies.ts`, `seed-test-users.ts`

## Troubleshooting

### Script won't run

**Error:** `SUPABASE_SERVICE_ROLE_KEY not found in environment`

**Solution:** Add the service role key to `.env.local` (see Environment Variables section)

### Safety guard triggered

**Error:** `🚨 DANGER: script attempted to run in production!`

**Solution:** This is working correctly! Scripts are blocked from running in production. Only run in local development.

### TypeScript errors

**Solution:** Make sure you have `tsx` installed: `npm install -D tsx`

### Users already exist

Scripts will skip users that already exist. To re-create users:
1. Manually delete them from Supabase dashboard (Auth section)
2. Re-run the seeding script

## Future Enhancements

Planned additions to the scripts system:

- **Workout Seeding** - Generate sample workouts for test users
- **History Seeding** - Create historical workout sessions with date ranges
- **Database Reset** - Clean slate for fresh testing
- **Selective Seeding** - Flags like `--fresh`, `--user=active` for targeted seeding
- **Faker Integration** - Realistic random test data generation
- **Interactive Mode** - Prompts to choose what to seed

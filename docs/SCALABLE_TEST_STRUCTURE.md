# Scalable Test Structure for TabaTimer

## Current State

The project currently has:
- ✅ Vitest configured for unit/component tests
- ✅ Playwright configured for E2E tests
- ✅ `/e2e/` directory with one E2E test
- ✅ `/src/test/setup.ts` for Vitest configuration
- ❌ RLS test living in `/scripts/test-rls-policies.ts` (not scalable)
- ❌ No actual unit or integration tests yet

## Recommended Test Structure

### 1. Test Organization by Type

**✅ User Preferences Applied:**
- Unit tests co-located with source files
- Vitest workspace with separate configurations
- Tests use development database

```
tabatimer/
├── src/
│   ├── app/                    # Next.js app directory
│   │   └── (routes)/
│   │       └── api/
│   │           └── generate-workout/
│   │               ├── route.ts
│   │               └── route.test.ts    # Co-located API tests
│   ├── components/             # React components
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Button.test.tsx         # ✅ Co-located unit tests
│   ├── lib/
│   │   ├── db/
│   │   │   ├── queries.ts
│   │   │   └── queries.test.ts         # ✅ Co-located unit tests
│   │   ├── utils/
│   │   │   ├── timer.ts
│   │   │   └── timer.test.ts           # ✅ Co-located unit tests
│   │   └── actions/                    # Server Actions
│   │       ├── workout-actions.ts
│   │       └── workout-actions.test.ts # Co-located integration tests
│   └── test/
│       ├── setup.ts                    # Vitest setup (already exists)
│       ├── helpers/                    # Test utilities
│       │   ├── test-db.ts             # Database test helpers
│       │   ├── test-auth.ts           # Auth test helpers
│       │   └── fixtures.ts            # Test data fixtures
│       └── mocks/                     # Mock implementations
│           ├── supabase.ts
│           └── next-navigation.ts
├── e2e/                                # E2E tests (already exists)
│   ├── auth-flow.spec.ts
│   ├── workout-generation.spec.ts
│   └── timer.spec.ts
└── tests/                              # Root-level infrastructure tests (NEW)
    ├── database/                       # Database infrastructure tests
    │   ├── migrations.test.ts          # Test migration integrity
    │   ├── rls-policies.test.ts        # ✅ RLS policy verification (moved)
    │   └── seed-data.test.ts           # Seed data validation
    └── fixtures/                       # Shared test data
        ├── exercises.json
        └── users.json
```

### 2. Test Type Definitions

**Unit Tests** (`*.test.ts` or `*.test.tsx` co-located)
- Test individual functions, hooks, components in isolation
- Use mocks for external dependencies
- Fast execution (milliseconds)
- Examples: timer logic, utility functions, React components

**Integration Tests** (`src/lib/actions/**/*.test.ts`)
- Test interactions between modules
- May use real database (test instance) or mocks
- Test Server Actions, database queries, API routes
- Medium execution time (seconds)

**Infrastructure Tests** (`tests/database/*.test.ts`)
- Test database-level concerns: migrations, RLS, seeds
- Use real database (development or test instance)
- Run less frequently (before deploy, on CI)
- Slower execution (seconds to minutes)

**E2E Tests** (`e2e/*.spec.ts`)
- Test complete user flows through the UI
- Use real services in test/staging environment
- Slowest execution (minutes)
- Run before releases and on CI

### 3. Test Helper Structure

**`src/test/helpers/test-db.ts`** - Database test utilities:
```typescript
export async function createTestUser(overrides?: Partial<User>)
export async function createTestWorkout(userId: string, overrides?: Partial<Workout>)
export async function cleanupTestData()
```

**`src/test/helpers/test-auth.ts`** - Auth test utilities:
```typescript
export async function signInTestUser(email: string)
export async function createAuthenticatedClient(userId: string)
```

**`src/test/helpers/fixtures.ts`** - Shared test data:
```typescript
export const TEST_USERS = { ... }
export const TEST_WORKOUTS = { ... }
export const TEST_EXERCISES = { ... }
```

### 4. Configuration Updates

**Add test npm scripts** to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --project=unit",
    "test:integration": "vitest run --project=integration",
    "test:infrastructure": "vitest run --project=infrastructure",
    "test:e2e": "playwright test",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:infrastructure && npm run test:e2e",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "db:test-rls": "vitest run tests/database/rls-policies.test.ts"
  }
}
```

**✅ Create Vitest workspace configuration** (`vitest.workspace.ts`) for separate test configs:
```typescript
import { defineWorkspace } from 'vitest/config'
import { resolve } from 'path'

export default defineWorkspace([
  {
    // Unit tests - Components, hooks, utilities
    test: {
      name: 'unit',
      include: ['src/**/*.test.{ts,tsx}'],
      exclude: ['src/lib/actions/**/*.test.ts'], // Exclude server actions
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },
  {
    // Integration tests - Server actions, database queries
    test: {
      name: 'integration',
      include: ['src/lib/actions/**/*.test.ts'],
      environment: 'node',
      globals: true,
      testTimeout: 10000, // Longer timeout for DB operations
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },
  {
    // Infrastructure tests - Database, migrations, RLS
    test: {
      name: 'infrastructure',
      include: ['tests/**/*.test.ts'],
      environment: 'node',
      globals: true,
      testTimeout: 30000, // Even longer for infrastructure tests
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  },
])
```

### 5. Migration Plan for RLS Test

**✅ Using development database** - Tests will continue using the dev database via `.env` file.

Move `scripts/test-rls-policies.ts` → `tests/database/rls-policies.test.ts` and refactor to:

1. Convert from standalone script to Vitest test suite
2. Use Vitest's `describe`, `test`, `beforeAll`, `afterAll`
3. Extract setup logic to test helpers
4. Make it reusable and composable

**Before:**
```typescript
// scripts/test-rls-policies.ts
async function runTests() {
  const { user1, user2 } = await setupTestUsers();
  await testUsersTable(user1.id, user2.id);
  // ... more tests
}
runTests();
```

**After:**
```typescript
// tests/database/rls-policies.test.ts
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { createTestUser, cleanupTestUsers } from '@/test/helpers/test-db';

describe('RLS Policies', () => {
  let user1: User;
  let user2: User;

  beforeAll(async () => {
    user1 = await createTestUser();
    user2 = await createTestUser();
  });

  afterAll(async () => {
    await cleanupTestUsers([user1.id, user2.id]);
  });

  describe('Users Table', () => {
    test('user can read own profile', async () => {
      // ...
    });

    test('user cannot read other user profile', async () => {
      // ...
    });
  });

  describe('Workouts Table', () => {
    // ...
  });
});
```

## Benefits of This Structure

1. **Clear Separation**: Each test type has its own location and purpose
2. **Co-location**: Unit tests live next to the code they test (easy to find)
3. **Scalability**: Can add hundreds of tests without confusion
4. **Parallel Execution**: Different test types can run in parallel
5. **Selective Running**: Run only the tests you need during development
6. **Reusable Helpers**: Shared test utilities reduce duplication
7. **CI Optimization**: Can run fast tests first, slow tests later

## Implementation Steps

1. Create new directory structure:
   - `src/test/helpers/`
   - `src/test/mocks/`
   - `tests/database/`
   - `tests/fixtures/`

2. Create test helper files:
   - `src/test/helpers/test-db.ts`
   - `src/test/helpers/test-auth.ts`
   - `src/test/helpers/fixtures.ts`

3. Refactor RLS test:
   - Move to `tests/database/rls-policies.test.ts`
   - Convert to Vitest test format
   - Extract reusable helpers

4. Update configuration:
   - Add `vitest.workspace.ts`
   - Update npm scripts in `package.json`

5. Add documentation:
   - Update README with testing guidelines
   - Document test helper usage

## Verification

After implementation:
1. Run `npm run test:infrastructure` - Should execute RLS tests
2. Run `npm run test` - Should work as before
3. Verify tests appear organized in Vitest UI
4. Check that helpers are reusable across test types

## Files to Create/Modify

**New Files:**
- `vitest.workspace.ts` - Separate configurations for unit/integration/infrastructure tests
- `src/test/helpers/test-db.ts` - Database test utilities (createTestUser, cleanupTestData, etc.)
- `src/test/helpers/test-auth.ts` - Auth test utilities (createAuthenticatedClient, signInTestUser)
- `src/test/helpers/fixtures.ts` - Shared test data (TEST_USERS, TEST_WORKOUTS, TEST_EXERCISES)
- `src/test/mocks/.gitkeep` - Placeholder for mock implementations
- `tests/database/rls-policies.test.ts` - Refactored RLS test (moved from scripts/)
- `tests/fixtures/.gitkeep` - Placeholder for shared test fixtures

**Modified Files:**
- `package.json` - Add new test scripts (test:unit, test:integration, test:infrastructure, etc.)
- `vitest.config.ts` - May need to remove or simplify since workspace config takes over

**Deleted Files:**
- `scripts/test-rls-policies.ts` - Moved to `tests/database/rls-policies.test.ts`

**Optional Documentation:**
- `docs/TESTING.md` - Testing guidelines

## Example Test Helper Implementation

### `src/test/helpers/test-db.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/db/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createTestUser(overrides: {
  email?: string;
  password?: string;
  displayName?: string;
} = {}) {
  const email = overrides.email || `test-${Date.now()}@example.com`;
  const password = overrides.password || 'TestPassword123!';

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    throw new Error(`Failed to create test user: ${authError?.message}`);
  }

  // Create user record
  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      display_name: overrides.displayName,
    });

  if (userError) {
    throw new Error(`Failed to create user record: ${userError.message}`);
  }

  return {
    id: authData.user.id,
    email,
    password,
    displayName: overrides.displayName,
  };
}

export async function createTestWorkout(
  userId: string,
  overrides: Partial<Workout> = {}
) {
  const { data, error } = await supabase
    .from('workouts')
    .insert({
      user_id: userId,
      name: overrides.name || 'Test Workout',
      duration: overrides.duration || 30,
      difficulty: overrides.difficulty || 'intermediate',
      exercises: overrides.exercises || [],
      generated_by: overrides.generated_by || 'manual',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create test workout: ${error.message}`);
  }

  return data;
}

export async function cleanupTestUsers(userIds: string[]) {
  // Delete will cascade to related records via foreign keys
  for (const userId of userIds) {
    await supabase.from('users').delete().eq('id', userId);
    // Also delete from auth
    // Note: This requires service role key in real implementation
  }
}
```

### `src/test/helpers/test-auth.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/db/database.types';

export function createAuthenticatedClient(userId: string) {
  const client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // This would need to actually authenticate
  // In real tests, you'd sign in with the user's credentials
  return client;
}

export async function signInTestUser(email: string, password: string) {
  const client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Failed to sign in test user: ${error.message}`);
  }

  return { user: data.user, client };
}
```

## Usage Example

```typescript
// src/lib/db/queries.test.ts
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { createTestUser, createTestWorkout, cleanupTestUsers } from '@/test/helpers/test-db';
import { getWorkoutsByUserId } from './queries';

describe('Workout Queries', () => {
  let testUser: Awaited<ReturnType<typeof createTestUser>>;

  beforeAll(async () => {
    testUser = await createTestUser();
    await createTestWorkout(testUser.id, { name: 'Morning Routine' });
    await createTestWorkout(testUser.id, { name: 'Evening Workout' });
  });

  afterAll(async () => {
    await cleanupTestUsers([testUser.id]);
  });

  test('getWorkoutsByUserId returns user workouts', async () => {
    const workouts = await getWorkoutsByUserId(testUser.id);

    expect(workouts).toHaveLength(2);
    expect(workouts[0].name).toBe('Evening Workout'); // Most recent first
    expect(workouts[1].name).toBe('Morning Routine');
  });
});
```

## Summary

This scalable test structure:
- ✅ Co-locates unit tests with source code
- ✅ Uses Vitest workspace for different test environments
- ✅ Centralizes infrastructure tests in `/tests/`
- ✅ Provides reusable test helpers
- ✅ Enables selective test execution
- ✅ Scales from dozens to hundreds of tests
- ✅ Works with existing development database

Ready to implement when you're ready to proceed!

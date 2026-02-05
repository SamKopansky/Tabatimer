# Testing Guide

Comprehensive guide to testing in the TabaTimer project.

## Overview

Our testing strategy uses four distinct test categories, each with its own purpose, location, and execution environment:

1. **Unit Tests** - Test individual functions, hooks, and components in isolation
2. **Integration Tests** - Test interactions between modules (Server Actions, database queries, RLS policies)
3. **Infrastructure Tests** - Test database-level concerns (migrations, RLS, seeds)
4. **E2E Tests** - Test complete user flows through the UI

## Related Documentation

- [RLS Testing Guide](./TESTING_RLS.md) - Detailed guide for Row Level Security policy testing

## Quick Reference

| Test Type | Location | Extension | Environment | Run Command |
|-----------|----------|-----------|-------------|-------------|
| Unit | Co-located with source | `.test.ts(x)` | jsdom | `npm test` |
| Integration (Auth) | `src/actions/__tests__/` | `.test.ts` | Node (mocked) | `npm test` |
| Integration (RLS) | `src/lib/supabase/__tests__/` | `.test.ts` | Node (real DB) | `npm run test:integration` |
| Infrastructure | `tests/database/` | `.test.ts` | Node | `npm run test:infrastructure` |
| E2E | `e2e/` | `.spec.ts` | Browser | `npm run test:e2e` |

## Test Categories

### Unit Tests

**Purpose:** Test individual functions, hooks, and components in isolation.

**Location:** Co-located with source files

**Examples:**
```
src/components/timer/Timer.tsx
src/components/timer/Timer.test.tsx    ← Unit test

src/lib/utils/time.ts
src/lib/utils/time.test.ts              ← Unit test

src/hooks/useTimer.ts
src/hooks/useTimer.test.ts              ← Unit test
```

**Characteristics:**
- Fast execution (milliseconds)
- Use mocks for external dependencies
- Test pure logic and UI behavior
- Run on every file save during development

**Example:**
```typescript
// src/lib/utils/time.test.ts
import { describe, test, expect } from 'vitest';
import { formatDuration } from './time';

describe('formatDuration', () => {
  test('formats seconds correctly', () => {
    expect(formatDuration(45)).toBe('0:45');
  });

  test('formats minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2:05');
  });

  test('formats hours, minutes, and seconds', () => {
    expect(formatDuration(3665)).toBe('1:01:05');
  });
});
```

### Integration Tests

**Purpose:** Test interactions between modules, especially Server Actions and database queries.

**Location:** Co-located with server actions in `src/lib/actions/`

**Examples:**
```
src/lib/actions/workout-actions.ts
src/lib/actions/workout-actions.test.ts  ← Integration test
```

**Characteristics:**
- Medium execution time (seconds)
- May use real database or sophisticated mocks
- Test end-to-end server action flows
- Include authentication and authorization logic

**Example:**
```typescript
// src/lib/actions/workout-actions.test.ts
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { saveWorkout } from './workout-actions';
import { createTestUser, cleanupTestUsers } from '@/test/helpers/test-db';

describe('saveWorkout', () => {
  let testUser: Awaited<ReturnType<typeof createTestUser>>;

  beforeAll(async () => {
    testUser = await createTestUser();
  });

  afterAll(async () => {
    await cleanupTestUsers([testUser.id]);
  });

  test('saves workout with valid data', async () => {
    const workout = await saveWorkout({
      name: 'Morning Routine',
      duration: 30,
      difficulty: 'intermediate',
      exercises: [],
    });

    expect(workout.name).toBe('Morning Routine');
    expect(workout.userId).toBe(testUser.id);
  });

  test('throws error when user not authenticated', async () => {
    // Test without auth
    await expect(saveWorkout({
      name: 'Test',
      duration: 30,
    })).rejects.toThrow('Unauthorized');
  });
});
```

### Infrastructure Tests

**Purpose:** Test database-level concerns like migrations, RLS policies, and seed data.

**Location:** `tests/database/` directory

**Examples:**
```
tests/
├── database/
│   ├── rls-policies.test.ts      ← Infrastructure test
│   ├── migrations.test.ts        ← Infrastructure test
│   └── seed-data.test.ts         ← Infrastructure test
└── fixtures/
    ├── exercises.json
    └── users.json
```

**Characteristics:**
- Slower execution (seconds to minutes)
- Use real database (development instance)
- Test database-level guarantees
- Run before deployments and in CI

**Example:**
```typescript
// tests/database/rls-policies.test.ts
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { createTestUser, cleanupTestUsers } from '@/test/helpers/test-db';
import { createAuthenticatedClient } from '@/test/helpers/test-auth';

describe('RLS Policies', () => {
  let user1: Awaited<ReturnType<typeof createTestUser>>;
  let user2: Awaited<ReturnType<typeof createTestUser>>;

  beforeAll(async () => {
    user1 = await createTestUser();
    user2 = await createTestUser();
  });

  afterAll(async () => {
    await cleanupTestUsers([user1.id, user2.id]);
  });

  describe('Workouts Table', () => {
    test('user can read own workouts', async () => {
      const client = await createAuthenticatedClient(user1.id);
      const { data, error } = await client
        .from('workouts')
        .select('*')
        .eq('user_id', user1.id);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    test('user cannot read other user workouts', async () => {
      const client = await createAuthenticatedClient(user1.id);
      const { data, error } = await client
        .from('workouts')
        .select('*')
        .eq('user_id', user2.id);

      // RLS should prevent this - returns empty array
      expect(data).toEqual([]);
    });
  });
});
```

### E2E Tests

**Purpose:** Test complete user flows through the UI.

**Location:** `e2e/` directory

**Examples:**
```
e2e/
├── auth-flow.spec.ts           ← E2E test
├── workout-generation.spec.ts  ← E2E test
└── timer.spec.ts               ← E2E test
```

**Characteristics:**
- Slowest execution (minutes)
- Use real browser with Playwright
- Test critical user journeys
- Run before releases and in CI

**Example:**
```typescript
// e2e/workout-generation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Workout Generation', () => {
  test('generates workout from prompt', async ({ page }) => {
    await page.goto('/');

    // Navigate to workout generation
    await page.click('text=Generate Workout');

    // Enter prompt
    await page.fill('textarea[placeholder*="workout"]',
      'I want a 30 minute leg workout with dumbbells');

    // Submit
    await page.click('button:has-text("Generate")');

    // Wait for AI generation
    await page.waitForSelector('text=Workout Generated', { timeout: 30000 });

    // Verify workout appears
    await expect(page.locator('.workout-card')).toBeVisible();
    await expect(page.locator('.exercise-list')).toHaveCount.greaterThan(0);

    // Verify save button exists
    await expect(page.locator('button:has-text("Save")')).toBeVisible();
  });
});
```

## Test Helpers

### Database Helpers

Location: `src/test/helpers/test-db.ts`

**Purpose:** Simplify database operations in tests.

```typescript
// src/test/helpers/test-db.ts
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
    // Note: Also delete from auth.users with service role key in production
  }
}
```

**Usage:**
```typescript
import { createTestUser, createTestWorkout, cleanupTestUsers } from '@/test/helpers/test-db';

describe('My Test', () => {
  let user: Awaited<ReturnType<typeof createTestUser>>;

  beforeAll(async () => {
    user = await createTestUser();
    await createTestWorkout(user.id, { name: 'My Workout' });
  });

  afterAll(async () => {
    await cleanupTestUsers([user.id]);
  });

  // Tests here...
});
```

### Auth Helpers

Location: `src/test/helpers/test-auth.ts`

**Purpose:** Simplify authentication in tests.

```typescript
// src/test/helpers/test-auth.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/db/database.types';

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

export async function createAuthenticatedClient(userId: string) {
  // In real implementation, you'd get the user's credentials
  // and sign in to get an authenticated client
  const client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}
```

### Test Fixtures

Location: `src/test/helpers/fixtures.ts`

**Purpose:** Provide consistent test data across tests.

```typescript
// src/test/helpers/fixtures.ts
export const TEST_USERS = {
  john: {
    email: 'john@example.com',
    displayName: 'John Doe',
    password: 'TestPassword123!',
  },
  jane: {
    email: 'jane@example.com',
    displayName: 'Jane Smith',
    password: 'TestPassword123!',
  },
};

export const TEST_WORKOUTS = {
  beginner: {
    name: 'Beginner Full Body',
    duration: 20,
    difficulty: 'beginner' as const,
    exercises: [
      { name: 'Squats', sets: 3, reps: 10 },
      { name: 'Push-ups', sets: 3, reps: 8 },
    ],
  },
  advanced: {
    name: 'Advanced HIIT',
    duration: 45,
    difficulty: 'advanced' as const,
    exercises: [
      { name: 'Burpees', sets: 5, reps: 15 },
      { name: 'Box Jumps', sets: 5, reps: 12 },
    ],
  },
};

export const TEST_EXERCISES = {
  squat: {
    name: 'Squat',
    category: 'legs',
    difficulty: 'beginner',
    equipment: ['bodyweight'],
  },
  benchPress: {
    name: 'Bench Press',
    category: 'chest',
    difficulty: 'intermediate',
    equipment: ['barbell', 'bench'],
  },
};
```

## Running Tests

### Development Workflow

**Watch mode (recommended during development):**
```bash
npm run test:watch
```
Runs tests in watch mode, re-running when files change.

**Run all unit tests:**
```bash
npm run test:unit
```

**Run specific test file:**
```bash
npm run test:unit -- Timer.test.tsx
```

**Run tests matching pattern:**
```bash
npm run test:unit -- workout
```
Runs all test files with "workout" in the name.

### CI/Production Workflow

**Run all tests:**
```bash
npm run test:all
```
Runs unit, integration, infrastructure, and E2E tests sequentially.

**Individual test types:**
```bash
npm run test:unit           # Fast unit tests
npm run test:integration    # Server action tests
npm run test:infrastructure # Database tests
npm run test:e2e           # Playwright E2E tests
```

**With coverage:**
```bash
npm run test:coverage
```
Generates coverage report in `coverage/` directory.

## Writing Good Tests

### Test Naming

**Describe behavior, not implementation:**

✅ **Good:**
```typescript
test('pauses timer when workout is interrupted', () => {})
test('displays error message when workout generation fails', () => {})
test('allows user to save custom workout', () => {})
```

❌ **Bad:**
```typescript
test('sets isRunning to false', () => {})
test('shows error div', () => {})
test('calls saveWorkout function', () => {})
```

### Test Structure

Use **Arrange-Act-Assert** pattern:

```typescript
test('calculates workout duration correctly', () => {
  // Arrange - Set up test data
  const exercises = [
    { name: 'Squats', duration: 30 },
    { name: 'Push-ups', duration: 45 },
  ];
  const rest = 15;

  // Act - Perform the action
  const duration = calculateWorkoutDuration(exercises, rest);

  // Assert - Verify the result
  expect(duration).toBe(90); // 30 + 45 + 15
});
```

### Test Independence

Each test should be independent and not rely on other tests:

✅ **Good:**
```typescript
describe('Workout actions', () => {
  beforeEach(async () => {
    // Each test gets fresh user
    user = await createTestUser();
  });

  afterEach(async () => {
    // Clean up after each test
    await cleanupTestUsers([user.id]);
  });

  test('creates workout', async () => {
    const workout = await saveWorkout({ name: 'Test' });
    expect(workout).toBeDefined();
  });

  test('updates workout', async () => {
    const workout = await saveWorkout({ name: 'Test' });
    const updated = await updateWorkout(workout.id, { name: 'Updated' });
    expect(updated.name).toBe('Updated');
  });
});
```

❌ **Bad:**
```typescript
describe('Workout actions', () => {
  let workout: Workout;

  test('creates workout', async () => {
    workout = await saveWorkout({ name: 'Test' });
    expect(workout).toBeDefined();
  });

  test('updates workout', async () => {
    // Relies on previous test!
    const updated = await updateWorkout(workout.id, { name: 'Updated' });
    expect(updated.name).toBe('Updated');
  });
});
```

### Testing React Components

Use React Testing Library patterns:

```typescript
// src/components/timer/Timer.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { Timer } from './Timer';

describe('Timer', () => {
  test('renders countdown display', () => {
    render(<Timer initialTime={300} />);
    expect(screen.getByText('5:00')).toBeInTheDocument();
  });

  test('starts countdown when start button clicked', async () => {
    render(<Timer initialTime={10} />);

    const startButton = screen.getByRole('button', { name: /start/i });
    fireEvent.click(startButton);

    // Wait for time to decrease
    await screen.findByText('0:09');
  });

  test('pauses countdown when pause button clicked', () => {
    render(<Timer initialTime={10} />);

    // Start timer
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    // Pause timer
    fireEvent.click(screen.getByRole('button', { name: /pause/i }));

    // Verify still shows same time
    expect(screen.getByText(/0:10|0:09/)).toBeInTheDocument();
  });
});
```

## Common Patterns

### Testing Async Functions

```typescript
test('generates workout successfully', async () => {
  const workout = await generateWorkout('30 min leg workout');

  expect(workout).toBeDefined();
  expect(workout.exercises.length).toBeGreaterThan(0);
});
```

### Testing Error Cases

```typescript
test('throws error for invalid input', async () => {
  await expect(
    generateWorkout('') // Empty prompt
  ).rejects.toThrow('Prompt cannot be empty');
});
```

### Mocking Functions

```typescript
import { vi } from 'vitest';

test('calls AI service with correct prompt', async () => {
  const mockGenerate = vi.fn().mockResolvedValue({ exercises: [] });

  await generateWorkout('test prompt', mockGenerate);

  expect(mockGenerate).toHaveBeenCalledWith(
    expect.objectContaining({
      prompt: 'test prompt'
    })
  );
});
```

### Testing Timers

```typescript
import { vi } from 'vitest';

test('calls callback after timeout', async () => {
  vi.useFakeTimers();

  const callback = vi.fn();
  startTimer(1000, callback);

  // Fast-forward time
  vi.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalled();

  vi.useRealTimers();
});
```

## Coverage Goals

- **Core timer logic:** 100% (critical functionality)
- **AI generation:** 80%+ (focus on prompt parsing and validation)
- **UI components:** 70%+ (focus on user interactions)
- **Server actions:** 80%+ (important business logic)

## Troubleshooting

### Tests Timing Out

If infrastructure or integration tests timeout:

```typescript
// Increase timeout for specific test
test('slow database operation', async () => {
  // Test code
}, 60000); // 60 second timeout

// Or for entire suite
describe('Database tests', () => {
  // Tests here
}, { timeout: 60000 });
```

### Database Connection Errors

Ensure `.env` file has correct Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### Test Isolation Issues

If tests fail when run together but pass individually:

1. Check for shared state between tests
2. Ensure proper cleanup in `afterEach`/`afterAll`
3. Use fresh test data in each test

### Flaky Tests

If tests pass/fail intermittently:

1. Add proper `waitFor` calls for async operations
2. Don't rely on timing (use fake timers)
3. Ensure proper test isolation
4. Check for race conditions

## Best Practices

1. **Write tests first** (TDD) for complex logic
2. **Test behavior**, not implementation
3. **Keep tests simple** - one assertion per test when possible
4. **Use descriptive names** - tests serve as documentation
5. **Clean up after tests** - don't leave data in database
6. **Mock external dependencies** - unit tests should be isolated
7. **Use helpers** - reduce duplication with test utilities
8. **Run tests often** - catch bugs early
9. **Maintain tests** - update when behavior changes
10. **Review coverage** - but don't chase 100% blindly

## See Also

- `docs/SCALABLE_TEST_STRUCTURE.md` - Detailed test structure documentation
- `openspec/specs/testing/spec.md` - Test organization requirements
- `docs/SCALABILITY_TRIGGERS.md` - Architectural thinking guide
- `openspec/project.md` - Project conventions and principles

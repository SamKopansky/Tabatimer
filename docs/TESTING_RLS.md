# RLS Testing Guide

This document explains how Row Level Security (RLS) policies are tested in the Tabatimer application.

## Overview

Row Level Security (RLS) is a critical security feature in Supabase/PostgreSQL that ensures users can only access their own data. RLS policies are enforced at the database level, making them more secure than application-level checks.

## Why Test RLS?

Testing RLS policies is essential because:

1. **Security**: RLS is your primary defense against unauthorized data access
2. **Database-level enforcement**: Application bugs can't bypass RLS if properly configured
3. **User privacy**: Ensures complete data isolation between users
4. **Compliance**: Verifies data access controls required by privacy regulations

## Testing Approach

### Unit Tests (Mocked)

Unit tests in `src/actions/__tests__/` use mocked Supabase clients to test:
- Server Action logic
- Input validation
- Error handling
- Business logic

These tests do NOT verify RLS policies because they use mocks.

### Integration Tests (Real Database)

Integration tests in `src/lib/supabase/__tests__/rls-policies.test.ts` use real Supabase connections to verify:
- RLS policies are correctly configured
- Users can only access their own data
- Cross-user data access is prevented
- Public data (exercises) is readable but not writable

## Running RLS Tests

### Prerequisites

1. Start local Supabase:
   ```bash
   npm run db:start
   ```

2. Apply migrations:
   ```bash
   npm run db:push
   ```

3. (Optional) Seed test data:
   ```bash
   npm run db:seed
   ```

### Run Tests

```bash
# Run only RLS integration tests
npm run test:integration

# Run all tests (unit + integration)
npm run test:all

# Run RLS tests in watch mode (useful during development)
RUN_INTEGRATION_TESTS=true npm test -- --watch rls-policies
```

### Environment Setup

RLS integration tests require:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
RUN_INTEGRATION_TESTS=true
```

## Test Structure

### Test Organization

```
src/lib/supabase/__tests__/
├── README.md                    # Test documentation
└── rls-policies.test.ts         # RLS integration tests
```

### Test Coverage

The RLS test suite covers:

#### 1. Users Table
- ✅ Read own profile
- ✅ Cannot read other profiles
- ✅ Update own profile
- ✅ Cannot update other profiles

#### 2. Workouts Table
- ✅ CRUD operations on own workouts
- ✅ Cannot access other users' workouts
- ✅ List queries are filtered by user

#### 3. Workout History Table
- ✅ Read own history
- ✅ Cannot read other users' history
- ✅ Insert own history records

#### 4. User Preferences Table
- ✅ Read/update own preferences
- ✅ Cannot access other users' preferences

#### 5. Exercises Table (Public)
- ✅ All users can read
- ✅ Users cannot write/update/delete

#### 6. Cross-User Isolation
- ✅ Complete data separation between users

## How RLS Tests Work

### 1. Setup Phase
```typescript
// Create two test users with real authentication
const user1 = await createTestUser('user1@test.com')
const user2 = await createTestUser('user2@test.com')

// Create authenticated Supabase clients for each user
const user1Client = createAuthenticatedClient(user1)
const user2Client = createAuthenticatedClient(user2)
```

### 2. Test Execution
```typescript
// User 1 creates data
await user1Client.from('workouts').insert({
  user_id: user1.id,
  name: 'My Workout'
})

// Verify User 1 can read it
const result1 = await user1Client
  .from('workouts')
  .select()
  .eq('user_id', user1.id)
expect(result1.data).toBeDefined()

// Verify User 2 CANNOT read it (RLS enforcement)
const result2 = await user2Client
  .from('workouts')
  .select()
  .eq('user_id', user1.id)
expect(result2.data).toBeNull() // RLS filters it out
```

### 3. Cleanup Phase
```typescript
// Sign out test users
await user1Client.auth.signOut()
await user2Client.auth.signOut()
```

## Interpreting Test Results

### Success Indicators

✅ **All tests pass**: RLS policies are correctly configured

Example output:
```
✓ src/lib/supabase/__tests__/rls-policies.test.ts (45)
  ✓ Users Table RLS (4)
    ✓ should allow users to read their own profile
    ✓ should prevent users from reading other users profiles
    ✓ should allow users to update their own profile
    ✓ should prevent users from updating other users profiles
  ...
```

### Failure Scenarios

❌ **Test fails: User can read other user's data**
- **Cause**: RLS policy missing or misconfigured
- **Fix**: Check `supabase/migrations/*_rls_policies.sql`
- **Example fix**:
  ```sql
  -- Missing or incorrect policy
  CREATE POLICY "workouts_select_own" ON workouts
    FOR SELECT
    USING (auth.uid() = user_id);  -- Must match user's ID
  ```

❌ **Test fails: Cannot create test users**
- **Cause**: Email confirmation required, or Supabase not running
- **Fix**: Disable email confirmation in Supabase settings (test env only)

❌ **All tests skip**
- **Cause**: `RUN_INTEGRATION_TESTS` not set to `true`
- **Fix**: Set environment variable: `RUN_INTEGRATION_TESTS=true`

## CI/CD Integration

### GitHub Actions

Add RLS tests to your CI pipeline:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Supabase
        uses: supabase/setup-cli@v1

      - name: Start Supabase
        run: supabase start

      - name: Run Unit Tests
        run: npm run test:unit

      - name: Run RLS Integration Tests
        env:
          RUN_INTEGRATION_TESTS: true
        run: npm run test:integration
```

## Best Practices

### 1. Test Real Scenarios
✅ **Do**: Test with real authenticated users and Supabase clients
❌ **Don't**: Mock RLS behavior in tests (defeats the purpose)

### 2. Verify Negative Cases
✅ **Do**: Test that users CANNOT access other users' data
❌ **Don't**: Only test positive cases (can access own data)

### 3. Use Temporary Data
✅ **Do**: Create unique test users with timestamps
❌ **Don't**: Use shared test accounts (can cause conflicts)

### 4. Clean Up
✅ **Do**: Sign out users after tests
❌ **Don't**: Leave authenticated sessions open

### 5. Test Against Local DB
✅ **Do**: Run RLS tests against local Supabase during development
❌ **Don't**: Run RLS tests against production database

## Troubleshooting

### Problem: Tests timeout

**Solution**: Check that Supabase is running
```bash
npm run db:status
# If not running:
npm run db:start
```

### Problem: "Failed to create user"

**Solutions**:
1. Disable email confirmation in Supabase:
   - Dashboard → Authentication → Email → Confirm email: OFF (local only)
2. Check Supabase logs:
   ```bash
   supabase status
   # Check the API URL is accessible
   ```

### Problem: RLS tests fail but policies look correct

**Solutions**:
1. Verify RLS is enabled on tables:
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public';
   ```

2. Check policy definitions:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

3. Test policies manually in SQL:
   ```sql
   -- Simulate user context
   SET LOCAL role authenticated;
   SET LOCAL "request.jwt.claims" = '{"sub": "user-id-here"}';

   -- Try query
   SELECT * FROM workouts;
   ```

### Problem: Tests pass locally but fail in CI

**Solutions**:
1. Ensure CI starts Supabase before tests
2. Check environment variables are set correctly
3. Verify migrations are applied in CI
4. Check Supabase version matches local

## Maintenance

### When to Update RLS Tests

Update RLS tests when:
- ✏️ Adding new tables
- ✏️ Modifying RLS policies
- ✏️ Changing user permissions
- ✏️ Adding new user roles
- ✏️ Modifying table schemas that affect RLS

### Regular Verification

Run RLS tests:
- ✅ Before every commit (pre-commit hook)
- ✅ On every PR (CI/CD)
- ✅ After modifying migrations
- ✅ After Supabase version updates

## Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Testing Best Practices](./TESTING.md)
- [Migration Guide](../supabase/migrations/README.md)

## Summary

RLS testing is critical for security. The key points:

1. **Use real connections**: Test against actual Supabase instance
2. **Test isolation**: Verify users cannot access others' data
3. **Test all tables**: Every table with RLS needs tests
4. **Run regularly**: Include in CI/CD pipeline
5. **Update with changes**: Keep tests in sync with policies

Following these practices ensures your RLS policies are correctly configured and your users' data remains secure.

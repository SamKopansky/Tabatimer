# RLS Policy Integration Tests

This directory contains integration tests for Row Level Security (RLS) policies in Supabase.

## Purpose

These tests verify that:
- Users can only access their own data
- Users cannot access or modify other users' data
- Exercises are publicly readable but not writable by regular users
- All database tables have proper RLS policies enforced

## Running the Tests

### Prerequisites

1. **Supabase Instance**: You need a running Supabase instance (local or remote)
2. **Environment Variables**: Set the following in your `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   RUN_INTEGRATION_TESTS=true
   ```

### Local Development

For local testing with Supabase local development:

```bash
# Start Supabase locally
npx supabase start

# Run the RLS tests
RUN_INTEGRATION_TESTS=true npm run test -- rls-policies
```

### CI/CD

In CI/CD pipelines, these tests should run against a dedicated test database:

```bash
# GitHub Actions example
- name: Run RLS Integration Tests
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}
    RUN_INTEGRATION_TESTS: true
  run: npm run test -- rls-policies
```

## Test Coverage

The RLS integration tests cover:

### Users Table
- ✅ Users can read their own profile
- ✅ Users cannot read other users' profiles
- ✅ Users can update their own profile
- ✅ Users cannot update other users' profiles

### Workouts Table
- ✅ Users can read their own workouts
- ✅ Users cannot read other users' workouts
- ✅ List queries only return user's own workouts
- ✅ Users can update their own workouts
- ✅ Users cannot update other users' workouts
- ✅ Users can delete their own workouts
- ✅ Users cannot delete other users' workouts

### Workout History Table
- ✅ Users can read their own history
- ✅ Users cannot read other users' history
- ✅ List queries only return user's own history

### User Preferences Table
- ✅ Users can read their own preferences
- ✅ Users cannot read other users' preferences
- ✅ Users can update their own preferences
- ✅ Users cannot update other users' preferences

### Exercises Table
- ✅ All users can read exercises (public read access)
- ✅ Users cannot insert exercises
- ✅ Users cannot update exercises
- ✅ Users cannot delete exercises

### Cross-User Isolation
- ✅ Complete data isolation between different user accounts

## Test Architecture

The tests use:
- Real Supabase connections (not mocks)
- Multiple authenticated user clients
- Temporary test user accounts created during setup
- Cleanup of test data after completion

## Skipping Tests

By default, these integration tests are skipped unless `RUN_INTEGRATION_TESTS=true` is set. This prevents accidental test runs against production databases and allows faster unit test execution.

To skip these tests even when the env var is set:
```bash
npm run test -- --testPathIgnorePatterns=rls-policies
```

## Troubleshooting

### Tests fail with "Missing NEXT_PUBLIC_SUPABASE_URL"
- Ensure your `.env.local` file has the required environment variables
- Or set them directly: `NEXT_PUBLIC_SUPABASE_URL=... RUN_INTEGRATION_TESTS=true npm test`

### Tests fail with "Failed to create user"
- Check that email confirmation is disabled in Supabase settings for test environment
- Or manually confirm test user emails in Supabase dashboard

### Tests timeout
- Increase test timeout in vitest config
- Check network connectivity to Supabase instance
- Verify Supabase instance is running

### RLS policy violations not working as expected
- Verify migrations have been applied: `npx supabase db push`
- Check RLS policies in Supabase dashboard
- Ensure RLS is enabled on all tables

## Best Practices

1. **Always run against test database**: Never run integration tests against production
2. **Use temporary users**: Tests create and clean up test users automatically
3. **Isolate test data**: Each test run uses unique email addresses with timestamps
4. **Check RLS at database level**: These tests verify database-level security, not just application logic

## Related Files

- `supabase/migrations/20240101000001_rls_policies.sql` - RLS policy definitions
- `src/lib/supabase/server.ts` - Server-side Supabase client
- `src/lib/supabase/client.ts` - Client-side Supabase client

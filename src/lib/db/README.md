# Database Setup Guide

## Overview

This project uses Supabase for data persistence with PostgreSQL. The database includes tables for users, exercises, workouts, workout history, and user preferences. We use the Supabase JS Client for all database operations with TypeScript types auto-generated from the schema.

## Prerequisites

1. Supabase CLI installed: `npm install -g supabase`
2. Docker Desktop running (for local development)
3. A Supabase project (for production)

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase Anon/Public Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### How to Get Your Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** > **API**
3. Copy the **Project URL** to `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the **anon/public key** to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy the **service_role key** to `SUPABASE_SERVICE_ROLE_KEY` (optional, for admin tasks)

## Local Development Setup

### 1. Start Local Supabase

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Start local Supabase services
supabase start
```

This will start:
- PostgreSQL database on `localhost:54322`
- Supabase Studio on `http://localhost:54323`
- API Gateway on `http://localhost:54321`

### 2. Apply Migrations

Migrations are automatically applied when you run `supabase start`. To manually apply:

```bash
# Apply all pending migrations
supabase db reset

# Or create a new migration
supabase migration new your_migration_name
```

### 3. Generate TypeScript Types

After any schema changes:

```bash
npm run db:types
```

This generates `src/lib/db/database.types.ts` with TypeScript types for all tables, views, and functions.

### 4. Seed the Exercise Library

```bash
npm run db:seed
```

This populates the `exercises` table with 50+ pre-defined exercises.

## Database Schema

### Tables

- **users** - Extended user profiles (linked to Supabase auth.users)
  - `id` (uuid, primary key)
  - `display_name` (text)
  - `created_at`, `updated_at` (timestamp)

- **exercises** - Exercise library with instructions and metadata
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `instructions` (text)
  - `muscle_groups` (text array)
  - `difficulty` (enum: beginner, intermediate, advanced)
  - `equipment` (enum: bodyweight, dumbbells, etc.)
  - `form_tips` (text, optional)
  - `image_url` (text, optional)

- **workouts** - User-created or AI-generated workout plans
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `name`, `description` (text)
  - `duration` (integer)
  - `difficulty` (enum)
  - `exercises` (jsonb)
  - `prompt` (text, optional - for AI-generated)
  - `generated_by` (enum: ai, template, manual)

- **workout_history** - Completed workout sessions and stats
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `workout_id` (uuid, foreign key, nullable)
  - `workout_snapshot` (jsonb)
  - `status` (enum: completed, abandoned)
  - `duration_seconds` (integer)
  - `completed_at` (timestamp)
  - `notes` (text, optional)

- **user_preferences** - User settings for timer and workout generation
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key, unique)
  - `default_work_duration` (integer, default 20)
  - `default_rest_duration` (integer, default 10)
  - `audio_enabled` (boolean, default true)
  - `preferred_equipment` (text array)

### Security

All tables have Row Level Security (RLS) enabled:
- Users can only access their own workouts, history, and preferences
- Exercises are public read-only
- All policies use `auth.uid()` to enforce user isolation

View RLS policies in `supabase/migrations/20240101000001_rls_policies.sql`

## Useful Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database (reapply all migrations)
supabase db reset

# Generate TypeScript types from schema
npm run db:types

# Seed exercises
npm run db:seed

# Open Supabase Studio (visual database browser)
# Visit http://localhost:54323 after running supabase start

# Create a new migration
supabase migration new migration_name

# Link to remote Supabase project
supabase link --project-ref your-project-ref

# Push local migrations to remote
supabase db push

# Pull remote schema changes
supabase db pull
```

## Making Schema Changes

When you need to modify the database schema:

1. Create a new migration file:
   ```bash
   supabase migration new add_new_column
   ```

2. Edit the generated file in `supabase/migrations/`
   ```sql
   ALTER TABLE workouts ADD COLUMN new_field text;
   ```

3. Apply the migration locally:
   ```bash
   supabase db reset
   ```

4. Regenerate TypeScript types:
   ```bash
   npm run db:types
   ```

5. Update your queries in `src/lib/db/queries.ts`

6. Push to production when ready:
   ```bash
   supabase db push
   ```

## Using the Database in Code

### Server-Side Queries (Recommended)

All queries use the server-side Supabase client which enforces RLS:

```typescript
import { createClient } from '@/lib/db'

export async function getWorkouts(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data
}
```

### Using Query Functions

Pre-built query functions are available in `src/lib/db/queries.ts`:

```typescript
import { getWorkoutsByUserId, createWorkout } from '@/lib/db/queries'

// Get all workouts for a user
const workouts = await getWorkoutsByUserId(userId)

// Create a new workout
const workout = await createWorkout({
  user_id: userId,
  name: 'Morning Workout',
  duration: 30,
  difficulty: 'intermediate',
  exercises: [...],
  generated_by: 'manual'
})
```

## Troubleshooting

### Local Development Issues

**Port conflicts:**
- Check if ports 54321-54323 are available
- Stop other PostgreSQL instances
- Use `supabase stop` and `supabase start` to restart

**Docker issues:**
- Ensure Docker Desktop is running
- Check Docker has enough resources allocated
- Try `docker ps` to see running containers

**Migration errors:**
- Review migration files for syntax errors
- Use `supabase db reset` to start fresh (dev only!)
- Check migration order in `supabase/migrations/` directory

### Type Generation Issues

**Types not updating:**
- Make sure `supabase start` is running
- Run `npm run db:types` after schema changes
- Check that `database.types.ts` file is writable

**Type errors after migration:**
- Regenerate types: `npm run db:types`
- Restart TypeScript server in your IDE
- Clear Next.js cache: `rm -rf .next`

### RLS Policy Errors

**Access denied errors:**
- Verify user is authenticated (`auth.uid()` returns value)
- Check RLS policies in Supabase Studio
- Test policies in SQL Editor with `select auth.uid()`

**Seed data not visible:**
- Seed data bypasses RLS when using service role key
- Check that exercises table has proper RLS policies
- Verify queries use the correct Supabase client

## Production Deployment

1. Create migrations locally and test thoroughly
2. Link to your production project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
3. Push migrations:
   ```bash
   supabase db push
   ```
4. Run seeds if needed (use admin scripts)
5. Update environment variables in your deployment platform

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client Reference](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)

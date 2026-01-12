# Drizzle to Supabase Migration Plan

## Status: TODO

This project has been partially migrated from Drizzle ORM to Supabase, but significant Drizzle code remains.

## Problem Summary

While Drizzle packages have been removed from `package.json`, the entire `src/lib/db/` directory still contains Drizzle ORM code that is either broken or non-functional.

## Current State

### 🔴 Broken Code

**Missing file: `src/lib/db/schema.ts`**
- Referenced in:
  - `src/lib/db/index.ts:3`
  - `src/lib/db/queries.ts:17`
  - `src/lib/db/seed.ts:2`
- **This means all database code is currently broken**

### 🔴 Files Requiring Migration

1. **src/lib/db/index.ts** (18 lines)
   - Full Drizzle database connection
   - Imports: `drizzle` from `drizzle-orm/postgres-js`, `postgres` from `postgres-js`
   - Creates Drizzle client instance with connection pooling
   - Exports `db` object used throughout the app

2. **src/lib/db/queries.ts** (343 lines)
   - Imports: `eq, and, desc, sql, ilike, inArray` from `drizzle-orm`
   - Contains all database query functions:
     - User queries (getUserById, createUser, updateUser)
     - Exercise queries (getAllExercises, searchExercises, filterExercises)
     - Workout queries (getWorkoutsByUserId, createWorkout, etc.)
     - Workout history queries (getWorkoutHistoryByUserId, createWorkoutHistory, etc.)
     - User preferences queries (getUserPreferences, updateUserPreferences)
     - Statistics queries (getUserStats, getWorkoutStreak)
   - All queries use Drizzle syntax (`.select().from().where()`)

3. **src/lib/db/seed.ts** (544 lines)
   - 50+ pre-defined exercises with full metadata
   - Uses Drizzle's `db.insert(exercises).values().onConflictDoNothing()`
   - Contains rich exercise data (instructions, muscle groups, difficulty, equipment, form tips)

4. **src/lib/db/README.md** (132 lines)
   - Complete Drizzle-focused documentation
   - References commands: `db:generate`, `db:push`, `db:studio`
   - Setup instructions for Drizzle workflow
   - Needs complete rewrite for Supabase approach

5. **src/lib/db/database.types.ts**
   - Auto-generated TypeScript types
   - May need regeneration after migration

### ✅ Already Cleaned

- ✅ No Drizzle packages in `package.json`
- ✅ No `drizzle.config.*` file
- ✅ No Drizzle in `package-lock.json`

### ⚠️ Leftover Artifacts

- `node_modules/@drizzle-team/` directory may exist but won't be used
  - Can be removed with `npm prune` after migration

### 📝 Documentation References

Drizzle is also mentioned in:
- `openspec/project.md`
- `openspec/changes/build-personal-trainer-mvp/tasks.md`
- `openspec/changes/build-personal-trainer-mvp/design.md`
- `openspec/changes/build-personal-trainer-mvp/proposal.md`

These should be updated to reflect Supabase architecture.

## Migration Tasks

### Phase 1: Schema & Setup

- [ ] **1.1** Review existing Supabase migrations in `supabase/migrations/`
- [ ] **1.2** Ensure all tables from Drizzle schema exist in Supabase
  - users
  - exercises
  - workouts
  - workout_history
  - user_preferences
- [ ] **1.3** Generate TypeScript types: `npm run db:types`
- [ ] **1.4** Verify RLS policies are in place for all tables

### Phase 2: Database Client

- [ ] **2.1** Rewrite `src/lib/db/index.ts`
  - Remove Drizzle and postgres imports
  - Import Supabase client from `src/lib/supabase/`
  - Export Supabase client for queries
  - Update to use `@supabase/supabase-js`

### Phase 3: Query Functions

- [ ] **3.1** Rewrite `src/lib/db/queries.ts` - User queries
  - Convert `getUserById()` to Supabase syntax
  - Convert `createUser()` to Supabase syntax
  - Convert `updateUser()` to Supabase syntax

- [ ] **3.2** Rewrite `src/lib/db/queries.ts` - Exercise queries
  - Convert `getAllExercises()` to Supabase syntax
  - Convert `getExerciseById()` to Supabase syntax
  - Convert `searchExercises()` to Supabase syntax
  - Convert `filterExercises()` to Supabase syntax
  - Convert `getExercisesByEquipment()` to Supabase syntax

- [ ] **3.3** Rewrite `src/lib/db/queries.ts` - Workout queries
  - Convert `getWorkoutsByUserId()` to Supabase syntax
  - Convert `getWorkoutById()` to Supabase syntax
  - Convert `createWorkout()` to Supabase syntax
  - Convert `updateWorkout()` to Supabase syntax
  - Convert `deleteWorkout()` to Supabase syntax
  - Convert `getRecentWorkouts()` to Supabase syntax

- [ ] **3.4** Rewrite `src/lib/db/queries.ts` - Workout history queries
  - Convert `getWorkoutHistoryByUserId()` to Supabase syntax
  - Convert `getWorkoutHistoryById()` to Supabase syntax
  - Convert `createWorkoutHistory()` to Supabase syntax
  - Convert `getCompletedWorkoutsCount()` to Supabase syntax
  - Convert `getTotalWorkoutTime()` to Supabase syntax
  - Convert `getWorkoutStreak()` to Supabase syntax
  - Convert `getRecentHistory()` to Supabase syntax
  - Convert `deleteWorkoutHistory()` to Supabase syntax

- [ ] **3.5** Rewrite `src/lib/db/queries.ts` - User preferences queries
  - Convert `getUserPreferences()` to Supabase syntax
  - Convert `createUserPreferences()` to Supabase syntax
  - Convert `updateUserPreferences()` to Supabase syntax
  - Convert `getOrCreateUserPreferences()` to Supabase syntax

- [ ] **3.6** Rewrite `src/lib/db/queries.ts` - Statistics queries
  - Convert `getUserStats()` to Supabase syntax (may need no changes)

### Phase 4: Seeding

- [ ] **4.1** Rewrite `src/lib/db/seed.ts`
  - Update imports to use Supabase client
  - Convert insert logic to Supabase syntax
  - Test with: `npm run db:seed`
  - Consider creating a Supabase migration for seed data instead

### Phase 5: Documentation

- [ ] **5.1** Rewrite `src/lib/db/README.md`
  - Remove all Drizzle references
  - Document Supabase workflow
  - Update commands section (remove `db:generate`, `db:studio`)
  - Add Supabase-specific commands and best practices

- [ ] **5.2** Update OpenSpec documentation
  - `openspec/project.md` - Update database architecture section
  - `openspec/changes/build-personal-trainer-mvp/tasks.md` - Remove Drizzle references
  - `openspec/changes/build-personal-trainer-mvp/design.md` - Update architecture
  - `openspec/changes/build-personal-trainer-mvp/proposal.md` - Update tech stack

### Phase 6: Testing & Cleanup

- [ ] **6.1** Write tests for migrated query functions
  - See `docs/TESTING.md` for test structure
  - Create `src/lib/db/queries.test.ts`
  - Test all CRUD operations
  - Test RLS policies

- [ ] **6.2** Verify all database operations work
  - Test authentication flows
  - Test creating/reading/updating/deleting records
  - Test user isolation (RLS)

- [ ] **6.3** Update `package.json` scripts
  - Remove any Drizzle-specific scripts
  - Ensure all `db:*` scripts use Supabase CLI

- [ ] **6.4** Clean up node_modules
  - Run `npm prune` to remove unused packages
  - Verify no Drizzle packages remain

- [ ] **6.5** Final verification
  - Search codebase for any remaining "drizzle" references
  - Run: `npm run build` to ensure no TypeScript errors
  - Run: `npm run test` to ensure all tests pass

## Key Syntax Differences

### Drizzle → Supabase Cheat Sheet

**Select:**
```typescript
// Drizzle
await db.select().from(users).where(eq(users.id, userId))

// Supabase
await supabase.from('users').select('*').eq('id', userId).single()
```

**Insert:**
```typescript
// Drizzle
await db.insert(users).values(userData).returning()

// Supabase
await supabase.from('users').insert(userData).select().single()
```

**Update:**
```typescript
// Drizzle
await db.update(users).set(userData).where(eq(users.id, userId)).returning()

// Supabase
await supabase.from('users').update(userData).eq('id', userId).select().single()
```

**Delete:**
```typescript
// Drizzle
await db.delete(users).where(eq(users.id, userId))

// Supabase
await supabase.from('users').delete().eq('id', userId)
```

**Complex filters:**
```typescript
// Drizzle
await db.select()
  .from(exercises)
  .where(and(
    eq(exercises.difficulty, 'beginner'),
    ilike(exercises.name, '%push%')
  ))

// Supabase
await supabase.from('exercises')
  .select('*')
  .eq('difficulty', 'beginner')
  .ilike('name', '%push%')
```

**Ordering:**
```typescript
// Drizzle
await db.select().from(workouts).orderBy(desc(workouts.createdAt))

// Supabase
await supabase.from('workouts').select('*').order('created_at', { ascending: false })
```

## Notes

- Ensure `src/lib/supabase/` client is properly configured before starting
- All queries should use the server-side Supabase client for RLS enforcement
- Consider creating helper functions for common patterns
- Test thoroughly - query syntax differences can cause subtle bugs
- Supabase uses snake_case column names while Drizzle may have used camelCase

## References

- Supabase JS Client docs: https://supabase.com/docs/reference/javascript
- Supabase Auth: https://supabase.com/docs/guides/auth
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

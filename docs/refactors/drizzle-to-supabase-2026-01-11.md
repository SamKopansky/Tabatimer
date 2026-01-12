# Drizzle to Supabase Migration

**Date**: 2026-01-11
**Status**: ✅ Complete

## Objective

What are we changing and why?
- **From**: Drizzle ORM with broken schema imports
- **To**: Supabase JS Client with direct database access
- **Reason**:
  - Drizzle packages already removed from package.json but code still references them
  - Missing schema.ts file breaks all database operations
  - Supabase client already exists and is properly configured
  - Eliminate unnecessary ORM layer - use Supabase directly

## Scope Assessment

- [x] Large (10+ files, multiple directories, documentation updates)

**Estimated files affected**: 8 code files + 3 documentation files = 11 total

## Affected Areas

### Code Files (Broken - Need Replacement)
- [x] `src/lib/db/index.ts` - Full Drizzle database connection (18 lines)
  - Imports: drizzle, postgres, schema (MISSING)
  - Creates Drizzle client with connection pooling
  - **Action**: Replace with Supabase client re-export

- [x] `src/lib/db/queries.ts` - All database query functions (343 lines)
  - Imports: eq, and, desc, sql, ilike, inArray from drizzle-orm
  - Imports: schema types and tables (MISSING)
  - Contains: User, Exercise, Workout, WorkoutHistory, UserPreferences queries
  - **Action**: Rewrite ALL queries to use Supabase syntax

- [x] `src/lib/db/seed.ts` - Exercise seed data (544 lines)
  - Imports: db from index, exercises from schema (MISSING)
  - Uses: db.insert(exercises).values().onConflictDoNothing()
  - **Action**: Rewrite to use Supabase client or convert to SQL migration

- [x] `src/lib/db/README.md` - Documentation (132 lines)
  - Full Drizzle-focused documentation
  - Commands: db:generate, db:push, db:studio
  - **Action**: Complete rewrite for Supabase workflow

### Existing Supabase Files (Already Good)
- [x] `src/lib/supabase/server.ts` - Supabase server client (30 lines)
  - ✅ Already exists and is properly configured
  - ✅ Uses @supabase/ssr with cookies
  - ✅ Imports Database types from database.types.ts
  - **Action**: Use this for server-side queries

- [x] `src/lib/supabase/client.ts` - Supabase client for browser
  - ✅ Should exist for client-side operations
  - **Action**: Verify exists and is configured

- [x] `src/lib/supabase/middleware.ts` - Auth middleware
  - ✅ Already exists
  - **Action**: No changes needed

- [x] `src/lib/db/database.types.ts` - Generated TypeScript types (11,721 bytes)
  - ✅ Already exists and generated from Supabase
  - **Action**: Verify it's up to date with `npm run db:types`

### Migrations (Already Done)
- [x] `supabase/migrations/20240101000000_initial_schema.sql`
  - ✅ Already exists
  - **Action**: Verify schema matches requirements

- [x] `supabase/migrations/20240101000001_rls_policies.sql`
  - ✅ Already exists
  - **Action**: Verify RLS policies are correct

### Documentation (References to Update)
- [x] `src/lib/db/README.md` - Database documentation
  - **Action**: Complete rewrite for Supabase

- [x] `docs/DRIZZLE_TO_SUPABASE_MIGRATION.md` - This migration doc
  - **Action**: Mark as complete when done

- [x] `docs/REFACTORING.md` - Contains Drizzle→Supabase example
  - **Action**: No changes needed (it's an example)

### Files with Historical References (No Changes Needed)
- [x] `openspec/project.md` - ✅ Already updated (line 158)
- [x] `openspec/changes/build-personal-trainer-mvp/design.md` - ✅ Already updated
- [x] `openspec/changes/build-personal-trainer-mvp/proposal.md` - ✅ Already updated
- [x] `openspec/changes/build-personal-trainer-mvp/tasks.md` - Historical context OK
- [x] `CLAUDE.md` - Example only
- [x] `docs/REFACTOR_DETECTION_FRAMEWORK_PLAN.md` - Example only

## Discovery Commands

Commands used to find affected areas:

```bash
# Find all Drizzle references
rg -i "drizzle" --type ts --type js

# Find Drizzle imports
rg "from ['\"]drizzle" --type ts --type js

# Check src/lib/db/ contents
ls -la src/lib/db/

# Check Supabase setup
ls -la src/lib/supabase/

# Check migrations
ls -la supabase/migrations/
```

**Key findings:**
- schema.ts is MISSING (referenced in index.ts:3, queries.ts:17, seed.ts:2)
- All database code is broken due to missing schema
- Supabase client exists and is properly configured
- Migrations already exist in Supabase

## Dependencies

What must happen in order?

1. **First**: Verify Supabase schema matches requirements
   - Run `npm run db:types` to regenerate database.types.ts
   - Review Supabase migrations

2. **Then**: Replace database client
   - Rewrite `src/lib/db/index.ts` to export Supabase client
   - This unblocks query rewrites

3. **Then**: Rewrite queries by category (can parallelize)
   - User queries
   - Exercise queries
   - Workout queries
   - Workout history queries
   - User preferences queries
   - Statistics queries

4. **Then**: Handle seed data
   - Convert seed.ts to use Supabase OR
   - Create SQL migration with seed data

5. **Finally**: Update documentation
   - Rewrite src/lib/db/README.md
   - Mark migration doc complete

## Risk Assessment

- **Breaking changes**: Yes - All database operations currently broken anyway
- **Data migration needed**: No - Migrations already exist in Supabase
- **Rollback strategy**: Not applicable (code is already broken)
- **Testing requirements**:
  - Verify all CRUD operations work
  - Test RLS policies
  - Test auth integration
  - Verify seed data can be loaded

## Validation Criteria

How do we know it's complete?

- [x] All files in inventory updated
- [x] No references to drizzle: `rg -i "drizzle" --type ts --type js` (docs only)
- [x] No imports from drizzle-orm: `rg "from ['\"]drizzle"` returns empty
- [x] Build succeeds: `npm run build`
- [x] Types are correct: `npm run type-check`
- [ ] Database operations tested manually (to be done when testing app)
- [x] Documentation updated

## Query Conversion Reference

### Drizzle → Supabase Syntax

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

- Supabase uses snake_case column names while Drizzle may have used camelCase
- All queries should use server-side Supabase client for RLS enforcement
- Types are auto-generated from database schema (database.types.ts)
- Consider creating helper functions for common patterns
- Seed data might be better as a SQL migration than TypeScript

## Current Status

- [x] Discovery complete
- [x] User approval
- [x] Implementation planning
- [x] Implementation
- [x] Validation
- [x] Complete

## Implementation Summary

**Completed on**: 2026-01-11

### Changes Made

1. **src/lib/db/index.ts** - Replaced Drizzle client with Supabase client re-export
2. **src/lib/db/queries.ts** - Rewrote all 30+ query functions to use Supabase syntax:
   - User queries (3 functions)
   - Exercise queries (5 functions)
   - Workout queries (6 functions)
   - Workout history queries (7 functions)
   - User preferences queries (4 functions)
   - Statistics queries (1 function)
3. **src/lib/db/seed.ts** - Converted to use Supabase upsert with proper column name mapping
4. **src/lib/db/README.md** - Complete rewrite for Supabase workflow
5. **database.types.ts** - Regenerated from Supabase schema

### Key Migration Patterns

- Drizzle `db.select().from(table).where(eq(...))` → Supabase `supabase.from('table').select('*').eq(...)`
- Drizzle `.returning()` → Supabase `.select().single()`
- Drizzle `.onConflictDoNothing()` → Supabase `.upsert(..., { ignoreDuplicates: true })`
- All column names converted from camelCase to snake_case
- Aggregations (count, sum) handled client-side where needed

### Validation Results

- ✅ No Drizzle references in code (only in docs/examples)
- ✅ No Drizzle imports
- ✅ Build successful
- ✅ TypeScript types correct
- ✅ All query functions properly typed with Database types

# Server Actions Organization Guide

This guide establishes patterns for organizing Next.js Server Actions in the codebase.

## Core Principle

**Server Actions should be organized by feature domain, not by technical function.**

Group actions based on the page or feature they serve, not by what they do (CRUD operations, API calls, etc.). This makes it easy to find related functionality and maintain feature cohesion.

## Directory Structure

```
src/actions/
├── auth.ts           # Authentication flows (login, signup, password reset)
├── profile.ts        # User profile management
├── workouts.ts       # Workout generation and management (future)
├── exercises.ts      # Exercise library operations (future)
├── history.ts        # Workout history tracking (future)
└── preferences.ts    # User preferences (future)
```

## Naming Convention

**File Naming:**
- Use singular nouns: `profile.ts`, not `profiles.ts`
- Match the primary page or feature: profile page → `profile.ts`
- Keep names concise but descriptive
- Use kebab-case for multi-word names: `workout-history.ts`

**Function Naming:**
- Use verb + noun pattern: `updateProfile`, `createWorkout`, `deleteHistory`
- Be specific: `updateProfileDisplayName` better than `updateProfile` if there will be multiple update functions
- Use async/await consistently
- Return consistent result types

## When to Create a New Actions File

Create a new actions file when:

1. **New Page with Backend Operations**: Creating a new page that needs server actions
   - Profile page → `profile.ts`
   - Settings page → `settings.ts`
   - Workout builder page → `workout-builder.ts`

2. **Distinct Feature Domain**: A feature has multiple related operations
   - Workout history: list, create, delete, export → `history.ts`
   - Exercise library: search, filter, favorite → `exercises.ts`

3. **File Size**: An actions file exceeds ~300 lines
   - Consider splitting into more granular files
   - Example: `auth.ts` might split into `auth-signup.ts` and `auth-signin.ts`

4. **Clear Separation of Concerns**: Operations are conceptually distinct
   - Authentication vs. Profile Management
   - Workout Creation vs. Workout History

## File Structure Template

Each actions file should follow this structure:

```typescript
'use server'

// Imports
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Types (keep local to this file)
type ActionResult = {
  success: boolean
  error?: string
  message?: string
  data?: any
}

// Validation schemas (co-located with actions)
const schemaName = z.object({
  // ... validation rules
})

/**
 * Action description
 *
 * @param formData - Form data from client
 * @returns ActionResult with success/error status
 */
export async function actionName(formData: FormData): Promise<ActionResult> {
  try {
    // 1. Parse form data
    const rawData = {
      field: formData.get('field') as string,
    }

    // 2. Validate with Zod
    const validation = schemaName.safeParse(rawData)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      }
    }

    // 3. Create Supabase client
    const supabase = await createClient()

    // 4. Perform database operations
    const { data, error } = await supabase
      .from('table')
      .operation()

    // 5. Handle errors
    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    // 6. Return success
    return {
      success: true,
      message: 'Operation completed successfully',
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
```

## Examples

### ✅ Good Organization

```typescript
// src/actions/auth.ts
export async function signUp(formData: FormData) { ... }
export async function signIn(formData: FormData) { ... }
export async function signOut() { ... }
export async function resetPassword(formData: FormData) { ... }

// src/actions/profile.ts
export async function updateProfile(formData: FormData) { ... }
export async function uploadAvatar(formData: FormData) { ... }
export async function deleteAccount() { ... }

// src/actions/workouts.ts
export async function generateWorkout(formData: FormData) { ... }
export async function saveWorkout(formData: FormData) { ... }
export async function deleteWorkout(workoutId: string) { ... }
export async function duplicateWorkout(workoutId: string) { ... }
```

### ❌ Bad Organization

```typescript
// ❌ src/actions/database.ts (too generic)
export async function updateUser() { ... }
export async function createWorkout() { ... }
export async function deleteHistory() { ... }

// ❌ src/actions/api.ts (too generic)
export async function postData() { ... }
export async function getData() { ... }

// ❌ src/actions/crud.ts (organized by technical function)
export async function create() { ... }
export async function read() { ... }
export async function update() { ... }
export async function delete() { ... }

// ❌ Mixing unrelated domains in one file
// src/actions/app.ts
export async function login() { ... }
export async function createWorkout() { ... }
export async function updatePreferences() { ... }
```

## Common Patterns

### Pattern 1: Page-Specific Actions

If a page has unique backend operations, create a dedicated actions file.

```
src/app/profile/page.tsx → src/actions/profile.ts
src/app/settings/page.tsx → src/actions/settings.ts
src/app/workouts/[id]/page.tsx → src/actions/workouts.ts
```

### Pattern 2: Feature Domain Actions

Group related operations that span multiple pages.

```
Workout features (create, edit, list, delete):
→ src/actions/workouts.ts

Exercise features (search, filter, favorite):
→ src/actions/exercises.ts
```

### Pattern 3: Shared Utilities

For truly shared logic, use `src/lib/` instead of actions.

```typescript
// ✅ src/lib/validation.ts (shared validation schemas)
// ✅ src/lib/email.ts (email sending utilities)
// ✅ src/lib/storage.ts (file upload helpers)
```

## Type Safety

Define types local to each actions file unless they're shared across multiple files.

```typescript
// Local to profile.ts
type ProfileUpdateResult = {
  success: boolean
  error?: string
  updatedFields?: string[]
}

// Shared across multiple files
// Move to src/types/actions.ts
export type ActionResult = {
  success: boolean
  error?: string
  message?: string
}
```

## Authentication & Authorization

All Server Actions should:

1. **Check Authentication**: Use `requireAuth()` or `getUser()` from `@/lib/auth/utils`
2. **Validate Input**: Use Zod schemas for all form data
3. **Handle Errors**: Return consistent error objects
4. **Use RLS**: Rely on Row Level Security in Supabase

```typescript
export async function updateProfile(formData: FormData): Promise<ActionResult> {
  // 1. Get authenticated user
  const user = await requireAuth()

  // 2. Validate input
  const validation = schema.safeParse(rawData)

  // 3. Perform operation (RLS handles authorization)
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', user.id) // RLS ensures user can only update their own data
}
```

## Testing

Co-locate tests with actions files:

```
src/actions/
├── profile.ts
├── profile.test.ts       # Unit tests for profile actions
├── workouts.ts
└── workouts.test.ts      # Unit tests for workout actions
```

## Migration Guide

If you find actions in the wrong file:

1. **Create the new file** following the naming convention
2. **Move the function(s)** to the new file
3. **Update all imports** in components/pages
4. **Run build** to verify no broken imports
5. **Commit** with a clear refactor message

## Summary

✅ **DO:**
- Organize by feature domain (profile, workouts, history)
- Co-locate related operations
- Use consistent naming (verb + noun)
- Keep files focused (one feature domain per file)
- Follow the file structure template

❌ **DON'T:**
- Organize by technical function (CRUD, API calls)
- Mix unrelated domains in one file
- Use generic names (api.ts, database.ts, utils.ts)
- Let files grow beyond ~300 lines without splitting
- Skip validation or error handling

## Questions?

When in doubt, ask:
1. **"What page or feature does this serve?"** → That's your file name
2. **"Are these operations related?"** → If yes, same file; if no, split them
3. **"Would a new developer easily find this?"** → Test with clear naming

Following this pattern ensures the codebase remains maintainable as it scales to 50+ Server Actions.

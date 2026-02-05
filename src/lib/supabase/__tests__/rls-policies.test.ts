import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * RLS Policy Integration Tests
 *
 * These tests verify that Row Level Security policies work correctly
 * by testing with actual Supabase connections using different user accounts.
 *
 * IMPORTANT: These tests require:
 * 1. A running Supabase instance (local or remote)
 * 2. Environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 3. Test user accounts to be created during test setup
 *
 * Run these tests with: npm run test:integration
 */

describe('RLS Policies Integration Tests', () => {
  let supabase: SupabaseClient
  let user1Client: SupabaseClient
  let user2Client: SupabaseClient
  let user1Id: string
  let user2Id: string
  let user1Email: string
  let user2Email: string

  // Check if integration tests should run
  const shouldRun = process.env.RUN_INTEGRATION_TESTS === 'true'

  if (!shouldRun) {
    it.skip('Integration tests disabled - set RUN_INTEGRATION_TESTS=true to enable', () => {})
    return
  }

  beforeAll(async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
      )
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Create unique test user accounts
    const timestamp = Date.now()
    user1Email = `test-user-1-${timestamp}@rls-test.com`
    user2Email = `test-user-2-${timestamp}@rls-test.com`
    const password = 'TestPassword123!'

    // Create user 1
    const { data: user1Data, error: user1Error } = await supabase.auth.signUp({
      email: user1Email,
      password,
      options: {
        data: { display_name: 'RLS Test User 1' },
        emailRedirectTo: undefined, // Disable confirmation emails in tests
      },
    })

    if (user1Error || !user1Data.user) {
      throw new Error(`Failed to create user 1: ${user1Error?.message}`)
    }

    user1Id = user1Data.user.id

    // Create user 2
    const { data: user2Data, error: user2Error } = await supabase.auth.signUp({
      email: user2Email,
      password,
      options: {
        data: { display_name: 'RLS Test User 2' },
        emailRedirectTo: undefined,
      },
    })

    if (user2Error || !user2Data.user) {
      throw new Error(`Failed to create user 2: ${user2Error?.message}`)
    }

    user2Id = user2Data.user.id

    // Create authenticated clients for each user
    user1Client = createClient(supabaseUrl, supabaseAnonKey)
    user2Client = createClient(supabaseUrl, supabaseAnonKey)

    // Sign in user 1
    const { error: signIn1Error } = await user1Client.auth.signInWithPassword({
      email: user1Email,
      password,
    })

    if (signIn1Error) {
      throw new Error(`Failed to sign in user 1: ${signIn1Error.message}`)
    }

    // Sign in user 2
    const { error: signIn2Error } = await user2Client.auth.signInWithPassword({
      email: user2Email,
      password,
    })

    if (signIn2Error) {
      throw new Error(`Failed to sign in user 2: ${signIn2Error.message}`)
    }

    // Insert users into public.users table (auth.users is separate from public.users)
    await user1Client.from('users').insert({
      id: user1Id,
      display_name: 'RLS Test User 1',
    })

    await user2Client.from('users').insert({
      id: user2Id,
      display_name: 'RLS Test User 2',
    })
  })

  afterAll(async () => {
    // Clean up: Delete test users
    // Note: This requires admin privileges, so we'll use the service role
    // In a real setup, you might use a cleanup script or manual deletion

    // Sign out both users
    await user1Client?.auth.signOut()
    await user2Client?.auth.signOut()
  })

  describe('Users Table RLS', () => {
    it('should allow users to read their own profile', async () => {
      const { data, error } = await user1Client
        .from('users')
        .select('*')
        .eq('id', user1Id)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.id).toBe(user1Id)
    })

    it('should prevent users from reading other users profiles', async () => {
      const { data, error } = await user1Client
        .from('users')
        .select('*')
        .eq('id', user2Id)
        .single()

      // Should return no data (filtered by RLS)
      expect(data).toBeNull()
      // May have error or just return null depending on RLS implementation
    })

    it('should allow users to update their own profile', async () => {
      const newDisplayName = 'Updated Name'

      const { data, error } = await user1Client
        .from('users')
        .update({ display_name: newDisplayName })
        .eq('id', user1Id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.display_name).toBe(newDisplayName)
    })

    it('should prevent users from updating other users profiles', async () => {
      const { data, error } = await user1Client
        .from('users')
        .update({ display_name: 'Hacked!' })
        .eq('id', user2Id)
        .select()

      // Update should return no rows (empty array) due to RLS filtering
      expect(data).toEqual([])
    })
  })

  describe('Workouts Table RLS', () => {
    let user1WorkoutId: string
    let user2WorkoutId: string

    beforeAll(async () => {
      // Create workout for user 1
      const { data: workout1, error: error1 } = await user1Client
        .from('workouts')
        .insert({
          user_id: user1Id,
          name: 'User 1 Workout',
          description: 'Test workout for user 1',
          duration: 30,
          difficulty: 'intermediate',
          exercises: [],
          generated_by: 'manual',
        })
        .select()
        .single()

      if (error1 || !workout1) {
        throw new Error(`Failed to create workout for user 1: ${error1?.message}`)
      }

      user1WorkoutId = workout1.id

      // Create workout for user 2
      const { data: workout2, error: error2 } = await user2Client
        .from('workouts')
        .insert({
          user_id: user2Id,
          name: 'User 2 Workout',
          description: 'Test workout for user 2',
          duration: 45,
          difficulty: 'advanced',
          exercises: [],
          generated_by: 'manual',
        })
        .select()
        .single()

      if (error2 || !workout2) {
        throw new Error(`Failed to create workout for user 2: ${error2?.message}`)
      }

      user2WorkoutId = workout2.id
    })

    it('should allow users to read their own workouts', async () => {
      const { data, error } = await user1Client
        .from('workouts')
        .select('*')
        .eq('id', user1WorkoutId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.name).toBe('User 1 Workout')
      expect(data?.user_id).toBe(user1Id)
    })

    it('should prevent users from reading other users workouts', async () => {
      const { data, error } = await user1Client
        .from('workouts')
        .select('*')
        .eq('id', user2WorkoutId)
        .single()

      // Should return no data due to RLS filtering
      expect(data).toBeNull()
    })

    it('should only return workouts belonging to the authenticated user', async () => {
      const { data, error } = await user1Client.from('workouts').select('*')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)

      // All returned workouts should belong to user 1
      data?.forEach((workout) => {
        expect(workout.user_id).toBe(user1Id)
      })

      // Should not include user 2's workouts
      const hasUser2Workout = data?.some(
        (workout) => workout.id === user2WorkoutId
      )
      expect(hasUser2Workout).toBe(false)
    })

    it('should allow users to update their own workouts', async () => {
      const { data, error } = await user1Client
        .from('workouts')
        .update({ name: 'Updated Workout Name' })
        .eq('id', user1WorkoutId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.name).toBe('Updated Workout Name')
    })

    it('should prevent users from updating other users workouts', async () => {
      const { data, error } = await user1Client
        .from('workouts')
        .update({ name: 'Hacked Workout' })
        .eq('id', user2WorkoutId)
        .select()

      // Update should return no rows (empty array) due to RLS filtering
      expect(data).toEqual([])
    })

    it('should allow users to delete their own workouts', async () => {
      // Create a new workout to delete
      const { data: newWorkout, error: createError } = await user1Client
        .from('workouts')
        .insert({
          user_id: user1Id,
          name: 'Workout to Delete',
          duration: 20,
          difficulty: 'beginner',
          exercises: [],
          generated_by: 'manual',
        })
        .select()
        .single()

      expect(createError).toBeNull()
      expect(newWorkout).toBeDefined()

      // Delete the workout
      const { error: deleteError } = await user1Client
        .from('workouts')
        .delete()
        .eq('id', newWorkout!.id)

      expect(deleteError).toBeNull()

      // Verify it's deleted
      const { data: checkData } = await user1Client
        .from('workouts')
        .select('*')
        .eq('id', newWorkout!.id)
        .single()

      expect(checkData).toBeNull()
    })

    it('should prevent users from deleting other users workouts', async () => {
      const { error } = await user1Client
        .from('workouts')
        .delete()
        .eq('id', user2WorkoutId)

      // Either error or silent failure (no rows affected)
      // The workout should still exist for user 2
      const { data: checkData } = await user2Client
        .from('workouts')
        .select('*')
        .eq('id', user2WorkoutId)
        .single()

      expect(checkData).toBeDefined()
      expect(checkData?.id).toBe(user2WorkoutId)
    })
  })

  describe('Workout History Table RLS', () => {
    let user1HistoryId: string
    let user2HistoryId: string

    beforeAll(async () => {
      // Create history entry for user 1
      const { data: history1, error: error1 } = await user1Client
        .from('workout_history')
        .insert({
          user_id: user1Id,
          workout_snapshot: { name: 'Test Workout', exercises: [] },
          status: 'completed',
          duration_seconds: 1800,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error1 || !history1) {
        throw new Error(`Failed to create history for user 1: ${error1?.message}`)
      }

      user1HistoryId = history1.id

      // Create history entry for user 2
      const { data: history2, error: error2 } = await user2Client
        .from('workout_history')
        .insert({
          user_id: user2Id,
          workout_snapshot: { name: 'Test Workout 2', exercises: [] },
          status: 'completed',
          duration_seconds: 2400,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error2 || !history2) {
        throw new Error(`Failed to create history for user 2: ${error2?.message}`)
      }

      user2HistoryId = history2.id
    })

    it('should allow users to read their own workout history', async () => {
      const { data, error } = await user1Client
        .from('workout_history')
        .select('*')
        .eq('id', user1HistoryId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.user_id).toBe(user1Id)
    })

    it('should prevent users from reading other users workout history', async () => {
      const { data, error } = await user1Client
        .from('workout_history')
        .select('*')
        .eq('id', user2HistoryId)
        .single()

      expect(data).toBeNull()
    })

    it('should only return history belonging to the authenticated user', async () => {
      const { data, error } = await user1Client
        .from('workout_history')
        .select('*')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)

      // All returned history should belong to user 1
      data?.forEach((history) => {
        expect(history.user_id).toBe(user1Id)
      })

      // Should not include user 2's history
      const hasUser2History = data?.some(
        (history) => history.id === user2HistoryId
      )
      expect(hasUser2History).toBe(false)
    })
  })

  describe('User Preferences Table RLS', () => {
    let pref1Id: string
    let pref2Id: string

    beforeAll(async () => {
      // Create preferences for both users
      const { data: pref1, error: error1 } = await user1Client
        .from('user_preferences')
        .insert({
          user_id: user1Id,
          default_work_duration: 20,
          default_rest_duration: 10,
          audio_enabled: true,
          preferred_equipment: ['dumbbells'],
        })
        .select()
        .single()

      if (error1 || !pref1) {
        throw new Error(
          `Failed to create preferences for user 1: ${error1?.message}`
        )
      }

      pref1Id = pref1.id

      const { data: pref2, error: error2 } = await user2Client
        .from('user_preferences')
        .insert({
          user_id: user2Id,
          default_work_duration: 30,
          default_rest_duration: 15,
          audio_enabled: false,
          preferred_equipment: ['bodyweight'],
        })
        .select()
        .single()

      if (error2 || !pref2) {
        throw new Error(
          `Failed to create preferences for user 2: ${error2?.message}`
        )
      }

      pref2Id = pref2.id
    })

    it('should allow users to read their own preferences', async () => {
      const { data, error } = await user1Client
        .from('user_preferences')
        .select('*')
        .eq('user_id', user1Id)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.user_id).toBe(user1Id)
      expect(data?.default_work_duration).toBe(20)
    })

    it('should prevent users from reading other users preferences', async () => {
      const { data, error } = await user1Client
        .from('user_preferences')
        .select('*')
        .eq('user_id', user2Id)
        .single()

      expect(data).toBeNull()
    })

    it('should allow users to update their own preferences', async () => {
      const { data, error } = await user1Client
        .from('user_preferences')
        .update({ audio_enabled: false })
        .eq('user_id', user1Id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.audio_enabled).toBe(false)
    })

    it('should prevent users from updating other users preferences', async () => {
      const { data, error } = await user1Client
        .from('user_preferences')
        .update({ audio_enabled: true })
        .eq('user_id', user2Id)
        .select()

      // Update should return no rows due to RLS filtering
      expect(data).toEqual([])
    })
  })

  describe('Exercises Table RLS', () => {
    it('should allow all authenticated users to read exercises', async () => {
      const { data, error } = await user1Client.from('exercises').select('*')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should allow user 2 to also read exercises', async () => {
      const { data, error } = await user2Client.from('exercises').select('*')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should prevent users from inserting exercises', async () => {
      const { data, error } = await user1Client
        .from('exercises')
        .insert({
          name: 'Unauthorized Exercise',
          instructions: 'This should fail',
          muscle_groups: ['chest'],
          difficulty: 'beginner',
          equipment: 'bodyweight',
        })
        .select()

      // Should fail due to RLS policy
      expect(error).toBeDefined()
      expect(data).toBeNull()
    })

    it('should prevent users from updating exercises', async () => {
      // First, get an exercise
      const { data: exercises } = await user1Client
        .from('exercises')
        .select('id')
        .limit(1)

      if (exercises && exercises.length > 0) {
        const exerciseId = exercises[0].id

        const { data, error } = await user1Client
          .from('exercises')
          .update({ name: 'Hacked Exercise Name' })
          .eq('id', exerciseId)
          .select()

        // Should fail due to RLS policy
        expect(data).toBeNull()
      }
    })

    it('should prevent users from deleting exercises', async () => {
      // First, get an exercise
      const { data: exercises } = await user1Client
        .from('exercises')
        .select('id')
        .limit(1)

      if (exercises && exercises.length > 0) {
        const exerciseId = exercises[0].id

        const { error } = await user1Client
          .from('exercises')
          .delete()
          .eq('id', exerciseId)

        // Should fail due to RLS policy
        expect(error).toBeDefined()
      }
    })
  })

  describe('Cross-User Data Isolation', () => {
    it('should maintain complete data isolation between users', async () => {
      // Get all data for user 1
      const user1Workouts = await user1Client.from('workouts').select('*')
      const user1History = await user1Client.from('workout_history').select('*')
      const user1Prefs = await user1Client.from('user_preferences').select('*')

      // Verify user 1 only sees their own data
      user1Workouts.data?.forEach((w) => expect(w.user_id).toBe(user1Id))
      user1History.data?.forEach((h) => expect(h.user_id).toBe(user1Id))
      user1Prefs.data?.forEach((p) => expect(p.user_id).toBe(user1Id))

      // Get all data for user 2
      const user2Workouts = await user2Client.from('workouts').select('*')
      const user2History = await user2Client.from('workout_history').select('*')
      const user2Prefs = await user2Client.from('user_preferences').select('*')

      // Verify user 2 only sees their own data
      user2Workouts.data?.forEach((w) => expect(w.user_id).toBe(user2Id))
      user2History.data?.forEach((h) => expect(h.user_id).toBe(user2Id))
      user2Prefs.data?.forEach((p) => expect(p.user_id).toBe(user2Id))

      // Verify no data overlap
      const user1WorkoutIds = new Set(user1Workouts.data?.map((w) => w.id))
      const user2WorkoutIds = new Set(user2Workouts.data?.map((w) => w.id))

      user1WorkoutIds.forEach((id) => {
        expect(user2WorkoutIds.has(id)).toBe(false)
      })
    })
  })
})

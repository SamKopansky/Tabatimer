/**
 * RLS Policy Test Script
 *
 * This script verifies that Row Level Security (RLS) policies are working correctly.
 * It tests that users can only access their own data and cannot access other users' data.
 *
 * Run with: npx tsx --env-file=.env scripts/test-rls-policies.ts
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/db/database.types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Create Supabase clients for two test users
const user1Client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
const user2Client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function logTest(name: string, passed: boolean, message: string) {
  results.push({ name, passed, message });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}: ${message}`);
}

async function setupTestUsers() {
  console.log('\n📋 Setting up test users...\n');

  // Create test user 1
  const { data: user1Data, error: user1Error } = await user1Client.auth.signUp({
    email: `test-user-1-${Date.now()}@example.com`,
    password: 'TestPassword123!',
  });

  if (user1Error || !user1Data.user) {
    console.error('❌ Failed to create test user 1:', user1Error?.message);
    process.exit(1);
  }

  // Create test user 2
  const { data: user2Data, error: user2Error } = await user2Client.auth.signUp({
    email: `test-user-2-${Date.now()}@example.com`,
    password: 'TestPassword123!',
  });

  if (user2Error || !user2Data.user) {
    console.error('❌ Failed to create test user 2:', user2Error?.message);
    process.exit(1);
  }

  console.log(`✅ Created test user 1: ${user1Data.user.id}`);
  console.log(`✅ Created test user 2: ${user2Data.user.id}`);

  // Insert user records into the users table
  await user1Client.from('users').insert({ id: user1Data.user.id });
  await user2Client.from('users').insert({ id: user2Data.user.id });

  return {
    user1: user1Data.user,
    user2: user2Data.user,
  };
}

async function testUsersTable(user1Id: string, user2Id: string) {
  console.log('\n🧪 Testing Users Table RLS Policies...\n');

  // Test 1: User 1 can read their own profile
  const { data: user1Profile, error: user1ReadError } = await user1Client
    .from('users')
    .select('*')
    .eq('id', user1Id)
    .maybeSingle();

  logTest(
    'Users - User can read own profile',
    !user1ReadError && user1Profile?.id === user1Id,
    user1ReadError ? user1ReadError.message : 'Successfully read own profile'
  );

  // Test 2: User 1 cannot read User 2's profile
  const { data: user2ProfileFromUser1, error: user2ReadError } = await user1Client
    .from('users')
    .select('*')
    .eq('id', user2Id)
    .maybeSingle();

  logTest(
    'Users - User cannot read other user profile',
    user2ProfileFromUser1 === null,
    user2ProfileFromUser1 ? 'SECURITY ISSUE: Read other user profile!' : 'Correctly blocked access'
  );

  // Test 3: User 1 can update their own profile
  const { error: user1UpdateError } = await user1Client
    .from('users')
    .update({ display_name: 'Test User 1' })
    .eq('id', user1Id);

  logTest(
    'Users - User can update own profile',
    !user1UpdateError,
    user1UpdateError ? user1UpdateError.message : 'Successfully updated own profile'
  );

  // Test 4: User 1 cannot update User 2's profile
  const { data: user2UpdateData, error: user2UpdateError } = await user1Client
    .from('users')
    .update({ display_name: 'Hacked!' })
    .eq('id', user2Id)
    .select();

  // RLS will silently block the update (no error, but no rows affected)
  const wasBlocked = user2UpdateData === null || user2UpdateData.length === 0;

  logTest(
    'Users - User cannot update other user profile',
    wasBlocked,
    wasBlocked ? 'Correctly blocked update' : 'SECURITY ISSUE: Updated other user profile!'
  );
}

async function testExercisesTable() {
  console.log('\n🧪 Testing Exercises Table RLS Policies...\n');

  // Test 1: User 1 can read exercises (public read)
  const { data: exercises, error: readError } = await user1Client
    .from('exercises')
    .select('*')
    .limit(5);

  logTest(
    'Exercises - User can read exercises',
    !readError && Array.isArray(exercises),
    readError ? readError.message : `Successfully read ${exercises?.length || 0} exercises`
  );

  // Test 2: User 1 cannot insert exercises (should be admin-only or via service key)
  const { error: insertError } = await user1Client.from('exercises').insert({
    name: 'Unauthorized Exercise',
    instructions: 'This should not be inserted',
    muscle_groups: ['legs'],
    difficulty: 'beginner',
    equipment: 'bodyweight',
  });

  logTest(
    'Exercises - User cannot insert exercises',
    insertError !== null,
    insertError ? 'Correctly blocked insert' : 'SECURITY ISSUE: Inserted exercise!'
  );
}

async function testWorkoutsTable(user1Id: string, user2Id: string) {
  console.log('\n🧪 Testing Workouts Table RLS Policies...\n');

  // Test 1: User 1 can insert their own workout
  const { data: user1Workout, error: insertError } = await user1Client
    .from('workouts')
    .insert({
      user_id: user1Id,
      name: 'User 1 Workout',
      description: 'Test workout',
      duration: 30,
      difficulty: 'intermediate',
      exercises: [{ name: 'Push-ups', sets: 3, reps: 10 }],
      generated_by: 'manual',
    })
    .select()
    .single();

  logTest(
    'Workouts - User can insert own workout',
    !insertError && user1Workout?.user_id === user1Id,
    insertError ? insertError.message : 'Successfully inserted own workout'
  );

  if (!user1Workout) return;

  // Test 2: User 1 can read their own workout
  const { data: readOwnWorkout, error: readOwnError } = await user1Client
    .from('workouts')
    .select('*')
    .eq('id', user1Workout.id)
    .single();

  logTest(
    'Workouts - User can read own workout',
    !readOwnError && readOwnWorkout?.id === user1Workout.id,
    readOwnError ? readOwnError.message : 'Successfully read own workout'
  );

  // Test 3: User 2 cannot read User 1's workout
  const { data: readOtherWorkout, error: readOtherError } = await user2Client
    .from('workouts')
    .select('*')
    .eq('id', user1Workout.id)
    .single();

  logTest(
    'Workouts - User cannot read other user workout',
    readOtherError !== null || readOtherWorkout === null,
    readOtherWorkout ? 'SECURITY ISSUE: Read other user workout!' : 'Correctly blocked access'
  );

  // Test 4: User 1 can update their own workout
  const { error: updateOwnError } = await user1Client
    .from('workouts')
    .update({ name: 'Updated Workout' })
    .eq('id', user1Workout.id);

  logTest(
    'Workouts - User can update own workout',
    !updateOwnError,
    updateOwnError ? updateOwnError.message : 'Successfully updated own workout'
  );

  // Test 5: User 2 cannot update User 1's workout
  const { data: updateOtherData, error: updateOtherError } = await user2Client
    .from('workouts')
    .update({ name: 'Hacked Workout!' })
    .eq('id', user1Workout.id)
    .select();

  const updateBlocked = updateOtherData === null || updateOtherData.length === 0;

  logTest(
    'Workouts - User cannot update other user workout',
    updateBlocked,
    updateBlocked ? 'Correctly blocked update' : 'SECURITY ISSUE: Updated other user workout!'
  );

  // Test 6: User 1 can delete their own workout
  const { error: deleteOwnError } = await user1Client
    .from('workouts')
    .delete()
    .eq('id', user1Workout.id);

  logTest(
    'Workouts - User can delete own workout',
    !deleteOwnError,
    deleteOwnError ? deleteOwnError.message : 'Successfully deleted own workout'
  );

  // Test 7: User 1 cannot insert workout for User 2
  const { error: insertForOtherError } = await user1Client.from('workouts').insert({
    user_id: user2Id,
    name: 'Malicious Workout',
    description: 'Should not be inserted',
    duration: 30,
    difficulty: 'beginner',
    exercises: [],
    generated_by: 'manual',
  });

  logTest(
    'Workouts - User cannot insert workout for other user',
    insertForOtherError !== null,
    insertForOtherError ? 'Correctly blocked insert' : 'SECURITY ISSUE: Inserted workout for other user!'
  );
}

async function testWorkoutHistoryTable(user1Id: string, user2Id: string) {
  console.log('\n🧪 Testing Workout History Table RLS Policies...\n');

  // Test 1: User 1 can insert their own workout history
  const { data: user1History, error: insertError } = await user1Client
    .from('workout_history')
    .insert({
      user_id: user1Id,
      workout_snapshot: { name: 'Test Workout', exercises: [] },
      status: 'completed',
      duration_seconds: 1800,
    })
    .select()
    .single();

  logTest(
    'Workout History - User can insert own history',
    !insertError && user1History?.user_id === user1Id,
    insertError ? insertError.message : 'Successfully inserted own history'
  );

  if (!user1History) return;

  // Test 2: User 1 can read their own history
  const { data: readOwnHistory, error: readOwnError } = await user1Client
    .from('workout_history')
    .select('*')
    .eq('id', user1History.id)
    .single();

  logTest(
    'Workout History - User can read own history',
    !readOwnError && readOwnHistory?.id === user1History.id,
    readOwnError ? readOwnError.message : 'Successfully read own history'
  );

  // Test 3: User 2 cannot read User 1's history
  const { data: readOtherHistory, error: readOtherError } = await user2Client
    .from('workout_history')
    .select('*')
    .eq('id', user1History.id)
    .single();

  logTest(
    'Workout History - User cannot read other user history',
    readOtherError !== null || readOtherHistory === null,
    readOtherHistory ? 'SECURITY ISSUE: Read other user history!' : 'Correctly blocked access'
  );

  // Test 4: User 1 can update their own history
  const { error: updateOwnError } = await user1Client
    .from('workout_history')
    .update({ notes: 'Great workout!' })
    .eq('id', user1History.id);

  logTest(
    'Workout History - User can update own history',
    !updateOwnError,
    updateOwnError ? updateOwnError.message : 'Successfully updated own history'
  );

  // Test 5: User 2 cannot update User 1's history
  const { data: updateOtherData, error: updateOtherError } = await user2Client
    .from('workout_history')
    .update({ notes: 'Hacked!' })
    .eq('id', user1History.id)
    .select();

  const updateBlocked = updateOtherData === null || updateOtherData.length === 0;

  logTest(
    'Workout History - User cannot update other user history',
    updateBlocked,
    updateBlocked ? 'Correctly blocked update' : 'SECURITY ISSUE: Updated other user history!'
  );

  // Test 6: User 1 cannot insert history for User 2
  const { error: insertForOtherError } = await user1Client
    .from('workout_history')
    .insert({
      user_id: user2Id,
      workout_snapshot: { name: 'Malicious', exercises: [] },
      status: 'completed',
      duration_seconds: 100,
    });

  logTest(
    'Workout History - User cannot insert history for other user',
    insertForOtherError !== null,
    insertForOtherError ? 'Correctly blocked insert' : 'SECURITY ISSUE: Inserted history for other user!'
  );
}

async function testUserPreferencesTable(user1Id: string, user2Id: string) {
  console.log('\n🧪 Testing User Preferences Table RLS Policies...\n');

  // Test 1: User 1 can insert their own preferences
  const { data: user1Prefs, error: insertError } = await user1Client
    .from('user_preferences')
    .insert({
      user_id: user1Id,
      default_work_duration: 30,
      default_rest_duration: 15,
      audio_enabled: true,
      preferred_equipment: ['dumbbells', 'bodyweight'],
    })
    .select()
    .single();

  logTest(
    'User Preferences - User can insert own preferences',
    !insertError && user1Prefs?.user_id === user1Id,
    insertError ? insertError.message : 'Successfully inserted own preferences'
  );

  if (!user1Prefs) return;

  // Test 2: User 1 can read their own preferences
  const { data: readOwnPrefs, error: readOwnError } = await user1Client
    .from('user_preferences')
    .select('*')
    .eq('user_id', user1Id)
    .single();

  logTest(
    'User Preferences - User can read own preferences',
    !readOwnError && readOwnPrefs?.user_id === user1Id,
    readOwnError ? readOwnError.message : 'Successfully read own preferences'
  );

  // Test 3: User 2 cannot read User 1's preferences
  const { data: readOtherPrefs, error: readOtherError } = await user2Client
    .from('user_preferences')
    .select('*')
    .eq('user_id', user1Id)
    .single();

  logTest(
    'User Preferences - User cannot read other user preferences',
    readOtherError !== null || readOtherPrefs === null,
    readOtherPrefs ? 'SECURITY ISSUE: Read other user preferences!' : 'Correctly blocked access'
  );

  // Test 4: User 1 can update their own preferences
  const { error: updateOwnError } = await user1Client
    .from('user_preferences')
    .update({ audio_enabled: false })
    .eq('user_id', user1Id);

  logTest(
    'User Preferences - User can update own preferences',
    !updateOwnError,
    updateOwnError ? updateOwnError.message : 'Successfully updated own preferences'
  );

  // Test 5: User 2 cannot update User 1's preferences
  const { data: updateOtherData, error: updateOtherError } = await user2Client
    .from('user_preferences')
    .update({ audio_enabled: false })
    .eq('user_id', user1Id)
    .select();

  const updateBlocked = updateOtherData === null || updateOtherData.length === 0;

  logTest(
    'User Preferences - User cannot update other user preferences',
    updateBlocked,
    updateBlocked ? 'Correctly blocked update' : 'SECURITY ISSUE: Updated other user preferences!'
  );

  // Test 6: User 1 cannot insert preferences for User 2
  const { error: insertForOtherError } = await user1Client
    .from('user_preferences')
    .insert({
      user_id: user2Id,
      default_work_duration: 60,
      default_rest_duration: 30,
    });

  logTest(
    'User Preferences - User cannot insert preferences for other user',
    insertForOtherError !== null,
    insertForOtherError ? 'Correctly blocked insert' : 'SECURITY ISSUE: Inserted preferences for other user!'
  );
}

async function cleanup(user1Id: string, user2Id: string) {
  console.log('\n🧹 Cleaning up test data...\n');

  // Note: In production, you'd want to use the service role key to clean up
  // For now, we'll let the CASCADE delete handle cleanup when users are deleted
  await user1Client.auth.signOut();
  await user2Client.auth.signOut();

  console.log('✅ Cleanup completed');
}

async function runTests() {
  console.log('🔒 RLS Policy Test Suite');
  console.log('========================\n');

  try {
    const { user1, user2 } = await setupTestUsers();

    await testUsersTable(user1.id, user2.id);
    await testExercisesTable();
    await testWorkoutsTable(user1.id, user2.id);
    await testWorkoutHistoryTable(user1.id, user2.id);
    await testUserPreferencesTable(user1.id, user2.id);

    await cleanup(user1.id, user2.id);

    // Summary
    console.log('\n📊 Test Summary');
    console.log('===============\n');

    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;
    const total = results.length;

    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

    if (failed > 0) {
      console.log('❌ FAILED TESTS:');
      results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`   - ${r.name}: ${r.message}`);
        });
      console.log();
      process.exit(1);
    } else {
      console.log('✅ All RLS policies are working correctly!\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Test suite failed with error:');
    console.error(error);
    process.exit(1);
  }
}

runTests();

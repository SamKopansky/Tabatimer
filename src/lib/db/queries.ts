import { createClient } from './index'
import type { Database } from './database.types'

// Type aliases for convenience
type User = Database['public']['Tables']['users']['Row']
type NewUser = Database['public']['Tables']['users']['Insert']
type Exercise = Database['public']['Tables']['exercises']['Row']
type NewExercise = Database['public']['Tables']['exercises']['Insert']
type Workout = Database['public']['Tables']['workouts']['Row']
type NewWorkout = Database['public']['Tables']['workouts']['Insert']
type WorkoutHistory = Database['public']['Tables']['workout_history']['Row']
type NewWorkoutHistory = Database['public']['Tables']['workout_history']['Insert']
type UserPreferences = Database['public']['Tables']['user_preferences']['Row']
type NewUserPreferences = Database['public']['Tables']['user_preferences']['Insert']

// ============================================
// USER QUERIES
// ============================================

export async function getUserById(userId: string): Promise<User | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createUser(userData: NewUser): Promise<User> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUser(userId: string, userData: Partial<NewUser>): Promise<User> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .update({ ...userData, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================
// EXERCISE QUERIES
// ============================================

export async function getAllExercises(): Promise<Exercise[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getExerciseById(exerciseId: string): Promise<Exercise | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', exerciseId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function searchExercises(searchTerm: string): Promise<Exercise[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

export async function filterExercises(filters: {
  muscleGroups?: string[]
  difficulty?: Database['public']['Enums']['difficulty']
  equipment?: Database['public']['Enums']['equipment']
}): Promise<Exercise[]> {
  const supabase = await createClient()
  let query = supabase.from('exercises').select('*')

  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty)
  }

  if (filters.equipment) {
    query = query.eq('equipment', filters.equipment)
  }

  if (filters.muscleGroups && filters.muscleGroups.length > 0) {
    // Filter exercises that have ANY of the specified muscle groups
    // Using overlaps operator for array contains
    query = query.overlaps('muscle_groups', filters.muscleGroups)
  }

  query = query.order('name', { ascending: true })

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getExercisesByEquipment(
  equipment: Database['public']['Enums']['equipment']
): Promise<Exercise[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('equipment', equipment)
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

// ============================================
// WORKOUT QUERIES
// ============================================

export async function getWorkoutsByUserId(userId: string): Promise<Workout[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getWorkoutById(workoutId: string): Promise<Workout | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', workoutId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createWorkout(workoutData: NewWorkout): Promise<Workout> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workouts')
    .insert(workoutData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateWorkout(
  workoutId: string,
  workoutData: Partial<NewWorkout>
): Promise<Workout> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workouts')
    .update(workoutData)
    .eq('id', workoutId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId)

  if (error) throw error
}

export async function getRecentWorkouts(userId: string, limit = 10): Promise<Workout[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// ============================================
// WORKOUT HISTORY QUERIES
// ============================================

export async function getWorkoutHistoryByUserId(userId: string): Promise<WorkoutHistory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_history')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getWorkoutHistoryById(historyId: string): Promise<WorkoutHistory | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_history')
    .select('*')
    .eq('id', historyId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createWorkoutHistory(historyData: NewWorkoutHistory): Promise<WorkoutHistory> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_history')
    .insert(historyData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getCompletedWorkoutsCount(userId: string): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('workout_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed')

  if (error) throw error
  return count || 0
}

export async function getTotalWorkoutTime(userId: string): Promise<number> {
  const supabase = await createClient()

  // Get all completed workouts and sum duration_seconds client-side
  // Supabase doesn't have built-in sum aggregation in the client
  const { data, error } = await supabase
    .from('workout_history')
    .select('duration_seconds')
    .eq('user_id', userId)
    .eq('status', 'completed')

  if (error) throw error

  if (!data || data.length === 0) return 0

  return data.reduce((sum, row) => sum + row.duration_seconds, 0)
}

export async function getWorkoutStreak(userId: string): Promise<number> {
  const supabase = await createClient()

  const { data: history, error } = await supabase
    .from('workout_history')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  if (error) throw error
  if (!history || history.length === 0) return 0

  let streak = 1
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastWorkoutDate = new Date(history[0].completed_at)
  lastWorkoutDate.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor(
    (today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // If last workout was more than 1 day ago, streak is broken
  if (daysDiff > 1) return 0

  for (let i = 1; i < history.length; i++) {
    const currentDate = new Date(history[i - 1].completed_at)
    const prevDate = new Date(history[i].completed_at)
    currentDate.setHours(0, 0, 0, 0)
    prevDate.setHours(0, 0, 0, 0)

    const diff = Math.floor(
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diff === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export async function getRecentHistory(userId: string, limit = 10): Promise<WorkoutHistory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_history')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function deleteWorkoutHistory(historyId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('workout_history')
    .delete()
    .eq('id', historyId)

  if (error) throw error
}

// ============================================
// USER PREFERENCES QUERIES
// ============================================

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createUserPreferences(prefsData: NewUserPreferences): Promise<UserPreferences> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_preferences')
    .insert(prefsData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUserPreferences(
  userId: string,
  prefsData: Partial<NewUserPreferences>
): Promise<UserPreferences> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('user_preferences')
    .update({ ...prefsData, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getOrCreateUserPreferences(userId: string): Promise<UserPreferences> {
  let prefs = await getUserPreferences(userId)

  if (!prefs) {
    prefs = await createUserPreferences({ user_id: userId })
  }

  return prefs
}

// ============================================
// STATISTICS QUERIES
// ============================================

export async function getUserStats(userId: string) {
  const [totalWorkouts, totalTime, streak] = await Promise.all([
    getCompletedWorkoutsCount(userId),
    getTotalWorkoutTime(userId),
    getWorkoutStreak(userId),
  ])

  return {
    totalWorkouts,
    totalTimeSeconds: totalTime,
    currentStreak: streak,
  }
}

// ============================================
// TYPE EXPORTS
// ============================================

export type {
  User,
  NewUser,
  Exercise,
  NewExercise,
  Workout,
  NewWorkout,
  WorkoutHistory,
  NewWorkoutHistory,
  UserPreferences,
  NewUserPreferences,
}

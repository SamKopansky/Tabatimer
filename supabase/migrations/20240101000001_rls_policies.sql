-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can only read and update their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_insert_own" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Workouts table policies
-- Users can only see and manage their own workouts
CREATE POLICY "workouts_select_own" ON workouts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "workouts_insert_own" ON workouts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "workouts_update_own" ON workouts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "workouts_delete_own" ON workouts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Workout history table policies
-- Users can only see and manage their own history
CREATE POLICY "workout_history_select_own" ON workout_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "workout_history_insert_own" ON workout_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "workout_history_update_own" ON workout_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "workout_history_delete_own" ON workout_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- User preferences table policies
-- Users can only see and manage their own preferences
CREATE POLICY "user_preferences_select_own" ON user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_preferences_insert_own" ON user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_preferences_update_own" ON user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_preferences_delete_own" ON user_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

-- Exercises table policies
-- Exercises are public for reading, but only admins can write (future)
-- For MVP, we'll seed exercises and make them read-only for all users
CREATE POLICY "exercises_select_all" ON exercises
  FOR SELECT
  USING (true);

-- Note: Insert/update/delete for exercises will be handled by service role key
-- or through migrations. Regular users cannot modify exercises in MVP.

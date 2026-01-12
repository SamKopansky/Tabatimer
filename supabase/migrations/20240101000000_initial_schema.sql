-- Create enums
CREATE TYPE difficulty AS ENUM('beginner', 'intermediate', 'advanced');
CREATE TYPE equipment AS ENUM('bodyweight', 'dumbbells', 'kettlebell', 'barbell', 'bands', 'pull_up_bar', 'bench', 'trx', 'medicine_ball', 'box', 'none');
CREATE TYPE workout_generation_source AS ENUM('ai', 'template', 'manual');
CREATE TYPE workout_status AS ENUM('completed', 'abandoned');

-- Create tables
CREATE TABLE users (
  id uuid PRIMARY KEY NOT NULL,
  display_name text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  name text UNIQUE NOT NULL,
  instructions text NOT NULL,
  muscle_groups text[] NOT NULL,
  difficulty difficulty NOT NULL,
  equipment equipment NOT NULL,
  form_tips text,
  image_url text,
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  duration integer NOT NULL,
  difficulty difficulty NOT NULL,
  exercises jsonb NOT NULL,
  prompt text,
  generated_by workout_generation_source NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE workout_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workout_id uuid REFERENCES workouts(id) ON DELETE SET NULL,
  workout_snapshot jsonb NOT NULL,
  status workout_status NOT NULL,
  duration_seconds integer NOT NULL,
  completed_at timestamp DEFAULT now() NOT NULL,
  notes text
);

CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  default_work_duration integer DEFAULT 20 NOT NULL,
  default_rest_duration integer DEFAULT 10 NOT NULL,
  audio_enabled boolean DEFAULT true NOT NULL,
  preferred_equipment text[] DEFAULT '{}',
  updated_at timestamp DEFAULT now() NOT NULL
);

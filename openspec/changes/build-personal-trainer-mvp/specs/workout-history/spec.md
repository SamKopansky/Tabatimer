# Workout History Capability

## ADDED Requirements

### Requirement: Workout Completion Tracking
The system SHALL record completed workout sessions with timestamp, duration, exercises performed, and completion status (completed or abandoned).

#### Scenario: Complete full workout
- **WHEN** user completes all intervals in workout session
- **THEN** save workout history entry with status "completed", actual duration, all exercises, and completion timestamp

#### Scenario: Abandon workout early
- **WHEN** user exits timer before completing all intervals
- **THEN** save workout history entry with status "abandoned", duration completed, last exercise reached, and exit timestamp

### Requirement: Workout History Timeline
The system SHALL display workout history in reverse chronological order showing date, workout name, duration, and completion status with infinite scroll or pagination.

#### Scenario: View workout history
- **WHEN** user navigates to history section
- **THEN** display workouts from most recent to oldest with date headers grouping by day (Today, Yesterday, Last Week, etc.)

#### Scenario: History item details
- **WHEN** viewing history list
- **THEN** each entry shows: workout name, completion date/time, actual duration, completion percentage, and quick preview of exercises

### Requirement: Workout History Detail View
The system SHALL provide detailed view of past workouts showing all exercises completed, time per exercise, rest periods taken, and notes if any were added.

#### Scenario: View completed workout details
- **WHEN** user taps history entry
- **THEN** show complete workout breakdown with each exercise, time spent, and completion status per exercise

#### Scenario: Incomplete workout details
- **WHEN** viewing abandoned workout
- **THEN** clearly indicate which exercises were completed and where user stopped

### Requirement: Basic Progress Statistics
The system SHALL calculate and display basic statistics including total workouts completed, total time exercised, current streak (consecutive days), and longest streak.

#### Scenario: View statistics dashboard
- **WHEN** user views history or profile section
- **THEN** display stats cards showing: total workouts completed (all time), total minutes exercised, current streak in days, longest streak achieved

#### Scenario: Streak calculation
- **WHEN** user completes workout on consecutive days
- **THEN** increment current streak counter
- **AND WHEN** user misses a day
- **THEN** reset current streak to 0 but preserve longest streak if current exceeded it

### Requirement: Workout Frequency Analytics
The system SHALL track workout frequency by week and month showing number of workouts completed per time period with simple visualization.

#### Scenario: Weekly frequency
- **WHEN** user views analytics
- **THEN** show number of workouts completed in current week and comparison to previous week

#### Scenario: Monthly frequency
- **WHEN** viewing monthly analytics
- **THEN** show total workouts per month for last 6 months with simple bar chart or list

### Requirement: Favorite Exercise Tracking
The system SHALL identify user's most frequently performed exercises based on workout history and display as "favorites" or "most performed" list.

#### Scenario: Most performed exercises
- **WHEN** user views analytics or profile
- **THEN** show top 5 most performed exercises with count of how many times performed

#### Scenario: Insufficient history
- **WHEN** user has completed fewer than 3 workouts
- **THEN** show message "Complete more workouts to see your favorite exercises" instead of empty list

### Requirement: Workout Data Retention
The system SHALL retain all workout history indefinitely unless user explicitly deletes entries, with soft delete allowing recovery for 30 days before permanent deletion.

#### Scenario: Delete workout history entry
- **WHEN** user deletes workout from history
- **THEN** soft delete entry (mark as deleted but retain in database for 30 days)
- **AND** remove from user's visible history immediately

#### Scenario: Permanent deletion
- **WHEN** 30 days pass after soft delete
- **THEN** permanently remove workout data from database via scheduled cleanup job

### Requirement: Workout History Search
The system SHALL allow searching workout history by workout name, date range, or exercise name with results filtered in real-time.

#### Scenario: Search by workout name
- **WHEN** user searches for "leg"
- **THEN** show only workouts containing "leg" in workout name or including leg exercises

#### Scenario: Date range filter
- **WHEN** user selects date range "Last 30 days"
- **THEN** filter history to show only workouts completed within that period

### Requirement: Workout Repeat Functionality
The system SHALL allow users to repeat any previous workout by loading it into timer with all original settings and exercises.

#### Scenario: Repeat past workout
- **WHEN** user taps "Repeat Workout" on history entry
- **THEN** load that workout's exercises and timer configuration into timer screen
- **AND** allow user to modify before starting if desired

#### Scenario: Track workout lineage
- **WHEN** repeating workout
- **THEN** maintain reference that new session is repeat of original workout for future analytics

### Requirement: History Data Privacy
The system SHALL ensure workout history is isolated per user with Row Level Security (RLS) in database and no public access to any user's workout data.

#### Scenario: User data isolation
- **WHEN** user views workout history
- **THEN** only display workouts belonging to authenticated user enforced at database level via RLS

#### Scenario: Anonymous access prevention
- **WHEN** non-authenticated user attempts to access history API
- **THEN** reject request with 401 Unauthorized error

### Requirement: History Export
The system SHALL allow users to export their workout history as JSON or CSV file for personal backup or analysis in external tools.

#### Scenario: Export as JSON
- **WHEN** user selects "Export History" with JSON format
- **THEN** generate JSON file containing all workout history with complete exercise details and download to user's device

#### Scenario: Export as CSV
- **WHEN** user selects "Export History" with CSV format
- **THEN** generate CSV file with columns: date, workout name, duration, exercises (comma-separated), status, notes

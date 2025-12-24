# Workout Generation Capability

## ADDED Requirements

### Requirement: Prompt-Based Workout Creation
The system SHALL accept natural language prompts from users and generate structured workout plans with exercises, sets, reps, timing, and rest periods.

#### Scenario: Simple duration prompt
- **WHEN** user enters "30 minute leg workout"
- **THEN** generate workout plan with leg exercises totaling approximately 30 minutes

#### Scenario: Equipment-specific prompt
- **WHEN** user enters "20 min upper body with dumbbells"
- **THEN** generate workout using only dumbbell exercises for upper body

#### Scenario: Intensity and style prompt
- **WHEN** user enters "beginner HIIT cardio workout"
- **THEN** generate beginner-appropriate HIIT workout with cardio exercises

### Requirement: Dual-Mode AI Integration
The system SHALL support two AI modes: Claude API for production and Ollama local models for development, with automatic mode selection based on environment variable AI_MODE.

#### Scenario: Production AI generation
- **WHEN** AI_MODE is set to "production"
- **THEN** use Claude 3.5 Sonnet API for workout generation

#### Scenario: Development AI generation
- **WHEN** AI_MODE is set to "local"
- **THEN** use Ollama with Llama 3 or Mistral for local workout generation

#### Scenario: AI mode not specified
- **WHEN** AI_MODE environment variable is not set
- **THEN** default to production mode (Claude API)

### Requirement: Rule-Based Fallback System
The system SHALL provide rule-based workout templates as fallback when AI generation fails or is unavailable, ensuring the application remains functional without AI dependency.

#### Scenario: AI service unavailable
- **WHEN** AI generation fails due to API error or timeout
- **THEN** automatically fall back to rule-based template matching user's prompt parameters

#### Scenario: Fallback notification
- **WHEN** fallback system is used
- **THEN** notify user that workout was generated using templates (not AI) with option to retry

### Requirement: Workout Structure Validation
The system SHALL validate all generated workouts (AI or fallback) to ensure proper structure with required fields: exercises array, total duration, difficulty level, and equipment list.

#### Scenario: Valid workout structure
- **WHEN** AI generates workout
- **THEN** validate presence of: workout name, exercise list with names/durations/instructions, total duration, difficulty, equipment
- **AND** reject if validation fails, triggering fallback

#### Scenario: Exercise safety validation
- **WHEN** workout is generated
- **THEN** ensure no exercises exceed reasonable duration (e.g., no single exercise >5 minutes)
- **AND** verify rest periods are included between high-intensity exercises

### Requirement: Intelligent Exercise Selection
The system SHALL select exercises that vary muscle groups, balance push/pull movements, match user's equipment availability, and respect stated fitness level.

#### Scenario: Muscle group distribution
- **WHEN** generating full body workout
- **THEN** distribute exercises across major muscle groups without overworking any single group

#### Scenario: Equipment constraint
- **WHEN** user specifies "bodyweight only"
- **THEN** only include exercises requiring no equipment

#### Scenario: Fitness level adaptation
- **WHEN** user specifies "beginner"
- **THEN** select exercises with lower complexity and include modifications/easier variations

### Requirement: Workout Metadata Generation
The system SHALL generate comprehensive metadata including estimated calorie burn (optional), target muscle groups, required equipment list, and warm-up/cool-down suggestions.

#### Scenario: Complete workout metadata
- **WHEN** workout is generated
- **THEN** include: difficulty level (beginner/intermediate/advanced), duration (minutes), equipment list, target muscle groups, workout style (Tabata/HIIT/Circuit/Strength)

#### Scenario: Warm-up and cool-down inclusion
- **WHEN** workout duration is >15 minutes
- **THEN** include warm-up suggestions (3-5 min) and cool-down/stretching suggestions (5 min)

### Requirement: Workout Persistence
The system SHALL save generated workouts to user's account with timestamp, prompt used, and generated content for future access and re-use.

#### Scenario: Save generated workout
- **WHEN** workout is successfully generated
- **THEN** automatically save to user's workout library with generation timestamp and original prompt

#### Scenario: Re-use saved workout
- **WHEN** user selects previously generated workout
- **THEN** load full workout details and allow starting timer with that workout

### Requirement: Prompt History and Quick Actions
The system SHALL provide quick action chips for common workout requests ("Quick 20min", "Leg Day", "Core Blast") and maintain history of user's prompts.

#### Scenario: Quick action selection
- **WHEN** user taps quick action chip "Leg Day"
- **THEN** auto-populate prompt with "45 minute leg workout with compound movements" and allow editing before generation

#### Scenario: Prompt history
- **WHEN** user opens workout generation screen
- **THEN** show last 5 prompts used with option to re-generate or edit

### Requirement: AI Response Streaming
The system SHALL support streaming AI responses for workout generation, showing progressive results as exercises are generated rather than waiting for complete response.

#### Scenario: Streaming workout generation
- **WHEN** using Claude API for generation
- **THEN** stream results and display exercises as they are generated
- **AND** show loading state with partial workout visible

#### Scenario: Generation cancellation
- **WHEN** user cancels during streaming generation
- **THEN** stop API request and discard partial results

### Requirement: Generation Rate Limiting
The system SHALL rate limit AI generation requests to prevent abuse, allowing maximum 10 generations per user per hour with clear feedback when limit is reached.

#### Scenario: Within rate limit
- **WHEN** user generates 5th workout in an hour
- **THEN** process request normally and show remaining generations available

#### Scenario: Rate limit exceeded
- **WHEN** user attempts 11th generation in an hour
- **THEN** reject request with error message explaining rate limit and reset time
- **AND** offer access to previously generated workouts or rule-based templates

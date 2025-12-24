# Timer Capability

## ADDED Requirements

### Requirement: Multi-Style Timer Support
The system SHALL support multiple interval timer styles including Tabata (20s work/10s rest), circuit training, HIIT, and custom intervals with user-configurable work and rest durations.

#### Scenario: Tabata timer configuration
- **WHEN** user selects Tabata mode
- **THEN** timer automatically configures for 20 seconds work, 10 seconds rest, 8 rounds (4 minutes total)

#### Scenario: Custom interval configuration
- **WHEN** user creates custom interval with 45s work and 15s rest
- **THEN** timer uses those durations for all intervals in the workout

### Requirement: Visual Countdown Display
The system SHALL display a large, high-contrast countdown timer using tabular monospace font with numbers that don't shift during countdown, readable from distance during workouts.

#### Scenario: Timer display during work phase
- **WHEN** work phase is active
- **THEN** display shows remaining seconds in large monospace font (9xl size on mobile) with red background color

#### Scenario: Timer display during rest phase
- **WHEN** rest phase is active
- **THEN** display shows remaining seconds with green background color

### Requirement: Phase Indicators
The system SHALL clearly indicate the current workout phase (prepare, work, rest, transition) using both color coding and text labels based on the traffic light system.

#### Scenario: Work phase indication
- **WHEN** work interval begins
- **THEN** display uses red spectrum colors (bg-red-500 to bg-red-600) and shows "WORK" label

#### Scenario: Rest phase indication
- **WHEN** rest interval begins
- **THEN** display uses green spectrum colors (bg-green-500 to bg-green-600) and shows "REST" label

#### Scenario: Prepare phase indication
- **WHEN** countdown before workout starts
- **THEN** display uses yellow/amber colors (bg-amber-500) and shows "GET READY" label

### Requirement: Audio Cues
The system SHALL provide audio cues at phase transitions (work to rest, rest to work) using Web Audio API, noticeable without being startling.

#### Scenario: Phase transition audio
- **WHEN** timer transitions from work to rest phase
- **THEN** play distinct audio tone to alert user

#### Scenario: Workout completion audio
- **WHEN** final interval completes
- **THEN** play completion sound different from interval transitions

### Requirement: Timer Controls
The system SHALL provide large touch-friendly controls (minimum 44x44px) for start, pause, resume, and reset with clear visual states.

#### Scenario: Start timer
- **WHEN** user taps start button
- **THEN** countdown begins from configured duration with visual and audio feedback

#### Scenario: Pause and resume
- **WHEN** user taps pause during active timer
- **THEN** countdown stops and button changes to resume state
- **AND WHEN** user taps resume
- **THEN** countdown continues from paused time without drift

#### Scenario: Reset timer
- **WHEN** user taps reset button
- **THEN** timer returns to initial state and requires confirmation to prevent accidental resets

### Requirement: Exercise Display Integration
The system SHALL display the current exercise name and instructions prominently above or below the timer countdown during workout sessions.

#### Scenario: Current exercise display
- **WHEN** timer is running with workout plan
- **THEN** show current exercise name in 3xl bold font
- **AND** show brief instruction or cue text below exercise name

#### Scenario: Exercise progression
- **WHEN** moving to next interval
- **THEN** automatically update displayed exercise to match current interval

### Requirement: Timer Accuracy
The system SHALL maintain timer accuracy within 100ms using high-precision timing (requestAnimationFrame or performance.now()) and handle browser tab backgrounding gracefully.

#### Scenario: High-precision countdown
- **WHEN** timer is active
- **THEN** countdown updates smoothly using requestAnimationFrame with <100ms accuracy

#### Scenario: Background tab handling
- **WHEN** browser tab is backgrounded during active timer
- **THEN** timer continues counting accurately and syncs display when tab returns to foreground

### Requirement: Standalone Timer Mode
The system SHALL support standalone timer usage without a workout plan, allowing users to use timer functionality independently of AI-generated workouts.

#### Scenario: Manual timer setup
- **WHEN** user accesses timer without workout plan
- **THEN** allow manual configuration of intervals, work/rest durations, and round count

#### Scenario: Quick start presets
- **WHEN** user selects quick start preset (e.g., "Quick Tabata", "5 Min HIIT")
- **THEN** timer immediately starts with preset configuration

### Requirement: Progress Tracking During Workout
The system SHALL display current interval number, total intervals, and overall workout progress with visual progress indicator.

#### Scenario: Interval progress display
- **WHEN** timer is running
- **THEN** show "Round 3 of 8" or equivalent text
- **AND** show progress bar indicating percentage of workout completed

#### Scenario: Time remaining display
- **WHEN** user views timer during workout
- **THEN** show total time remaining for entire workout in addition to current interval countdown

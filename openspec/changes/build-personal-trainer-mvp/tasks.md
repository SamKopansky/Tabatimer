# Implementation Tasks

## 1. Project Setup and Infrastructure
- [ ] 1.1 Initialize Next.js 14+ project with TypeScript and App Router
- [ ] 1.2 Configure Tailwind CSS and install shadcn/ui components
- [ ] 1.3 Set up ESLint, Prettier, and TypeScript strict mode
- [ ] 1.4 Create project directory structure (app, components, lib, hooks, types, actions)
- [ ] 1.5 Set up Supabase project (development environment)
- [ ] 1.6 Configure environment variables (.env.local and .env.example)
- [ ] 1.7 Initialize git repository and create .gitignore
- [ ] 1.8 Set up Vitest for unit testing
- [ ] 1.9 Set up Playwright for E2E testing
- [ ] 1.10 Create GitHub repository and initial commit

## 2. Database Schema and ORM Setup
- [ ] 2.1 Install and configure Drizzle ORM
- [ ] 2.2 Create database schema file (users, workouts, exercises, workout_exercises, workout_history, user_preferences)
- [ ] 2.3 Write initial migration scripts
- [ ] 2.4 Set up Row Level Security (RLS) policies in Supabase
- [ ] 2.5 Create seed script for exercise library (minimum 50 exercises)
- [ ] 2.6 Run migrations on development database
- [ ] 2.7 Verify RLS policies work correctly with test queries
- [ ] 2.8 Write database query helper functions with proper typing

## 3. Authentication System
- [ ] 3.1 Configure Supabase Auth client (server and client components)
- [ ] 3.2 Create auth utility functions (getUser, requireAuth)
- [ ] 3.3 Implement email/password registration flow with UI
- [ ] 3.4 Implement email/password login flow with UI
- [ ] 3.5 Implement email verification system
- [ ] 3.6 Implement magic link authentication
- [ ] 3.7 Configure Google OAuth provider in Supabase
- [ ] 3.8 Configure Apple OAuth provider in Supabase
- [ ] 3.9 Implement OAuth login flows with UI
- [ ] 3.10 Create password reset flow (request and confirm)
- [ ] 3.11 Implement session management with HTTP-only cookies
- [ ] 3.12 Create protected route middleware for (auth) route group
- [ ] 3.13 Build user profile page with update functionality
- [ ] 3.14 Implement account deletion with confirmation
- [ ] 3.15 Write authentication integration tests
- [ ] 3.16 Test and verify RLS policies with different users

## 4. UI Foundation and Design System
- [ ] 4.1 Install and configure custom fonts (monospace for timer, sans-serif for UI)
- [ ] 4.2 Set up Tailwind custom colors (traffic light system: red/green/amber)
- [ ] 4.3 Create root layout with navigation structure
- [ ] 4.4 Build bottom tab navigation for mobile
- [ ] 4.5 Build collapsible sidebar navigation for desktop
- [ ] 4.6 Create responsive layout containers and spacing utilities
- [ ] 4.7 Implement dark mode toggle (optional, for future enhancement)
- [ ] 4.8 Build reusable card components with shadcn/ui styling
- [ ] 4.9 Create loading states and skeleton screens
- [ ] 4.10 Build error boundary components and error pages
- [ ] 4.11 Set up toast notification system (shadcn/ui toast)
- [ ] 4.12 Verify accessibility (keyboard navigation, ARIA labels, focus indicators)

## 5. Timer Core Functionality
- [ ] 5.1 Create timer types and interfaces (TimerConfig, TimerState, WorkoutPhase)
- [ ] 5.2 Implement useTimer custom hook with high-precision timing
- [ ] 5.3 Add timer state management (start, pause, resume, reset)
- [ ] 5.4 Implement requestAnimationFrame-based countdown
- [ ] 5.5 Add background tab handling with visibility API
- [ ] 5.6 Create timer display component with monospace countdown
- [ ] 5.7 Implement phase indicators (work/rest/prepare) with color coding
- [ ] 5.8 Build timer control buttons (start, pause, reset) with touch-friendly sizing
- [ ] 5.9 Add progress tracking (current interval, total intervals, percentage)
- [ ] 5.10 Implement total workout time remaining display
- [ ] 5.11 Create Tabata preset configuration (20s/10s, 8 rounds)
- [ ] 5.12 Create custom interval configuration UI
- [ ] 5.13 Add timer presets (Quick Tabata, 5 Min HIIT, etc.)
- [ ] 5.14 Write comprehensive timer unit tests
- [ ] 5.15 Test timer accuracy with performance profiling

## 6. Timer Audio System
- [ ] 6.1 Set up Web Audio API context
- [ ] 6.2 Create audio utility functions (play tone, stop audio)
- [ ] 6.3 Generate or source audio files for phase transitions
- [ ] 6.4 Generate or source completion sound
- [ ] 6.5 Implement audio cue triggering at phase changes
- [ ] 6.6 Add user preference for audio on/off
- [ ] 6.7 Handle browser autoplay policies gracefully
- [ ] 6.8 Test audio across different browsers (Chrome, Safari, Firefox)

## 7. Exercise Library
- [ ] 7.1 Create exercise types and database schema validation
- [ ] 7.2 Build exercise seed data file (50+ exercises with complete metadata)
- [ ] 7.3 Implement exercise database queries (list, search, filter, get by ID)
- [ ] 7.4 Create exercise card component with grid layout
- [ ] 7.5 Build exercise library page with responsive grid (2/3/4 columns)
- [ ] 7.6 Implement real-time search functionality
- [ ] 7.7 Create filter chips for muscle groups, equipment, difficulty
- [ ] 7.8 Implement multi-filter logic (AND combination)
- [ ] 7.9 Build exercise detail view modal or page
- [ ] 7.10 Add exercise favoriting functionality (UI and database)
- [ ] 7.11 Create favorites view/filter
- [ ] 7.12 Implement exercise categorization and category navigation
- [ ] 7.13 Add exercise images with proper alt text for accessibility
- [ ] 7.14 Write exercise library component tests
- [ ] 7.15 Test keyboard navigation and screen reader support

## 8. AI Workout Generation
- [ ] 8.1 Set up Claude API client with environment variable configuration
- [ ] 8.2 Set up Ollama integration for local development
- [ ] 8.3 Create AI mode detection logic (based on AI_MODE env var)
- [ ] 8.4 Write system prompt for workout generation with example outputs
- [ ] 8.5 Implement Claude API workout generation function
- [ ] 8.6 Implement Ollama local workout generation function
- [ ] 8.7 Create workout generation prompt parser (extract duration, focus, equipment, intensity)
- [ ] 8.8 Build rule-based fallback template system
- [ ] 8.9 Implement workout structure validation
- [ ] 8.10 Create workout generation UI with large text area
- [ ] 8.11 Add quick action chips for common prompts
- [ ] 8.12 Implement streaming response display for Claude API
- [ ] 8.13 Add loading states and cancellation for generation
- [ ] 8.14 Implement rate limiting (10 per hour per user)
- [ ] 8.15 Create workout save functionality (Server Action)
- [ ] 8.16 Build saved workouts list view
- [ ] 8.17 Store prompt history (last 5 prompts)
- [ ] 8.18 Implement error handling and fallback triggering
- [ ] 8.19 Write unit tests for prompt parsing and validation
- [ ] 8.20 Write integration tests for AI generation flow

## 9. Workout Integration with Timer
- [ ] 9.1 Create workout-to-timer configuration adapter
- [ ] 9.2 Implement exercise progression logic during timer intervals
- [ ] 9.3 Build exercise display component for timer screen
- [ ] 9.4 Add current exercise name and instruction display
- [ ] 9.5 Implement automatic exercise switching at interval boundaries
- [ ] 9.6 Add workout context provider for sharing workout state
- [ ] 9.7 Create "Start Workout" flow from workout generation to timer
- [ ] 9.8 Add ability to start timer from saved workout
- [ ] 9.9 Test complete flow: generate workout → start timer → complete session

## 10. Workout History and Analytics
- [ ] 10.1 Create workout history database schema and queries
- [ ] 10.2 Implement workout completion tracking (Server Action)
- [ ] 10.3 Handle abandoned workout tracking
- [ ] 10.4 Build workout history timeline view (reverse chronological)
- [ ] 10.5 Implement date grouping (Today, Yesterday, Last Week)
- [ ] 10.6 Create workout history detail view
- [ ] 10.7 Calculate and display basic statistics (total workouts, time, streaks)
- [ ] 10.8 Implement streak calculation logic
- [ ] 10.9 Build statistics dashboard cards
- [ ] 10.10 Implement workout frequency analytics (weekly, monthly)
- [ ] 10.11 Create most performed exercises list
- [ ] 10.12 Add workout history search functionality
- [ ] 10.13 Implement date range filtering
- [ ] 10.14 Create "Repeat Workout" functionality
- [ ] 10.15 Implement soft delete for history entries
- [ ] 10.16 Create scheduled cleanup job for permanent deletion (30 days)
- [ ] 10.17 Build history export functionality (JSON and CSV)
- [ ] 10.18 Write history tracking integration tests
- [ ] 10.19 Verify RLS policies for workout history

## 11. User Preferences and Settings
- [ ] 11.1 Create user preferences database schema
- [ ] 11.2 Implement preferences save/load functionality
- [ ] 11.3 Build settings page UI
- [ ] 11.4 Add timer default settings (work/rest durations, audio on/off)
- [ ] 11.5 Add equipment preferences for workout generation
- [ ] 11.6 Create profile edit form (display name, email)
- [ ] 11.7 Implement password change functionality
- [ ] 11.8 Add email change with verification
- [ ] 11.9 Store and apply user preferences throughout app

## 12. Testing and Quality Assurance
- [ ] 12.1 Write unit tests for timer logic (>100% coverage)
- [ ] 12.2 Write unit tests for AI prompt parsing and validation (80%+ coverage)
- [ ] 12.3 Write component tests for major UI components (70%+ coverage)
- [ ] 12.4 Write integration tests for Server Actions
- [ ] 12.5 Create E2E test: User registration and login flow
- [ ] 12.6 Create E2E test: Generate workout and start timer
- [ ] 12.7 Create E2E test: Complete workout and view history
- [ ] 12.8 Test responsive design on multiple viewports
- [ ] 12.9 Perform accessibility audit with Lighthouse
- [ ] 12.10 Test keyboard navigation across all pages
- [ ] 12.11 Test with screen reader (VoiceOver or NVDA)
- [ ] 12.12 Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] 12.13 Performance testing and bundle size verification
- [ ] 12.14 Security testing (auth, RLS, XSS prevention)

## 13. GitHub Actions CI/CD Pipeline
- [ ] 13.1 Create .github/workflows/ci.yml configuration
- [ ] 13.2 Set up job: Install dependencies with caching
- [ ] 13.3 Set up job: TypeScript type checking (tsc --noEmit)
- [ ] 13.4 Set up job: ESLint checks
- [ ] 13.5 Set up job: Run unit tests (Vitest)
- [ ] 13.6 Set up job: Build application (next build)
- [ ] 13.7 Set up job: Run E2E tests (Playwright)
- [ ] 13.8 Configure Playwright browser caching
- [ ] 13.9 Set up GitHub Secrets for environment variables
- [ ] 13.10 Configure branch protection rules (require CI pass)
- [ ] 13.11 Test CI pipeline with pull request
- [ ] 13.12 Set up Vercel deployment from GitHub Actions

## 14. Deployment and Production Setup
- [ ] 14.1 Create Vercel project linked to GitHub repository
- [ ] 14.2 Configure Vercel environment variables (production)
- [ ] 14.3 Set up Supabase production project
- [ ] 14.4 Run database migrations on production Supabase
- [ ] 14.5 Seed production database with exercise library
- [ ] 14.6 Configure production Claude API credentials
- [ ] 14.7 Set up custom domain (if applicable)
- [ ] 14.8 Configure Vercel Analytics
- [ ] 14.9 Test production deployment end-to-end
- [ ] 14.10 Set up error monitoring and logging
- [ ] 14.11 Create production README with setup instructions
- [ ] 14.12 Document environment variables in .env.example

## 15. Documentation and Polish
- [ ] 15.1 Write comprehensive README with project overview
- [ ] 15.2 Document setup instructions for local development
- [ ] 15.3 Document Ollama setup for local AI development
- [ ] 15.4 Document Supabase setup steps
- [ ] 15.5 Create API documentation for Server Actions
- [ ] 15.6 Add inline code comments for complex logic
- [ ] 15.7 Create user guide or help section in app
- [ ] 15.8 Add onboarding flow for new users (optional)
- [ ] 15.9 Final UI polish and refinement pass
- [ ] 15.10 Final accessibility review and fixes
- [ ] 15.11 Performance optimization pass
- [ ] 15.12 Create demo video or screenshots for repository

## Dependencies and Parallelization Notes

**Can be done in parallel:**
- Tasks 3 (Authentication) and 4 (UI Foundation) can proceed simultaneously
- Tasks 5 (Timer) and 6 (Audio) can be developed in parallel
- Tasks 7 (Exercise Library) and 8 (AI Generation) can proceed independently
- Tasks 12 (Testing) should run continuously alongside feature development

**Sequential dependencies:**
- Task 1 (Setup) must complete before all others
- Task 2 (Database) must complete before tasks 3, 7, 8, 10
- Task 3 (Authentication) must complete before tasks 8, 10 (user-specific features)
- Tasks 5 and 8 must complete before task 9 (Workout Integration)
- Task 9 must complete before task 10 (History requires completed workouts)
- Task 13 (CI/CD) requires tasks 12 (Testing) to have test suites ready
- Task 14 (Deployment) should be last after all features complete

**Critical path:**
1. Setup (Task 1)
2. Database (Task 2)
3. Authentication (Task 3)
4. Timer (Task 5) + Exercise Library (Task 7) + AI Generation (Task 8)
5. Workout Integration (Task 9)
6. Workout History (Task 10)
7. Testing (Task 12)
8. CI/CD (Task 13)
9. Deployment (Task 14)

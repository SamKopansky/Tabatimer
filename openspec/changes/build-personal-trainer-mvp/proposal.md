# Change: Build Personal Trainer App MVP

## Why

Create an AI-powered personal trainer application that generates custom workouts and guides users through them with an intelligent timer. The app solves the problem of needing personalized workout guidance without requiring a human trainer, combining AI workout generation with versatile interval timing for multiple training styles (Tabata, circuit training, HIIT).

Users can simply describe what they want ("30 min leg workout with dumbbells") and get a structured workout plan with the ability to follow along using an integrated timer with visual and audio cues.

## What Changes

This is a greenfield implementation creating the full application from scratch.

**Core Capabilities:**
- **Timer System**: Multi-style interval timer (Tabata, circuit, HIIT, custom) with visual countdown, phase indicators, and audio cues
- **AI Workout Generation**: Prompt-based workout creation using Claude API (production) or Ollama (development) with rule-based fallback
- **Exercise Library**: Searchable database of exercises with instructions, muscle groups, difficulty levels, and form tips
- **Workout History**: Track completed workouts, progress metrics, and personal records
- **User Authentication**: Secure user accounts with Supabase Auth (email/password, OAuth, magic links)

**Technical Stack:**
- Frontend: Next.js 14+ App Router, React 18+, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Next.js Server Actions + Route Handlers, Supabase (PostgreSQL with JS Client)
- AI: Claude API (production), Ollama local models (development), rule-based fallback
- Deployment: Vercel (hosting), GitHub Actions (CI/CD)

**Design System:**
- Modern fitness aesthetic (Peloton/Apple Fitness style)
- Traffic light color system (red=work, green=rest, amber=prepare)
- Mobile-first responsive design
- High contrast for workout readability
- Tabular monospace fonts for timer accuracy

## Impact

**Affected Specs:**
- `timer` (NEW) - Core interval timer functionality
- `workout-generation` (NEW) - AI-powered workout creation
- `exercise-library` (NEW) - Exercise database and search
- `workout-history` (NEW) - Progress tracking and analytics
- `user-auth` (NEW) - Authentication and user management

**Affected Code:**
- Creates entire application structure from scratch
- Establishes Next.js 14+ App Router architecture
- Sets up Supabase database and authentication
- Implements full frontend component library
- Creates AI integration layer with dual-mode support

**Dependencies:**
- Requires Supabase project setup (development + production)
- Requires Claude API key for production AI features
- Requires Ollama setup for local development
- Requires Vercel account for deployment
- Requires GitHub Actions configuration for CI/CD

**Migration Notes:**
- No migration needed (greenfield project)
- Initial database schema will be created via Supabase migrations
- Seed data for exercise library will be provided

## Non-Goals (Out of Scope for MVP)

- Social features (sharing workouts, following users)
- Video exercise demonstrations (only text/images)
- Wearable device integration
- Offline mode (requires network connection)
- Custom exercise creation by users
- Workout plan templates library
- Advanced analytics/charts (basic stats only)
- Mobile native apps (web-only for MVP)

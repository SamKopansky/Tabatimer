# Project Context

## Purpose
An AI-powered personal trainer app that generates custom workouts and guides users through them with intelligent timer functionality. The app combines AI workout generation with a versatile interval timer supporting multiple training styles (Tabata, circuit training, HIIT).

**Core Value Proposition:**
Tell the app what you want to do ("30 min leg workout with dumbbells") and it generates a structured workout with exercises, sets, reps, and timing. Then follow along with the integrated timer.

**Key Features:**

*AI Workout Generation:*
- Prompt-based workout creation ("I want to..." → full workout plan)
- Smart exercise selection based on goals, equipment, and time
- Structured workout plans with exercises, sets, reps, and rest periods

*Intelligent Timer:*
- Multi-style support: Tabata (20s/10s), circuit training, custom intervals
- Visual countdown with phase indicators (work/rest)
- Audio cues for transitions
- Displays current exercise from workout plan
- Works standalone or with generated workouts

*Exercise Library:*
- Searchable database of exercises
- Instructions, muscle groups, difficulty levels
- Form tips and variations

*Progress Tracking:*
- Workout history and completion tracking
- Analytics and progress metrics
- Personal records and achievements

## Design System

### Design Philosophy
**Modern Fitness Aesthetic**: Sleek, energetic, and polished. Think Peloton or Apple Fitness - professional without being corporate, motivational without being cheesy. Gradients, smooth animations, rounded corners, and a sense of forward momentum.

### Visual Style
- **Modern & Energetic**: Polished fitness app aesthetic with smooth gradients and dynamic elements
- **High Contrast**: Easy to read during intense workouts, optimized for glanceability
- **Bold Typography**: Tabular monospace for timers (numbers don't shift), bold sans-serif for headings
- **Motivational Without Overwhelm**: Visual energy that motivates without distracting from the workout
- **Consistent Spacing**: Use Tailwind's spacing scale (4px base unit)
- **Purposeful Motion**: Smooth transitions and subtle animations that guide attention

### Color Palette
**Traffic Light System** for intuitive phase recognition:

*Timer States:*
- **Work Phase**: Red spectrum (`bg-red-500` to `bg-red-600`)
  - High energy, "go hard" signal
  - Universally recognized as active/intense
- **Rest Phase**: Green spectrum (`bg-green-500` to `bg-green-600`)
  - Recovery, "you earned it" signal
  - Calming and reassuring
- **Prepare/Transition**: Yellow/Amber (`bg-amber-500`)
  - Warning, "get ready" signal

*UI Colors:*
- **Primary Action**: Blue (`bg-blue-600`) - start workout, generate, primary CTAs
- **Neutral**: Slate grays (`bg-slate-50` to `bg-slate-900`) - backgrounds, text
- **Success**: Green (`bg-green-500`) - completed, achievements
- **Warning**: Orange (`bg-orange-500`) - alerts, cautions
- **Error**: Red (`bg-red-500`) - errors, destructive actions

*Gradients:*
- Use Tailwind's gradient utilities for hero sections, cards, and buttons
- Subtle gradients (2-3 shades apart) for depth without distraction
- Example: `bg-gradient-to-br from-blue-500 to-blue-700`

### Typography

**Font Stack:**
- **Timer/Numbers**: Monospace tabular (JetBrains Mono, Roboto Mono, or `font-mono`)
  - Fixed-width ensures countdown doesn't shift
  - Tabular numerals for clean alignment
- **Headings/UI**: System sans-serif (`font-sans` - Inter, SF Pro, Roboto)
  - Modern, readable, fast loading
  - Bold weights for emphasis

**Type Scale:**
- **Timer Countdown**: `text-9xl` (128px) on mobile, larger on desktop
- **Exercise Name**: `text-3xl` (30px) - bold, prominent during workout
- **Section Headings**: `text-2xl` (24px) - bold
- **Body Text**: `text-base` (16px) - regular weight
- **Labels/Meta**: `text-sm` (14px) - medium weight
- **Captions**: `text-xs` (12px) - for timestamps, subtitles

**Font Weights:**
- Regular (400): Body text, descriptions
- Medium (500): Labels, emphasized text
- Semibold (600): Subheadings, buttons
- Bold (700): Headings, timer numbers

### Component Design Principles
- **Mobile-First**: Design for phone screens first, scale up for desktop
- **Touch-Friendly**: Minimum 44x44px touch targets (Apple HIG guideline)
- **Thumb-Friendly**: Primary actions in bottom half of screen
- **Accessible**: WCAG 2.1 AA compliance minimum
  - Semantic HTML elements
  - ARIA labels where needed
  - Keyboard navigation support
  - Color is not the only indicator (use icons + text)
- **Card-Based Layout**: Group related content in cards with subtle shadows
- **Rounded Corners**: `rounded-lg` (8px) for most components, `rounded-xl` (12px) for cards
- **Performance**: 60fps animations, no layout shifts, fast interactions

### Layout Guidelines

*Navigation:*
- **Bottom Tab Bar** (mobile): Timer, Workouts, History, Profile
- **Side Nav** (desktop): Collapsible sidebar with same sections
- **Always accessible**: Never hide navigation during workouts

*Timer View:*
- **Full-Screen Mode**: Option to hide nav and focus only on timer
- **Centered Content**: Timer display centered vertically and horizontally
- **Floating Controls**: Buttons float above background, always visible
- **Current Exercise**: Prominently displayed above or below timer

*Workout Generation:*
- **Prompt Input**: Large text area, friendly placeholder text
- **Quick Actions**: Chips for common requests ("Quick 20min", "Leg Day", etc.)
- **Generated Output**: Scrollable list of exercises with expand/collapse

*Exercise Library:*
- **Grid Layout**: 2 columns on mobile, 3-4 on desktop
- **Filter Chips**: Quick filters for muscle group, equipment, difficulty
- **Search Bar**: Sticky at top, instant search

*History/Analytics:*
- **Timeline View**: Reverse chronological list of workouts
- **Stats Cards**: Grid of key metrics (total workouts, streak, favorite exercise)
- **Charts**: Simple bar/line charts for progress over time

### Spacing & Rhythm
- **Screen Padding**: `px-4` (16px) on mobile, `px-8` (32px) on desktop
- **Component Gaps**: `gap-4` (16px) for related items, `gap-8` (32px) between sections
- **Card Padding**: `p-6` (24px) inside cards
- **Vertical Rhythm**: `space-y-6` (24px) between major sections

## Tech Stack

### Frontend
- **Language**: TypeScript
- **Framework**: React 18+ with Next.js 14+ App Router
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui (accessible, customizable, built on Radix UI)
- **State Management**: React Context API + Server Actions (keep simple; upgrade if needed)
- **Audio**: Web Audio API
- **Testing**: Vitest + React Testing Library
- **Build/Deploy**: Vercel (optimized for Next.js)

### Backend
- **Runtime**: Next.js 14+ App Router (full-stack framework)
- **API Layer**: Next.js Server Actions + Route Handlers (API routes)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM or Prisma (TypeScript-first, type-safe queries)
- **Authentication**: Supabase Auth (email/password, OAuth, magic links)
- **AI Integration**:
  - **Development/Testing**: Local models via Ollama (Llama 3, Mistral)
  - **Production**: Claude API (Anthropic)
  - **Fallback**: Rule-based workout templates
- **File Storage**: Supabase Storage (for exercise images/videos)
- **Testing**: Vitest for unit tests, Playwright for E2E

### Infrastructure
- **Hosting**: Vercel (Next.js frontend + serverless functions)
- **Database Hosting**: Supabase (managed PostgreSQL)
- **Environment Management**: .env.local (development), Vercel env vars (production)
- **Monitoring**: Vercel Analytics + Supabase Dashboard

## Architecture & Technical Decisions

### System Architecture

**Full-Stack Next.js Approach:**
- Single codebase for frontend and backend
- Server Components for initial page loads (fast, SEO-friendly)
- Client Components for interactive UI (timer, form inputs)
- Server Actions for mutations (create workout, save history)
- Route Handlers for external API endpoints (webhooks, integrations)

**Why Next.js Full-Stack:**
- TypeScript across entire stack (no context switching)
- Shared types between frontend and backend
- Simple deployment (one app, one deploy)
- Server Actions eliminate API boilerplate for mutations
- Built-in optimizations (image optimization, route prefetching)

### Application Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth-protected routes
│   │   ├── timer/               # Timer feature
│   │   │   ├── page.tsx
│   │   │   └── page.test.tsx   # Co-located test
│   │   ├── workouts/            # Workout generation & library
│   │   ├── history/             # Workout history & analytics
│   │   └── profile/             # User settings
│   ├── (public)/                # Public routes
│   │   ├── login/               # Login page
│   │   └── signup/              # Signup page
│   ├── api/                     # API Route Handlers
│   │   ├── ai/                  # AI workout generation endpoints
│   │   └── webhooks/            # External webhooks
│   └── layout.tsx               # Root layout
├── components/                  # React components
│   ├── ui/                      # shadcn/ui components
│   ├── timer/                   # Timer-specific components
│   │   ├── Timer.tsx
│   │   ├── Timer.test.tsx      # Co-located test
│   │   ├── TimerControls.tsx
│   │   └── TimerControls.test.tsx
│   ├── workout/                 # Workout-related components
│   │   ├── WorkoutCard.tsx
│   │   ├── WorkoutCard.test.tsx
│   │   └── ...
│   └── shared/                  # Shared/common components
├── lib/                         # Utility libraries
│   ├── db/                      # Database client & queries
│   │   ├── schema.ts
│   │   └── queries.test.ts     # Co-located test
│   ├── ai/                      # AI integration (Claude + local)
│   │   ├── workout-generator.ts
│   │   └── workout-generator.test.ts
│   ├── supabase/                # Supabase client & helpers
│   └── utils/                   # Shared utilities
│       ├── time.ts
│       └── time.test.ts
├── hooks/                       # Custom React hooks
│   ├── useTimer.ts              # Timer logic
│   ├── useTimer.test.ts         # Co-located test
│   ├── useWorkout.ts
│   ├── useWorkout.test.ts
│   └── useAuth.ts
├── types/                       # TypeScript type definitions
│   ├── database.ts              # Generated from Supabase schema
│   ├── workout.ts               # Workout-related types
│   └── timer.ts                 # Timer-related types
└── actions/                     # Server Actions
    ├── workout-actions.ts       # Create, update, delete workouts
    ├── workout-actions.test.ts  # Co-located test
    ├── history-actions.ts
    └── ai-actions.ts
```

**Test Co-location Convention:**
- Every component, hook, util, or action has its test file alongside it
- Naming: `ComponentName.test.tsx` or `functionName.test.ts`
- Makes tests easy to find and keeps related code together
- Import paths are simpler (no `../../../test/...`)
- When you delete a component, you naturally delete its test too

### Database Architecture

**Supabase PostgreSQL Schema:**

*Core Tables:*
- `users` - User profiles (extended from Supabase Auth)
- `workouts` - Generated/saved workout plans
- `exercises` - Exercise library with metadata
- `workout_exercises` - Junction table (workouts ↔ exercises)
- `workout_history` - Completed workout records
- `user_preferences` - Timer settings, default equipment, etc.

*Key Design Decisions:*
- Use Supabase Auth's `auth.users` as source of truth for users
- Store workout templates separately from completed workouts
- Denormalize exercise data in history for historical accuracy
- Use PostgreSQL JSONB for flexible exercise metadata
- Implement Row Level Security (RLS) for data isolation

**Example Schema Pattern:**
```typescript
// Drizzle schema example
export const workouts = pgTable('workouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  duration: integer('duration'), // minutes
  difficulty: text('difficulty'), // beginner, intermediate, advanced
  exercises: jsonb('exercises'), // array of exercise objects
  createdAt: timestamp('created_at').defaultNow(),
});
```

### AI Integration Architecture

**Dual-Mode AI System:**

*Development/Testing (Local Models via Ollama):*
- Run Llama 3 or Mistral locally
- Fast iteration, no API costs
- Consistent testing without rate limits
- Environment variable: `AI_MODE=local`

*Production (Claude API):*
- Claude 3.5 Sonnet for high-quality workout generation
- Structured output with tool use
- Better reasoning about exercise selection
- Environment variable: `AI_MODE=production`

**AI Prompt Structure:**
```typescript
// lib/ai/workout-generator.ts
export async function generateWorkout(prompt: string) {
  const systemPrompt = `You are a certified personal trainer...`;

  if (process.env.AI_MODE === 'local') {
    return await generateWithOllama(systemPrompt, prompt);
  } else {
    return await generateWithClaude(systemPrompt, prompt);
  }
}
```

**Fallback Strategy:**
1. Try AI generation (Claude or local)
2. If AI fails, use rule-based templates
3. Always validate AI output structure
4. Cache common workout patterns

### API Design

**Prefer Server Actions over REST:**
- Use Server Actions for all mutations (create, update, delete)
- Direct function calls from client, no API routes needed
- Automatic type safety and serialization
- Built-in error handling with `useFormState`

**When to Use Route Handlers:**
- Webhooks from external services
- Public APIs for integrations
- Streaming responses (AI generation with tokens)
- Non-Next.js clients

**Example Server Action:**
```typescript
// actions/workout-actions.ts
'use server';

export async function saveWorkout(data: WorkoutInput) {
  const user = await getUser(); // Supabase auth
  if (!user) throw new Error('Unauthorized');

  const workout = await db.insert(workouts).values({
    userId: user.id,
    ...data,
  });

  revalidatePath('/workouts');
  return workout;
}
```

### Authentication Flow

**Supabase Auth Integration:**
- Email/password signup and login
- OAuth providers (Google, Apple) for social login
- Magic link authentication (passwordless)
- Session management via HTTP-only cookies
- Server-side auth checks in Server Components and Actions

**Auth Utilities:**
```typescript
// lib/supabase/auth.ts
export async function getUser() {
  const supabase = createServerClient(); // server-only
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
}
```

**Protected Routes:**
- Wrap authenticated routes in `(auth)` route group
- Check auth in layout.tsx before rendering children
- Redirect to /login if not authenticated

### State Management Strategy

**Keep it Simple:**
- **Server State**: Fetched via Server Components, no client state needed
- **Client State**: React Context for global UI state (theme, user preferences)
- **Form State**: `useFormState` with Server Actions
- **Timer State**: Custom `useTimer` hook with useState/useRef
- **URL State**: Next.js searchParams for filters, pagination

**When to Use Context:**
- User preferences (timer defaults, units, sound settings)
- Theme/appearance settings
- Current workout in progress (shared across timer/exercise views)

**Avoid:**
- Redux or complex state management (unnecessary for this app)
- Client-side data fetching (use Server Components instead)
- Duplicating server state on client

### Data Fetching Patterns

**Server Components (Default):**
```typescript
// app/(auth)/workouts/page.tsx
export default async function WorkoutsPage() {
  const user = await requireAuth();
  const workouts = await db.query.workouts.findMany({
    where: eq(workouts.userId, user.id),
  });

  return <WorkoutList workouts={workouts} />;
}
```

**Client Components (When Needed):**
```typescript
// components/timer/Timer.tsx
'use client';

export function Timer({ workout }: { workout: Workout }) {
  const { time, isRunning, start, pause, reset } = useTimer(workout);
  // Interactive timer logic
}
```

### Performance Considerations

**Optimization Strategy:**
- Use Server Components by default (less JavaScript to client)
- Dynamic imports for heavy components (charts, AI prompt editor)
- Image optimization with next/image
- Font optimization with next/font
- Lazy load exercise videos/images
- Cache AI workout generations (dedupe similar prompts)
- Database indexes on frequently queried columns (userId, createdAt)

**Bundle Size Budget:**
- Initial bundle: <100KB gzipped
- Timer component: <20KB (critical path)
- Exercise library: Lazy loaded
- Charts/analytics: Lazy loaded

### Security Practices

**Authentication & Authorization:**
- All Server Actions check authentication
- Row Level Security (RLS) in Supabase for data isolation
- Never trust client-side auth state
- Use Supabase service role key only in server-side code

**Input Validation:**
- Validate all user inputs with Zod schemas
- Sanitize AI-generated content before saving
- Rate limit AI generation endpoints (prevent abuse)
- CORS configuration for API routes

**Environment Variables:**
- Never expose API keys to client
- Use `NEXT_PUBLIC_` prefix only for truly public vars
- Rotate keys regularly
- Use Vercel's encrypted env vars for production

### Deployment Strategy

**GitHub Actions CI/CD Pipeline:**

The deployment process runs through GitHub Actions before deploying to Vercel:

```
Git Push → GitHub Actions → Vercel Deploy
             ├── Install deps
             ├── Type check (tsc --noEmit)
             ├── Lint (eslint)
             ├── Unit tests (vitest)
             ├── Build (next build)
             ├── E2E tests (playwright)
             └── ✅ All pass → Deploy to Vercel
```

**GitHub Actions Workflow** (`.github/workflows/ci.yml`):
- **On Pull Request**: Run all checks, no deploy
- **On Push to main**: Run all checks → Deploy to production
- **On Push to develop**: Run all checks → Deploy to preview
- **Quality Gates**: Block merge if any step fails
- **Caching**: Cache node_modules and Playwright browsers for speed

**Vercel Integration:**
- Vercel deployment triggered by GitHub Actions (not automatic)
- Preview deployments for PRs (after CI passes)
- Production deployment only from main branch
- Environment variables in Vercel dashboard
- Vercel CLI used in GitHub Actions: `vercel deploy --prod`

**Supabase Setup:**
- Development project for local/staging
- Production project for live app
- Database migrations via Supabase CLI (run in GitHub Actions)
- Connection pooling enabled (for serverless)

**Environment Management:**
- `.env.local` for local development (git-ignored)
- `.env.example` checked into git (template without secrets)
- GitHub Secrets for CI/CD (accessed in actions)
- Vercel env vars for runtime (production/preview)

**Branch Strategy:**
- `main` → Production (Vercel production)
- `develop` → Staging (Vercel preview)
- Feature branches → PR preview deployments
- Require CI to pass before merge

### Error Handling & Monitoring

**Error Boundaries:**
- React Error Boundary for client-side errors
- Global error.tsx in App Router for route errors
- Fallback UI for failed data fetching

**Logging:**
- Console errors in development
- Vercel Analytics in production
- Supabase logs for database errors
- AI generation failures logged with prompt context

**User Feedback:**
- Toast notifications for actions (shadcn/ui toast)
- Inline form validation errors
- Loading states for async operations
- Error messages in plain language (no stack traces)

## Project Conventions

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- 2-space indentation
- Single quotes for strings
- Trailing commas in multi-line structures
- Named exports preferred over default exports
- Functional components and hooks (no class components)
- Custom hooks prefixed with `use` (e.g., `useTimer`, `useAudio`)

### Architecture Patterns
- **Component-Based**: UI broken into reusable components
- **Single Responsibility**: Each module/component has one clear purpose
- **Minimal Abstractions**: Keep code simple; avoid premature optimization
- **Feature-First Structure**: Organize code by feature/capability rather than technical type
- **Default to <100 lines**: Keep files small; split when complexity grows

### Testing Strategy
- **Test Co-location**: Tests live alongside the code they test (`.test.ts` or `.test.tsx`)
- **Unit Tests**: Business logic (timer calculations, AI prompt parsing, workout validation)
- **Component Tests**: UI interactions using React Testing Library
- **Integration Tests**: Server Actions, database queries, API routes
- **E2E Tests**: Critical flows using Playwright (auth, generate workout, complete timer session)
- **Coverage Goals**:
  - Core timer logic: 100%
  - AI generation: 80%+ (focus on prompt parsing and validation)
  - UI components: 70%+ (focus on user interactions)
- **Test Naming**: Describe behavior, not implementation
  - ✅ `it('should pause timer when workout is interrupted')`
  - ❌ `it('should set isRunning to false')`

### Git Workflow
- **Protected main branch**: No direct commits, PRs required
- **Feature branches**: `feature/description` or `fix/description`
- **Branch from**: Create branches from `develop` or `main`
- **PR Process**:
  1. Create feature branch
  2. Make changes, commit frequently
  3. Push and open PR
  4. CI runs automatically (GitHub Actions)
  5. Review and merge when CI passes
- **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- **Commit Messages**: Include Claude Code attribution when AI-assisted
  ```
  feat: add workout generation with AI

  - Implement prompt-based workout creation
  - Add Claude API integration with fallback
  - Include unit tests for prompt parsing

  🤖 Generated with Claude Code
  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
  ```

## Development Practices

### Code Quality Standards
Write code as a seasoned senior full-stack engineer would:

**Simplicity First:**
- Solve the immediate problem, not hypothetical future ones
- Prefer boring, obvious solutions over clever ones
- Delete code aggressively - less code = fewer bugs
- Avoid premature abstraction - wait until you need it 3 times
- Question every dependency - each one is a liability

**Readability:**
- Code should read like prose - clear intent, obvious flow
- Variable names should be descriptive: `workDuration` not `wd`
- Function names should be verbs: `startTimer()`, `calculateProgress()`
- Avoid abbreviations unless universally understood (e.g., `id`, `url`)
- Comments explain *why*, not *what* (code should be self-documenting)
- Max function length: ~20 lines (split if longer)
- Max file length: ~200 lines (split by feature/concern if longer)

**Maintainability:**
- **DRY when it matters**: Don't repeat complex logic, but repetition beats the wrong abstraction
- **Pure functions preferred**: Same input → same output, no side effects
- **Explicit over implicit**: Clear dependencies, no magic
- **Type safety**: Use TypeScript strictly - no `any`, minimal `as` casting
- **Error handling**: Fail fast, provide helpful error messages
- **No dead code**: Delete unused code immediately, git preserves history

**React-Specific:**
- **Component size**: Keep components under 100 lines
- **Single responsibility**: One component = one clear purpose
- **Props over context**: Use Context sparingly, prefer explicit prop passing
- **Custom hooks**: Extract reusable logic into well-named hooks
- **Avoid prop drilling**: If passing props through 3+ levels, consider composition or context
- **Key prop**: Always provide stable keys for lists (never use index)

**Performance:**
- **Measure first**: Don't optimize without profiling
- **Avoid premature optimization**: Readability > micro-optimizations
- **React optimization**: Only memoize after identifying real performance issues
- **Bundle awareness**: Keep dependencies light, use dynamic imports for heavy features

**Security:**
- Sanitize user input (though minimal user input in a timer app)
- No inline event handlers in JSX (XSS prevention)
- Use `===` for comparisons (avoid type coercion bugs)
- Keep dependencies updated (security patches)

### Code Review Mindset
Before considering code "done":
- ✅ Does it solve the stated problem completely?
- ✅ Is it the simplest solution that could work?
- ✅ Can another developer understand it in 2 minutes?
- ✅ Are edge cases handled?
- ✅ Are there tests covering the core logic?
- ✅ Does it follow project conventions?
- ✅ Could any code be deleted?

## Development Workflow

### Change Process
Every code change should follow this workflow:

1. **Understand the Requirement**
   - Read the spec or issue completely
   - Ask questions if anything is ambiguous
   - Identify edge cases upfront

2. **Make the Change**
   - Write code following the practices above
   - Keep changes focused - one logical change per commit
   - Write self-documenting code with clear intent

3. **Test Thoroughly**
   - Run tests: `npm test` or `npm run test:watch`
   - Add new tests for new functionality
   - Ensure all tests pass before proceeding

4. **Build & Lint**
   - Build the app: `npm run build`
   - Run linter: `npm run lint`
   - Fix any errors or warnings (zero tolerance)
   - Type-check: `npm run type-check` or `tsc --noEmit`

5. **Visual Confirmation (UI Changes)**
   - Start dev server: `npm run dev`
   - Test the feature manually in browser
   - **Take screenshots using DevTools MCP** for all UI changes
   - Test on mobile viewport (DevTools responsive mode)
   - Verify accessibility (keyboard navigation, screen reader)

6. **Git Commit**
   - Review your changes: `git diff`
   - Stage relevant files: `git add <files>`
   - Commit with descriptive message:
     ```
     feat: add work/rest phase visual indicators

     - Display current phase prominently above timer
     - Use color coding (red for work, green for rest)
     - Animate phase transitions

     🤖 Generated with Claude Code
     Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
     ```
   - Commit frequently - small, atomic commits are better than large ones

### Iterative Development
- **Small increments**: Make small changes, test, commit, repeat
- **Immediate feedback**: Don't batch multiple changes before testing
- **Quick iterations**: Build → Test → Visual check → Commit → Next change
- **Fail fast**: Run tests and builds often to catch issues early

### Quality Gates
Never proceed to the next step if:
- ❌ Tests are failing
- ❌ Build has errors
- ❌ Linter reports errors
- ❌ TypeScript has type errors
- ❌ UI change not visually verified
- ❌ Functionality not manually tested

### Documentation During Development
- Update specs when implementation differs from design
- Add inline comments for complex algorithms
- Update README if setup process changes
- Take screenshots of UI states for reference

## Domain Context

### Workout Types

**Tabata:**
- 20 seconds of intense exercise, 10 seconds rest
- 8 rounds (4 minutes total)
- High-intensity intervals for cardio and fat burning
- Protocol developed by Dr. Izumi Tabata

**Circuit Training:**
- Multiple exercises performed in sequence
- Fixed time per exercise (e.g., 45s work, 15s transition)
- Minimal rest between exercises
- Complete multiple rounds of the circuit

**HIIT (High-Intensity Interval Training):**
- Alternating high-intensity bursts with recovery periods
- Flexible timing (e.g., 30s/30s, 40s/20s)
- Adaptable to any exercise modality

### AI Workout Generation

**Prompt Understanding:**
The AI should parse user prompts to extract:
- **Duration**: "30 minutes", "quick 20min", "1 hour"
- **Focus**: "leg day", "upper body", "full body", "cardio", "core"
- **Equipment**: "dumbbells", "bodyweight only", "kettlebell", "resistance bands"
- **Intensity**: "beginner", "advanced", "moderate"
- **Style**: "Tabata", "circuit", "HIIT", "strength"

**Workout Structure:**
Generated workouts should include:
- List of exercises in order
- Sets and reps (for strength) OR duration (for intervals)
- Rest periods between exercises
- Total estimated duration
- Equipment needed
- Difficulty level

**Exercise Selection Intelligence:**
- Vary muscle groups (don't overwork same muscles)
- Balance push/pull movements
- Include warm-up and cool-down suggestions
- Consider user's stated fitness level
- Avoid exercises requiring equipment user doesn't have

### Timer Accuracy
Timer precision is critical for workout effectiveness. The app should:
- Use high-precision timing (requestAnimationFrame or performance.now())
- Account for browser throttling (background tabs)
- Provide visual and audio feedback within 100ms accuracy
- Handle pause/resume without drift

### User Experience
- Large, readable countdown display
- Clear visual distinction between work/rest phases
- Audio cues that are not startling but noticeable
- Simple controls that work during intense exercise
- Mobile-friendly design (large touch targets)

## Important Constraints
- Must work offline (no external dependencies for core functionality)
- Must be responsive and work on mobile devices
- Audio must work across browsers (consider autoplay policies)
- Should handle browser tab backgrounding gracefully
- Keep bundle size small for fast loading

## External Dependencies
- **None required for MVP**: Core timer functionality uses Web APIs only
- **Potential future additions**:
  - Analytics service for usage tracking
  - Sound library for better audio cues
  - Workout history storage (localStorage or cloud sync)

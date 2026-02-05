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
**Superhero Comic Aesthetic**: Bold, dramatic, and powerful. Inspired by classic 90s Marvel/DC comics (Jim Lee, Todd McFarlane era) fused with the dark, cinematic tone of Batman and the kinetic energy of Spider-Verse. The app should feel like stepping into a comic book — thick outlines, halftone textures, speed lines, and explosive color — while remaining a fully functional, usable fitness app. Comic elements *enhance* the UI without overwhelming it.

**Core Influences** (mix, don't copy any single one):
- 90s X-Men / Marvel — bold primary colors, dynamic energy, saturated palettes
- Batman / dark heroes — deep blacks, moody atmosphere, neon accents on dark
- Spider-Verse — halftone dots, mixed media feel, vibrant on dark
- Classic comic printing — ben-day dots, offset shadows, thick panel borders

### Visual Style
- **Dark & Dramatic**: Deep black/dark purple base with neon accents (cyan, magenta, electric yellow). Feels like a comic panel lit by neon signs.
- **Comic-Themed UI**: Comic-inspired colors, fonts, borders, and textures that enhance a functional app. The comic elements are intentional accents, not wallpaper.
- **Bold Outlines & Hard Shadows**: Thick black borders (2-4px) on cards and containers. Offset drop shadows that evoke comic panel borders. No soft/blurred shadows.
- **Halftone & Speed Lines**: Classic halftone dot patterns as background textures. Radiating speed lines and starburst shapes for energy and emphasis. Both combined for full comic vocabulary.
- **High Contrast for Glanceability**: Neon-on-dark ensures readability during intense workouts. Timer numbers must be instantly readable from across a room.
- **Consistent Spacing**: Tailwind's spacing scale (4px base unit) — structure stays clean even when the aesthetic is bold.
- **Purposeful Motion**: Transitions and animations should feel dynamic and comic-like (snappy, not floaty). Phase transitions should feel like page turns.

### Color Palette
**Superhero Remix** for dramatic phase recognition:

*Timer Phase Colors:*
- **Work Phase**: Electric crimson/magenta (`#DC2626` → `#E11D48` / rose-600 to red-600)
  - Explosive, high energy. Background radiates intensity.
  - Speed lines and starburst effects amplify urgency.
- **Rest Phase**: Deep teal/cyan (`#06B6D4` → `#0891B2` / cyan-500 to cyan-600)
  - Cool, recovering. Calmer but still comic-styled.
  - Halftone dot pattern fades in, speed lines recede.
- **Prepare/Transition**: Vivid gold/amber (`#F59E0B` → `#D97706` / amber-500 to amber-600)
  - "Get ready" warning signal. Pulsing glow effect.

*UI Colors (Dark Theme Base):*
- **Background**: Near-black (`#0A0A0F` / custom) with subtle dark purple undertone
- **Surface/Cards**: Dark gray-purple (`#1A1A2E` / custom) — slightly lifted from background
- **Primary Action**: Electric cyan (`#06B6D4` / cyan-500) — start workout, generate, primary CTAs
- **Secondary Action**: Vivid magenta (`#E11D48` / rose-600) — destructive, stop, high-energy actions
- **Accent/Highlight**: Electric yellow (`#FACC15` / yellow-400) — achievements, badges, comic text effects
- **Text Primary**: White/near-white (`#F8FAFC` / slate-50)
- **Text Secondary**: Cool gray (`#94A3B8` / slate-400)
- **Success**: Neon green (`#22C55E` / green-500) — completed, achievements
- **Warning**: Amber (`#F59E0B` / amber-500) — alerts, cautions
- **Error**: Bright red (`#EF4444` / red-500) — errors, destructive states
- **Outline/Border**: Thick black (`#000000`) for comic panel borders; neon glow colors for interactive element borders

*UI Colors (Light Theme Variant):*
- **Background**: Off-white with subtle halftone dot texture (`#F8F8FC`)
- **Surface/Cards**: White with thick black comic borders and offset shadows
- **Primary Action**: Deep cyan (`#0891B2` / cyan-600)
- **Secondary Action**: Deep rose (`#BE123C` / rose-700)
- **Accent/Highlight**: Bold yellow (`#EAB308` / yellow-500)
- **Text Primary**: Near-black (`#0F172A` / slate-900)
- **Text Secondary**: Dark gray (`#475569` / slate-600)
- Light theme retains comic borders, halftone textures, and bold typography. The feel is "printed comic page" vs dark theme's "neon-lit comic panel."

*Both themes supported, user's choice. Dark is the flagship/default.*

### Typography

**Font Stack:**
- **Timer/Numbers & Headings**: Comic-style display font (Bangers via Google Fonts)
  - ALL-CAPS comic book lettering for headings, timer display, exercise names
  - Provides authentic comic energy without sacrificing readability
  - Tabular/monospace fallback for timer countdown to prevent number shifting: (JetBrains Mono, Roboto Mono, `font-mono`) with Bangers styling for the surrounding context
- **Body/UI Text**: Clean sans-serif (`font-sans` — Inter, SF Pro, Roboto)
  - Readable body text, form labels, descriptions
  - Provides contrast against the bold headings
  - Keeps forms and data-heavy screens legible

**Type Scale:**
- **Timer Countdown**: `text-9xl` (128px) on mobile, larger on desktop — Bangers or monospace tabular, with text-shadow glow effect matching phase color
- **Exercise Name**: `text-3xl` (30px) — Bangers, ALL-CAPS, comic styling
- **Section Headings**: `text-2xl` (24px) — Bangers, ALL-CAPS
- **Subheadings**: `text-xl` (20px) — Bangers or bold sans-serif
- **Body Text**: `text-base` (16px) — sans-serif, regular weight
- **Labels/Meta**: `text-sm` (14px) — sans-serif, medium weight
- **Captions**: `text-xs` (12px) — sans-serif, for timestamps, subtitles

**Font Weights:**
- Regular (400): Body text, descriptions (sans-serif)
- Medium (500): Labels, emphasized text (sans-serif)
- Semibold (600): Buttons, subheadings (sans-serif)
- Bold (700): All Bangers headings are inherently bold
- Extra Bold (800): Timer numbers (maximum impact)

### Comic Visual Effects

**Onomatopoeia / Comic Text Bursts:**
Comic-style text effects appear at key impactful moments only:
- **Workout Start**: "GO!" burst effect (starburst background, rotated text, yellow on dark)
- **Phase Transitions**: "SWITCH!" or "REST!" with speed-line background
- **Workout Complete**: "POW!" or "DONE!" explosion effect with confetti/starburst
- **Personal Record**: "BOOM!" or "NEW RECORD!" with impact lines
- These are CSS-animated overlays, not permanent UI elements. They appear briefly (1-2 seconds) and fade.
- Never show text bursts for mundane interactions (button clicks, navigation, form submits).

**Halftone Patterns:**
- Subtle halftone dot patterns as background textures on cards and sections
- CSS-generated using radial gradients (no image assets needed)
- More prominent in the timer view, subtler in management screens
- Pattern opacity: ~5-10% on cards, ~15-20% on timer backgrounds

**Speed Lines & Energy:**
- Radiating lines from the timer countdown during work phases
- CSS-generated using conic gradients or pseudo-elements
- Intensity scales with phase urgency (strongest during work, subtle during rest)
- Starburst/impact shapes behind key numbers and headings

### Component Design Principles
- **Mobile-First**: Design for phone screens first, scale up for desktop
- **Touch-Friendly**: Minimum 44x44px touch targets (Apple HIG guideline)
- **Thumb-Friendly**: Primary actions in bottom half of screen
- **Accessible**: WCAG 2.1 AA compliance minimum
  - Semantic HTML elements
  - ARIA labels where needed
  - Keyboard navigation support
  - Color is not the only indicator (use icons + text)
  - Neon-on-dark meets 4.5:1 contrast ratio minimum
  - `prefers-reduced-motion` disables speed lines, halftone animations, and text bursts
- **Comic Panel Cards**: Content grouped in cards with thick black borders (2-4px) and offset drop shadows (4px right, 4px down, solid black). Cards feel like comic panels.
- **Sharp Corners with Slight Round**: `rounded-md` (6px) — enough to avoid harsh edges but sharper than the previous soft rounded look. Some elements (badges, text bursts) use `rounded-none` for a raw comic feel.
- **Performance**: 60fps animations, no layout shifts. Halftone and speed line effects use CSS only (no canvas/JS).

### Layout Guidelines

*Navigation:*
- **Bottom Tab Bar** (mobile): Timer, Workouts, History, Profile — styled as comic panel segments with thick borders between items. Active tab glows with the primary accent color.
- **Side Nav** (desktop): Sidebar with comic-styled section headers (Bangers font, ALL-CAPS). Active item has a neon accent bar.
- **Always accessible**: Never hide navigation during workouts (timer full-screen mode is the exception, with a clear exit control).

*Timer View (The Action Panel):*
- **Full-Screen Mode**: The timer IS a comic action panel. Background fills with phase color, overlaid with halftone dots and radiating speed lines.
- **Centered Content**: Timer countdown centered, massive, glowing text shadow matching phase color.
- **Exercise Name**: Displayed in Bangers font above the timer in a comic caption box (dark background, white text, thick border).
- **Floating Controls**: Play/pause/skip buttons styled as bold comic-style buttons with thick outlines and hard shadows. High contrast against the phase background.
- **Phase Transitions**: Dramatic visual shift — colors change, speed lines animate, brief text burst ("REST!" / "GO!").

*Workout Generation:*
- **Prompt Input**: Dark card with thick border. Placeholder text in comic style ("Tell me your workout, hero...").
- **Quick Actions**: Chips styled as comic badges — bold outline, slight rotation for dynamism, accent colors.
- **Generated Output**: Exercises in comic panel card layout. Each exercise card has thick border, halftone background, exercise name in Bangers.

*Exercise Library:*
- **Grid Layout**: 2 columns on mobile, 3-4 on desktop. Each card is a comic panel.
- **Filter Chips**: Styled as comic badges with thick borders and accent colors.
- **Search Bar**: Sticky at top, thick outline, comic-styled focus state (glow + outline thickens).

*History/Analytics:*
- **Timeline View**: Reverse chronological, each entry styled as a mini comic panel with date caption.
- **Stats Cards**: Grid of metrics in bold comic panels. Key numbers in Bangers font with neon glow.
- **Charts**: Bold outlines on chart elements, comic color palette, halftone fills.

### Spacing & Rhythm
- **Screen Padding**: `px-4` (16px) on mobile, `px-8` (32px) on desktop
- **Component Gaps**: `gap-4` (16px) for related items, `gap-8` (32px) between sections
- **Card Padding**: `p-6` (24px) inside cards
- **Vertical Rhythm**: `space-y-6` (24px) between major sections
- **Border Widths**: `border-2` (2px) default, `border-3` or `border-4` (3-4px) for emphasis (cards, active elements)
- **Offset Shadows**: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` for comic panel effect

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
- **Database Client**: Supabase JS Client (TypeScript-first, type-safe queries with RLS)
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

### Technology Location Map

Track where core technologies are used. Update this when technologies change.

**Database & Data Layer:**
- Supabase Client: `src/lib/supabase/` (initialization, client creation)
- Database Queries: `src/lib/db/queries.ts`, `src/lib/actions/*.ts`
- Schema Migrations: `supabase/migrations/`
- Type Definitions: `src/lib/db/database.types.ts` (generated via `npm run db:types`)
- Seed Data: `supabase/seed.sql` or managed via Edge Functions
- RLS Policies: Defined in migration files

**Authentication:**
- Client Setup: `src/lib/supabase/` (server and client instances)
- Auth Utilities: `src/lib/supabase/auth.ts`
- Middleware: `src/middleware.ts` (route protection)
- Session Handling: Server Components use `createServerClient()`

**AI Integration:**
- Client & Prompts: `src/lib/ai/` (AI clients, prompt templates, utilities)
- Configuration: `.env.local` (API keys: `ANTHROPIC_API_KEY`, `OLLAMA_BASE_URL`)
- Type Definitions: `src/lib/ai/types.ts`
- Server Actions: `src/lib/actions/ai.ts` (workout generation)

**UI Components:**
- shadcn/ui Components: `src/components/ui/` (base components)
- Feature Components: `src/components/` (feature-specific components)
- Layouts: `src/app/` (Next.js app router layouts)

**Styling:**
- Tailwind Config: `tailwind.config.ts`
- Global Styles: `src/app/globals.css`
- Component Styles: Inline Tailwind classes

**Testing:**
- Unit Tests: `src/**/*.test.ts` (co-located with source)
- Integration Tests: `src/lib/actions/**/*.test.ts`
- Infrastructure Tests: `tests/database/` (database, RLS, migrations)
- E2E Tests: `e2e/` (Playwright tests)
- Test Utilities: `src/test/helpers/`

**Scripts & Tooling:**
- Build Scripts: `scripts/` (organized by category)
- Database Scripts: `npm run db:*` (migrations, types, seed)
- Package Management: `package.json` (dependencies and scripts)

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

## Architecture Principles

### Design for the 10th Instance
When adding the first of something (test, component, route, script, utility), design as if 10 already exist.

**Ask before implementing:**
- Where will the 2nd, 5th, 10th instance go?
- What categories/structure will emerge?
- How will developers find and maintain these?
- What prevents fragmentation/inconsistency?

### The "One vs Many" Heuristic
- **Truly one-off**: Simple, inline solutions OK (rare)
- **First of many**: Requires structure, naming conventions, scalable patterns

### Red Flags Requiring Structure
When you encounter these situations, STOP and design a scalable structure first:

- Creating a new file type/category (e.g., first test, first script)
- Adding configuration or tooling
- Introducing a new concern (testing, validation, migrations, scripts)
- Pattern others will copy
- Anything in a shared/common directory

### Scale Checkpoint Questions
Before implementing the first instance of anything, answer these:

1. **Will there be more of these?**
   - Tests, scripts, configs, routes, components, utilities
   - If "probably yes" → design structure now
   - If "definitely no" → inline is fine

2. **What structure scales to 10+ instances?**
   - Categories/taxonomy (by type, by feature, by purpose)
   - Naming conventions (prefixes, suffixes, patterns)
   - Directory organization (flat vs nested, grouping logic)
   - Discovery mechanisms (how do people find these?)

3. **How will this be maintained?**
   - Easy to add new instances without guidance
   - Clear patterns to follow
   - Prevents drift and inconsistency
   - Self-documenting structure

4. **Where does the 10th one go?**
   - If you can't answer confidently, the structure isn't ready
   - Don't start implementing until this is clear

### Examples

**✅ Good: First test requires full test taxonomy**
```
Situation: Creating first RLS policy test

Bad approach:
scripts/test-rls.ts  ← Where do more tests go?

Good approach:
1. Design test taxonomy first
2. Create directories: tests/database/, src/test/helpers/, e2e/
3. Document test types (unit, integration, infrastructure, e2e)
4. Create helper patterns (test-db.ts, fixtures.ts)
5. Configure test runners (vitest workspace)
6. Then implement RLS test in tests/database/rls-policies.test.ts
```

**✅ Good: First API route establishes routing conventions**
```
Situation: Adding first API endpoint

Bad approach:
app/api/generate.ts  ← How do we organize more endpoints?

Good approach:
1. Design API structure first
2. Organize by feature: app/api/[feature]/[action]/route.ts
3. Document naming patterns
4. Create shared middleware/utils
5. Then implement: app/api/workouts/generate/route.ts
```

**✅ Good: First utility function creates category system**
```
Situation: Adding time formatting function

Bad approach:
lib/utils.ts  ← This becomes a junk drawer

Good approach:
1. Identify utility categories: time, string, array, validation
2. Create lib/utils/time.ts, lib/utils/string.ts, etc.
3. Each with co-located tests
4. Then implement formatDuration in lib/utils/time.ts
```

### Anti-Patterns to Avoid

- ❌ Single flat directory that will grow (`/scripts/`, `/utils/`)
- ❌ Numbered files without categories (`test1.ts`, `test2.ts`, `script1.ts`)
- ❌ "Utils" or "helpers" without subcategories (becomes junk drawer)
- ❌ One-off solutions without documented patterns
- ❌ "I'll organize it later when we have more" (you won't)
- ❌ Copying files without a template/pattern system

### Documentation Requirements

When creating the first instance of a pattern, document:

1. **In design.md or project.md:**
   - What this category is for
   - Where new instances go
   - Naming conventions
   - Examples

2. **In code:**
   - README in new directories
   - Comments in template/example files
   - Clear file naming that shows the pattern

3. **In specs (if architectural):**
   - Create openspec/specs/[category]/spec.md
   - Define requirements for structure
   - Include scenarios showing usage

### Complexity Triggers

Only add structural complexity when:
- **Multiple proven instances**: Have 2-3 real examples before abstracting
- **Clear categories emerge**: Natural groupings are obvious
- **Maintenance burden exists**: Ad-hoc approach causes confusion
- **Growth is certain**: You know more are coming

Don't over-engineer:
- Not everything needs a framework
- Simple patterns > complex systems
- Boring solutions > clever architectures
- Delete code aggressively

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

# Design Document: Personal Trainer App MVP

## Context

Building a greenfield AI-powered personal trainer application that combines workout generation with interval timer functionality. The app targets fitness enthusiasts who want personalized workout guidance without hiring a personal trainer.

**Key Constraints:**
- Must work reliably without AI (fallback to templates)
- Timer accuracy is critical (within 100ms)
- Mobile-first design (primary use case is phone during workouts)
- Cost-conscious (minimize API costs during development)
- Fast initial load (<3s first contentful paint)

**Stakeholders:**
- End users: Fitness enthusiasts wanting guided workouts
- Developers: Need clean architecture for maintenance
- Product: Fast time-to-market with quality MVP

## Goals / Non-Goals

**Goals:**
- ✅ Deliver complete MVP with all 5 core capabilities functional
- ✅ Establish scalable architecture for future features
- ✅ Ensure timer works flawlessly (most critical feature)
- ✅ Keep bundle size minimal (<100KB initial)
- ✅ Support local development without API costs
- ✅ Deploy production-ready app to Vercel
- ✅ Pass WCAG 2.1 AA accessibility standards

**Non-Goals:**
- ❌ Mobile native apps (web-only for MVP)
- ❌ Offline functionality (requires network)
- ❌ Social features or user-to-user interactions
- ❌ Video content for exercises (images/text only)
- ❌ Wearable device integration
- ❌ Advanced analytics/charting (basic stats only)

## Architectural Decisions

### Decision 1: Full-Stack Next.js with App Router

**Rationale:**
- Single codebase for frontend and backend reduces complexity
- Server Components provide fast initial loads with less JavaScript
- Server Actions eliminate API boilerplate for mutations
- Shared TypeScript types across frontend/backend
- Vercel deployment optimized for Next.js

**Alternatives Considered:**
- **Separate React frontend + Express backend**: More complexity, two deployments, duplicated types
- **Next.js Pages Router**: Less performant, older patterns, no Server Components
- **Remix**: Less mature ecosystem, smaller community, fewer hosting options

**Trade-offs:**
- ➕ Simpler deployment and development
- ➕ Better performance with Server Components
- ➕ Reduced JavaScript bundle size
- ➖ Locked into Next.js ecosystem
- ➖ Learning curve for App Router patterns

### Decision 2: Supabase for Database and Auth

**Rationale:**
- Managed PostgreSQL eliminates ops overhead
- Built-in authentication with multiple providers
- Row Level Security for data isolation
- Realtime capabilities (future enhancement)
- Free tier sufficient for MVP validation

**Alternatives Considered:**
- **Firebase**: Less SQL flexibility, vendor lock-in concerns, less control over data model
- **AWS RDS + Cognito**: More configuration, higher complexity, overkill for MVP
- **PlanetScale + Clerk**: More vendors, higher monthly cost, less integrated

**Trade-offs:**
- ➕ Fast setup with minimal configuration
- ➕ Built-in auth reduces code we need to write
- ➕ PostgreSQL provides robust data model
- ➕ RLS provides security at database level
- ➖ Vendor lock-in (but data is exportable)
- ➖ Limited customization of auth flows

### Decision 3: Dual-Mode AI (Claude API + Ollama Local)

**Rationale:**
- Claude API provides high-quality production generation
- Ollama enables free local development and testing
- Environment variable switches between modes seamlessly
- Reduces API costs during development iteration
- Rule-based fallback ensures functionality without AI

**Alternatives Considered:**
- **OpenAI GPT-4**: Similar quality and cost, but Claude has better structured output and tool use
- **Only cloud AI**: Expensive during development, rate limits slow iteration
- **Only local AI**: Lower quality outputs, may not meet user expectations

**Trade-offs:**
- ➕ No API costs during development
- ➕ High quality production outputs
- ➕ Graceful degradation without AI
- ➖ Developers must install Ollama locally
- ➖ Two AI code paths to maintain

### Decision 4: Drizzle ORM over Prisma

**Rationale:**
- Lightweight and performant (no runtime overhead)
- SQL-like syntax feels natural for complex queries
- Better TypeScript inference
- Smaller bundle size impact
- Excellent PostgreSQL support

**Alternatives Considered:**
- **Prisma**: More popular, better documentation, but heavier runtime and less control over SQL
- **Raw SQL**: Maximum control but loses type safety and increases boilerplate
- **Kysely**: Similar to Drizzle but smaller ecosystem

**Trade-offs:**
- ➕ Type-safe queries with minimal overhead
- ➕ Full control over SQL when needed
- ➕ Better performance than Prisma
- ➖ Smaller community and fewer resources
- ➖ Steeper learning curve for developers unfamiliar with SQL

### Decision 5: shadcn/ui Component Library

**Rationale:**
- Copy-paste components (no runtime dependency)
- Built on Radix UI primitives (accessibility built-in)
- Full customization control (own the code)
- Tailwind CSS based (matches tech stack)
- Modern, polished design out of box

**Alternatives Considered:**
- **Material UI**: Heavy bundle size, opinionated styling, harder to customize
- **Chakra UI**: Runtime dependency, less control over code
- **Headless UI**: Lower-level, requires more custom styling work
- **Custom from scratch**: Time-consuming, likely lower quality

**Trade-offs:**
- ➕ Zero runtime dependency (just copy code)
- ➕ Full control and customization
- ➕ Excellent accessibility defaults
- ➕ Beautiful default styling
- ➖ Need to manually update component code
- ➖ More files in codebase

### Decision 6: Co-Located Tests

**Rationale:**
- Tests live next to code they test (e.g., `Timer.tsx` and `Timer.test.tsx`)
- Easier to find and maintain tests
- When deleting code, naturally delete tests too
- Simpler import paths
- Industry best practice in modern projects

**Alternatives Considered:**
- **Separate test directory**: Tests separated from implementation, harder to maintain sync
- **Test directory mirroring structure**: Duplicates directory tree, complex paths

**Trade-offs:**
- ➕ Better test discoverability
- ➕ Encourages testing (tests are visible)
- ➕ Simpler imports
- ➖ Slightly more files in each directory
- ➖ Need build configuration to exclude tests

## Technical Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User's Browser                        │
├─────────────────────────────────────────────────────────────┤
│  React Components (Client)     │  Server Components         │
│  - Timer (interactive)          │  - Workout lists           │
│  - Exercise search              │  - History timeline        │
│  - Form inputs                  │  - Exercise library        │
└──────────────┬──────────────────┴─────────────┬─────────────┘
               │                                │
               │ Server Actions                 │ Data Fetching
               │ (mutations)                    │ (SSR)
               │                                │
┌──────────────▼────────────────────────────────▼─────────────┐
│                    Next.js App Router                        │
│  - Server Actions      - Route Handlers    - Middleware     │
└──────────────┬────────────────────┬─────────────────────────┘
               │                    │
               │                    │ AI Generation
               │                    ▼
               │            ┌─────────────────┐
               │            │  AI Services    │
               │            │  - Claude API   │
               │            │  - Ollama       │
               │            │  - Fallback     │
               │            └─────────────────┘
               │
               │ Database Queries
               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Supabase Backend                         │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database   │   Supabase Auth   │  Storage       │
│  - Row Level Security  │   - Sessions      │  - Images      │
│  - Drizzle ORM        │   - OAuth         │                │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Examples

**Workout Generation Flow:**
```
1. User enters prompt in UI (Client Component)
2. Form submits to Server Action
3. Server Action:
   a. Verifies user authentication
   b. Checks rate limit (10/hour)
   c. Calls AI service (Claude or Ollama)
   d. Validates generated workout structure
   e. Falls back to templates if AI fails
   f. Saves workout to database
   g. Returns workout to client
4. Client displays generated workout
5. User can start timer with workout
```

**Timer Session Flow:**
```
1. User loads timer page (Server Component)
2. Server fetches workout data (if applicable)
3. Client Component initializes timer state
4. Timer runs with requestAnimationFrame:
   - Updates countdown every frame
   - Triggers audio at phase transitions
   - Updates exercise display
5. On completion, calls Server Action:
   - Saves workout history
   - Updates user statistics
6. Redirects to history page with success message
```

### Database Schema

**Core Tables:**

```typescript
// users (extended from Supabase auth.users)
users {
  id: uuid (PK, references auth.users)
  display_name: text
  created_at: timestamp
  updated_at: timestamp
}

// exercises
exercises {
  id: uuid (PK)
  name: text (unique)
  instructions: text
  muscle_groups: text[] (array)
  difficulty: text (beginner|intermediate|advanced)
  equipment: text (bodyweight|dumbbells|kettlebell|bands|...)
  form_tips: text
  image_url: text (nullable)
  created_at: timestamp
}

// workouts
workouts {
  id: uuid (PK)
  user_id: uuid (FK -> users.id)
  name: text
  description: text (nullable)
  duration: integer (minutes)
  difficulty: text
  exercises: jsonb (array of exercise objects)
  prompt: text (nullable, original prompt used)
  generated_by: text (ai|template|manual)
  created_at: timestamp
}

// workout_history
workout_history {
  id: uuid (PK)
  user_id: uuid (FK -> users.id)
  workout_id: uuid (FK -> workouts.id, nullable)
  workout_snapshot: jsonb (copy of workout at time of completion)
  status: text (completed|abandoned)
  duration_seconds: integer (actual time spent)
  completed_at: timestamp
  notes: text (nullable)
}

// user_preferences
user_preferences {
  id: uuid (PK)
  user_id: uuid (FK -> users.id, unique)
  default_work_duration: integer (seconds)
  default_rest_duration: integer (seconds)
  audio_enabled: boolean
  preferred_equipment: text[] (array)
  updated_at: timestamp
}
```

**Row Level Security Policies:**

```sql
-- workouts: users can only see their own
CREATE POLICY workouts_select ON workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY workouts_insert ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- workout_history: users can only see their own
CREATE POLICY history_select ON workout_history
  FOR SELECT USING (auth.uid() = user_id);

-- exercises: public read, admin write (future)
CREATE POLICY exercises_select ON exercises
  FOR SELECT USING (true);

-- user_preferences: users can only access their own
CREATE POLICY prefs_select ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);
```

### Timer Implementation Details

**High-Precision Timing Strategy:**

```typescript
// Use requestAnimationFrame for smooth updates
// Use performance.now() for accurate timing
// Handle background tab throttling

interface TimerState {
  isRunning: boolean
  currentPhase: 'prepare' | 'work' | 'rest'
  remainingSeconds: number
  currentInterval: number
  totalIntervals: number
  startTime: number | null
  pausedTime: number
  workoutId: string | null
}

// Key implementation:
// 1. Track elapsed time instead of decrementing counter
// 2. Calculate remaining based on elapsed time
// 3. Handle page visibility changes
// 4. Sync with server on completion
```

**Background Tab Handling:**
```typescript
// Use Page Visibility API
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Tab backgrounded - store current state
    storeTimerState()
  } else {
    // Tab focused - recalculate time
    recalculateTimeFromStoredState()
  }
})
```

### AI Integration Architecture

**Unified Interface:**

```typescript
interface WorkoutGenerator {
  generate(prompt: string, userId: string): Promise<Workout>
}

class ClaudeGenerator implements WorkoutGenerator {
  async generate(prompt: string, userId: string): Promise<Workout> {
    // Call Claude API with structured output
  }
}

class OllamaGenerator implements WorkoutGenerator {
  async generate(prompt: string, userId: string): Promise<Workout> {
    // Call local Ollama instance
  }
}

class TemplateFallback implements WorkoutGenerator {
  async generate(prompt: string, userId: string): Promise<Workout> {
    // Match prompt to template rules
  }
}

// Factory pattern based on environment
function getGenerator(): WorkoutGenerator {
  if (process.env.AI_MODE === 'local') return new OllamaGenerator()
  return new ClaudeGenerator()
}

// Wrapper with fallback
async function generateWorkout(prompt: string, userId: string): Promise<Workout> {
  try {
    return await getGenerator().generate(prompt, userId)
  } catch (error) {
    console.error('AI generation failed, using fallback', error)
    return await new TemplateFallback().generate(prompt, userId)
  }
}
```

## Risks / Trade-offs

### Risk 1: Timer Accuracy on Low-End Devices
**Impact:** High (core functionality)
**Likelihood:** Medium
**Mitigation:**
- Use requestAnimationFrame (browser-optimized)
- Test on variety of devices
- Fallback to setInterval if RAF unavailable
- Set performance budgets and test against them

### Risk 2: AI API Costs in Production
**Impact:** Medium (affects profitability)
**Likelihood:** Medium
**Mitigation:**
- Implement strict rate limiting (10/hour)
- Cache common workout patterns
- Monitor API usage with alerts
- Template fallback reduces dependency
- Consider tiered pricing if popular

### Risk 3: Database Connection Limits (Serverless)
**Impact:** High (app breaks under load)
**Likelihood:** Low (unlikely to hit limits in MVP)
**Mitigation:**
- Use Supabase connection pooling (Supavisor)
- Limit concurrent connections in Drizzle config
- Monitor connection usage
- Scale up Supabase plan if needed

### Risk 4: Audio Autoplay Blocking
**Impact:** Medium (degrades experience)
**Likelihood:** High (common browser policy)
**Mitigation:**
- Require user interaction before first audio play
- Show clear instructions on first use
- Provide visual-only option
- Test across browsers and document behavior

### Risk 5: OAuth Provider Rate Limits
**Impact:** Low (affects onboarding)
**Likelihood:** Low
**Mitigation:**
- Also offer email/password and magic links
- Monitor OAuth failures
- Clear error messages if provider unavailable

## Performance Budget

**Initial Load:**
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Initial JS bundle: <100KB gzipped

**Runtime:**
- Timer updates: 60fps (16.67ms per frame)
- Timer accuracy: <100ms drift
- Route transitions: <500ms

**Bundle Breakdown:**
- Timer component: <20KB
- Exercise library: Lazy loaded
- Charts/analytics: Lazy loaded
- Total main bundle: <100KB

## Security Considerations

**Authentication:**
- HTTP-only cookies (prevents XSS)
- Session tokens stored securely
- CSRF protection via Next.js built-ins
- Never trust client-side auth state

**Data Access:**
- Row Level Security enforced at database level
- Server-side auth checks in all Server Actions
- Validate all user inputs with Zod schemas
- Rate limit AI endpoints

**API Keys:**
- Never expose in client code
- Use NEXT_PUBLIC_ only for truly public vars
- Rotate keys regularly
- Store in Vercel encrypted env vars

**Input Sanitization:**
- Sanitize AI-generated content before rendering
- Validate workout structures
- Escape user-generated content
- No eval() or innerHTML with user data

## Migration Plan

**Phase 1: Initial Setup (Week 1)**
- Set up repositories and environments
- Initialize Next.js and Supabase
- Configure CI/CD pipeline
- Deploy "Hello World" to verify stack

**Phase 2: Core Features (Weeks 2-4)**
- Implement authentication (Week 2)
- Build timer and audio system (Week 3)
- Create exercise library and AI generation (Week 4)

**Phase 3: Integration (Week 5)**
- Connect workout generation to timer
- Implement workout history tracking
- Build user preferences

**Phase 4: Testing and Polish (Week 6)**
- Comprehensive testing pass
- Accessibility review
- Performance optimization
- Bug fixes and polish

**Phase 5: Launch (Week 7)**
- Production deployment
- Documentation
- Monitoring setup
- Launch to limited users for feedback

**Rollback Plan:**
- Git tags for each phase
- Database migrations are reversible
- Vercel supports instant rollback to previous deployment
- Can disable AI features via environment variable

## Open Questions

1. **Exercise Images:** Where to source/host exercise images?
   - **Options:** Stock photos, AI-generated, third-party API, or text-only for MVP
   - **Recommendation:** Text-only for MVP, add images in v2

2. **Workout Templates:** How many fallback templates needed?
   - **Recommendation:** Start with 10 templates covering common requests

3. **Analytics Tool:** Which analytics service to use?
   - **Options:** Vercel Analytics (built-in), Google Analytics, Plausible
   - **Recommendation:** Start with Vercel Analytics (simplest)

4. **Error Tracking:** Production error monitoring?
   - **Options:** Sentry, LogRocket, Vercel error tracking
   - **Recommendation:** Start with Vercel built-in, add Sentry if needed

5. **User Onboarding:** Should we have an onboarding flow?
   - **Recommendation:** Not for MVP, add if users are confused

## Success Metrics

**Technical Metrics:**
- [ ] All tests passing (>80% coverage core features)
- [ ] Build completes without errors
- [ ] Lighthouse score >90 on all metrics
- [ ] Zero critical security vulnerabilities
- [ ] <100KB initial bundle size

**Functional Metrics:**
- [ ] Users can register and login successfully
- [ ] Users can generate workouts with AI
- [ ] Timer runs accurately (<100ms drift)
- [ ] Workout history saves correctly
- [ ] Exercise library is searchable and usable

**User Experience Metrics:**
- [ ] WCAG 2.1 AA compliant
- [ ] Works on mobile and desktop
- [ ] Fast page loads (<3s TTI)
- [ ] Clear error messages
- [ ] Intuitive navigation

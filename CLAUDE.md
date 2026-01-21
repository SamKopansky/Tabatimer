<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## Branch Management & Development Workflow

### Critical Rule: Always Start with Fresh Branch from Latest Main

**Before starting ANY new development work, you MUST ensure you're working from a clean, up-to-date feature branch.**

This prevents merge conflicts, ensures you're building on the latest code, and maintains a clean git history.

### When This Applies

**You MUST run this workflow before:**
- Starting any new feature or bug fix
- Beginning implementation of an OpenSpec proposal
- Starting a refactoring task
- Any time you're about to write or modify code

**This checkpoint applies when:**
- User asks to implement a new feature
- User asks to fix a bug
- You're about to start coding based on a proposal
- Beginning any development work session
- Resuming work after a break

### Required Pre-Development Workflow

When starting new development work:

1. **Check Current Branch**:
   ```bash
   git branch --show-current
   ```
   - If on `main` → proceed to step 2
   - If on an old feature branch → ask user if work is complete, then proceed to step 2

2. **Check Working Directory Status**:
   ```bash
   git status --short
   ```
   - If clean → proceed to step 3
   - If uncommitted changes exist → ask user how to proceed:
     - Commit changes?
     - Stash changes?
     - Discard changes?

3. **Switch to Main and Pull Latest**:
   ```bash
   git checkout main
   git pull origin main
   ```

4. **Create New Feature Branch**:
   ```bash
   git checkout -b feature/descriptive-name
   ```
   - Branch naming conventions:
     - `feature/add-user-settings` (new features)
     - `fix/login-error` (bug fixes)
     - `refactor/auth-system` (refactoring)
     - `docs/update-readme` (documentation)
   - Use kebab-case
   - Be descriptive but concise
   - Include issue number if applicable: `feature/123-add-user-settings`

5. **Confirm Setup**:
   ```bash
   git status
   ```
   - Verify you're on the new branch
   - Verify working directory is clean
   - Ready to start development

### Integration with TodoWrite

**Always include branch setup as first todos when starting new work:**

```markdown
- [ ] 0.0 Branch Setup: Verify clean state and create feature branch
- [ ] 0.1 Architecture: Is this first of a pattern? Design for 10+
- [ ] 1.1 Implementation: [actual feature work]
```

**Mark branch setup complete only after:**
- New feature branch created from latest main
- Working directory is clean
- Ready to begin implementation

### Examples

#### ✅ Correct: Starting New Feature

```
User: "Add a user settings page"

Your workflow:
1. ✅ Check current branch: git branch --show-current
   → Currently on: main
2. ✅ Check status: git status --short
   → Clean working directory
3. ✅ Pull latest: git pull origin main
   → Already up to date
4. ✅ Create branch: git checkout -b feature/add-user-settings
   → Switched to new branch
5. ✅ Add to TodoWrite:
   - [x] 0.0 Branch Setup: Create feature branch from main
   - [ ] 0.1 Architecture: Design settings page structure
   - [ ] 1.1 Implementation: Create settings page component
6. ✅ NOW ready to begin implementation
```

#### ✅ Correct: Uncommitted Changes Found

```
User: "Add email validation"

Your workflow:
1. ✅ Check current branch: git branch --show-current
   → Currently on: feature/old-work
2. ✅ Check status: git status --short
   → Found uncommitted changes in 3 files
3. ✅ Ask user: "I see uncommitted changes on feature/old-work branch.
   Would you like to:
   A) Commit these changes first
   B) Stash them for later
   C) Discard them

   After we handle these, I'll create a fresh branch from main for the email validation work."
4. ✅ Wait for user decision
5. ✅ Handle changes per user's choice
6. ✅ Then proceed with branch creation workflow
```

#### ❌ Wrong: Starting Without Checking

```
User: "Add email validation"

Wrong approach:
1. ❌ Immediately start reading files
2. ❌ Make changes on current branch (whatever it is)
3. ❌ Don't check git status
4. ❌ Don't pull latest changes

Problems:
- May be on old feature branch
- May be missing latest changes from main
- May have uncommitted work from previous task
- Will cause merge conflicts later
- No clean git history
```

#### ❌ Wrong: Skipping Pull

```
User: "Fix the login bug"

Wrong approach:
1. ✅ Check branch (on main)
2. ❌ Skip git pull
3. ❌ Create branch immediately: git checkout -b fix/login-bug
4. ❌ Start coding

Problems:
- Not working from latest code
- Bug might already be fixed
- Building on outdated base
- Will have to resolve conflicts later
```

### Red Flags - Stop Immediately

If you find yourself doing any of these, STOP:

- ❌ Starting implementation without checking current branch
- ❌ Making changes directly on main branch
- ❌ Creating new branch without pulling latest main first
- ❌ Ignoring uncommitted changes from previous work
- ❌ Assuming you're already on the right branch
- ❌ Skipping git status check before starting
- ❌ Creating branch with generic names like `feature/new-stuff` or `fix/bug`

### Special Cases

#### Working on Existing Feature Branch

If user explicitly wants to continue work on an existing branch:
- Ask them to confirm the branch name
- Pull latest for that branch: `git pull origin <branch-name>`
- Check for any conflicts with main
- Proceed with development

#### Hotfix on Main

Only in true emergencies should you work directly on main:
- Critical production bug
- Immediate security fix
- User explicitly requests it

Even then, prefer creating a `hotfix/` branch.

### Enforcement Checklist

Before writing ANY code, verify:

- [ ] Current branch checked
- [ ] Working directory status verified (clean or handled)
- [ ] On main branch
- [ ] Latest changes pulled from main
- [ ] New feature branch created with descriptive name
- [ ] Confirmed on new branch with `git status`
- [ ] TodoWrite updated with branch setup task marked complete

### Summary

> **Core principle: Every new development task starts from a clean, up-to-date feature branch.**
>
> This is mandatory. This is non-negotiable.
>
> Check branch. Check status. Pull latest. Create feature branch.
>
> Only then can you confidently start development.
>
> This prevents conflicts, ensures latest code, and maintains clean history.

## Server Actions Organization

### Critical Rule: Organize Actions by Feature Domain

**Server Actions MUST be organized by the feature they serve, not by technical function.**

See `docs/SERVER_ACTIONS.md` for complete guidance.

### Quick Reference

**File Naming Pattern:**
```
Page/Feature → Actions File
- Profile page → src/actions/profile.ts
- Workout management → src/actions/workouts.ts
- Exercise library → src/actions/exercises.ts
```

**What Goes Where:**
- `auth.ts` - Authentication flows (login, signup, password reset, email verification)
- `profile.ts` - User profile management (update profile, upload avatar, delete account)
- `workouts.ts` - Workout operations (generate, save, delete, duplicate)
- `exercises.ts` - Exercise operations (search, filter, favorite)
- `history.ts` - Workout history (list, create, delete, export)

**When to Create New File:**
1. Creating a new page with backend operations
2. Grouping related operations for a feature
3. Existing file exceeds ~300 lines
4. Operations are conceptually distinct

**File Structure:**
```typescript
'use server'
// Imports
// Type definitions (local to file)
// Validation schemas (co-located)
// Exported action functions
```

**Before Creating First Action:**
- Read `docs/SERVER_ACTIONS.md`
- Check existing actions files for patterns
- Ask: "What page/feature does this serve?" → That's your file name

## Architectural Thinking

### Critical Rule: Design for Scale From the Start

**Before creating ANYTHING new, ask: "Where does the 10th one go?"**

If you can't answer confidently, STOP. The structure isn't ready.

### When This Applies

**EVERY TIME you create the first instance of something:**
- First test file
- First script
- First API route
- First utility function
- First component in a new category
- First config file
- First database migration
- First hook
- First of any file type or pattern

**This is NOT optional.** You MUST design for 10+ instances before implementing the first one.

### Required Steps for First Instance

When you recognize you're creating the first of something:

1. **Pause implementation** - Do not write code yet

2. **Design the structure:**
   - Where will instances 2-10 go?
   - What categories/subcategories are needed?
   - What naming conventions will be used?
   - How will developers find these files?

3. **Create scaffolding:**
   - Directory structure
   - README files explaining organization
   - Example/template files
   - Helper utilities if needed

4. **Document the pattern:**
   - In `openspec/project.md` (if architectural)
   - In `design.md` (if part of a change proposal)
   - In directory README files
   - Show clear examples

5. **Then implement** - Now you can create the first instance

### Red Flags - Stop Immediately

If you find yourself doing any of these, STOP:

- ❌ Creating `scripts/test-something.ts` (where do more tests go?)
- ❌ Adding to `lib/utils.ts` without categories (junk drawer forming)
- ❌ Creating `component-1.tsx`, `component-2.tsx` (no structure)
- ❌ Copying a file to make a new one (need templates/patterns)
- ❌ Can't decide where file goes (no clear structure)
- ❌ Thinking "I'll organize later" (you won't)

### Concrete Examples

#### ✅ Correct: First Test File

```
User: "Create a test for RLS policies"

Your thought process:
1. This is the first test in the project
2. There will definitely be more tests
3. I need to design complete test taxonomy
4. Tests fall into categories: unit, integration, infrastructure, e2e

Your actions:
1. Design test structure:
   - src/**/*.test.ts (co-located unit tests)
   - src/lib/actions/**/*.test.ts (integration tests)
   - tests/database/ (infrastructure tests)
   - e2e/ (e2e tests)
2. Create test helpers: src/test/helpers/
3. Set up Vitest workspace configuration
4. Document in docs/TESTING.md
5. Create npm scripts (test:unit, test:integration, etc.)
6. NOW implement: tests/database/rls-policies.test.ts
```

#### ❌ Wrong: Quick Solution

```
User: "Create a test for RLS policies"

Wrong approach:
1. Create scripts/test-rls.ts
2. Write test code
3. Done!

Problems:
- Where do unit tests go?
- Where do integration tests go?
- Where do E2E tests go?
- No structure for growth
- Future tests will be inconsistent
```

#### ✅ Correct: First Utility Function

```
User: "Add a function to format time durations"

Your thought process:
1. This is the first utility function
2. Apps need many utilities
3. Need category system from the start

Your actions:
1. Design utility categories:
   - lib/utils/time.ts (time formatting, parsing)
   - lib/utils/string.ts (string manipulation)
   - lib/utils/array.ts (array helpers)
   - lib/utils/validation.ts (input validation)
2. Each with co-located .test.ts file
3. Document in project.md
4. NOW implement: formatDuration() in lib/utils/time.ts
```

### Integration with Workflow

**In your TodoWrite planning:**

Always include architecture checkpoints as first todos:

```markdown
- [ ] 0.1 Architecture: Is this first of a pattern? Design for 10+
- [ ] 0.2 Structure: Create directory organization
- [ ] 0.3 Conventions: Document naming and patterns
- [ ] 1.1 Implementation: [actual feature work]
```

**Before any file creation:**

Ask yourself:
1. Is this the first of its kind?
2. Will there be more?
3. Where do the next 9 go?
4. Is the structure documented?

If any answer is unclear, design structure first.

### Anti-Patterns to Never Use

- ❌ Flat directories that will grow (`/scripts/`, `/utils/`)
- ❌ Numbered files (`test-1.ts`, `util2.ts`)
- ❌ "New" or "temp" in filenames
- ❌ Utils/helpers without subcategories
- ❌ "I'll organize later when we have more"
- ❌ Parallel structures (`scripts/` + `tools/` + `bin/`)

### Resources

See these files for detailed guidance:
- `docs/SCALABILITY_TRIGGERS.md` - When to think architecturally
- `openspec/project.md` - Architecture Principles section
- `openspec/AGENTS.md` - Scale Checkpoint in Stage 2 workflow
- `docs/TESTING.md` - Example of proper test structure

### Summary

> **Core principle: When creating the first instance of ANYTHING, design as if 10 already exist.**
>
> This is not optional. This is not "nice to have."
>
> This is a mandatory part of your workflow.
>
> Stop. Design. Document. Then implement.

## Refactor Detection & Planning

### Critical Rule: Detect Refactors Before Starting

**When you notice ANY of these patterns, STOP immediately:**

**Trigger Phrases:**
- "Switch from X to Y"
- "Replace all instances"
- "Migrate to..."
- "Refactor the..."
- "Standardize..."
- "Change [convention] throughout"
- "Remove [widely-used thing]"
- "Make [X] consistent"

**Trigger Situations:**
- Change affects 5+ files in coordinated way
- Removing something used in multiple places
- Changing a pattern/convention applied throughout code
- Task could leave things broken if not done completely
- You're thinking "I'll need to update this everywhere"

### When Triggers Detected

**DO NOT** proceed with implementation. Instead:

1. **Pause and announce:**
   ```
   🛑 REFACTOR DETECTED
   This requires systematic planning before implementation.
   ```

2. **Read `docs/REFACTORING.md`** in full

3. **Follow the Refactor Workflow:**
   - Step 0: Recognition & Pause ← YOU ARE HERE
   - Step 1: Discovery (create inventory document)
   - Step 2: User Approval
   - Step 3: Implementation Planning
   - Step 4: Systematic Implementation
   - Step 5: Validation

4. **Create discovery document** before writing ANY code

### Example: Detecting a Refactor

```
User: "Let's switch from Drizzle to Supabase for database queries"

❌ WRONG approach:
- Remove drizzle from package.json
- Update a few obvious files
- Hope nothing breaks

✅ CORRECT approach:
- Recognize refactor trigger: "switch from X to Y"
- Announce: "This is a refactor affecting multiple areas"
- Create docs/refactors/drizzle-to-supabase-2026-01-11.md
- Inventory:
  - All files importing from drizzle
  - All query functions
  - All tests
  - All docs mentioning drizzle
  - All config files
- Present discovery to user for approval
- Create implementation plan (OpenSpec or TodoWrite)
- Execute systematically
- Validate completeness before declaring done
```

### Integration with Scale Checkpoint

You now have TWO mandatory checkpoints:

1. **Scale Checkpoint** (creation) - "Where does the 10th one go?"
   - Triggers: Creating FIRST instance of something
   - Purpose: Design for growth from the start

2. **Refactor Checkpoint** (modification) - "What are ALL the places this touches?"
   - Triggers: Changing something used in MULTIPLE places
   - Purpose: Ensure completeness and avoid broken states

Both checkpoints share a principle:
> **Stop, inventory/design, THEN implement**

## Visual Testing & Validation

### Critical Rule: Every UI Change Must Be Visually Tested

**MANDATORY: After EVERY UI change, you MUST perform visual E2E testing with screenshots.**

This is not optional. This is not "if you have time." This is a hard requirement.

### When This Applies

**You MUST run visual tests after:**
- Creating new pages or routes
- Modifying existing UI components
- Changing styles, layouts, or CSS
- Adding or modifying forms
- Updating navigation elements
- Implementing responsive design changes
- Any change that affects what the user sees

**This includes:**
- Initial implementation of new UI
- Bug fixes that change UI
- Refactoring that touches components
- Style updates or theme changes

### Required Visual Testing Workflow

When you complete ANY UI work:

1. **Add Visual Testing Todo** (if not already present):
   ```
   - [ ] Visual Testing: Test [feature] UI with Playwright screenshots
   ```

2. **Run Visual Tests Using Playwright MCP**:
   - Navigate to the changed pages
   - Take screenshots of key states
   - Test responsive breakpoints (mobile, tablet, desktop)
   - Test interactive states (hover, focus, error, loading)
   - Test dark mode if applicable

3. **Verify Visual Quality**:
   - Layout is correct and not broken
   - Text is readable and properly sized
   - Colors match design system
   - Spacing and alignment are proper
   - No visual regressions in surrounding areas
   - Responsive design works at all breakpoints

4. **Document Results**:
   - Save screenshots to `tests/screenshots/[feature-name]/`
   - Note any issues found
   - Fix issues before marking task complete

5. **Mark Complete** only after:
   - All visual tests pass
   - Screenshots confirm quality
   - No regressions detected

### Integration with TodoWrite

**Always include visual testing as a separate todo:**

```markdown
- [ ] 1.1 Implement login form UI
- [ ] 1.2 Add form validation
- [ ] 1.3 Visual Testing: Test login form with screenshots
```

**Visual testing must be completed before marking UI work done.**

### Playwright MCP Commands for Visual Testing

Use these patterns with the Playwright MCP tools:

```typescript
// 1. Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:3000/login" })

// 2. Take full page screenshot
mcp__playwright__browser_take_screenshot({
  filename: "tests/screenshots/auth/login-page.png",
  fullPage: true
})

// 3. Test responsive (resize and screenshot)
mcp__playwright__browser_resize({ width: 375, height: 667 }) // Mobile
mcp__playwright__browser_take_screenshot({
  filename: "tests/screenshots/auth/login-mobile.png"
})

// 4. Test interactive states
mcp__playwright__browser_click({ element: "Email input", ref: "[input id='email']" })
mcp__playwright__browser_take_screenshot({
  filename: "tests/screenshots/auth/login-focused.png"
})

// 5. Test error states (if applicable)
// Submit invalid form, then screenshot
```

### Example: Complete Visual Testing Workflow

```
User: "Create a login page"

Your workflow:
1. ✅ Create login page component
2. ✅ Create login route
3. ✅ Implement form validation
4. ✅ Add to TodoWrite: "Visual Testing: Test login page"
5. ✅ Start dev server
6. ✅ Navigate to /login with Playwright
7. ✅ Take screenshots:
   - Desktop view (1920x1080)
   - Tablet view (768x1024)
   - Mobile view (375x667)
   - Focused input state
   - Error state
   - Loading state
8. ✅ Review screenshots for quality
9. ✅ Fix any visual issues found
10. ✅ Mark visual testing todo complete
11. ✅ Mark overall task complete

ONLY THEN do you consider the work done.
```

### Red Flags - Stop Immediately

If you find yourself doing any of these, STOP:

- ❌ Marking UI work complete without visual testing
- ❌ Skipping screenshots because "it looks fine"
- ❌ Testing only one viewport size
- ❌ Not testing error/loading states
- ❌ Assuming no regressions without checking
- ❌ Moving to next task without visual validation

### Why This Matters

Visual testing catches:
- Layout breaks you didn't notice in code
- Responsive design issues
- CSS conflicts and specificity problems
- Accessibility issues (contrast, sizing)
- Browser-specific rendering bugs
- Regressions in other parts of the UI
- States you forgot to test manually

### Enforcement Checklist

Before marking ANY UI task complete, verify:

- [ ] Dev server is running
- [ ] Navigated to changed pages with Playwright
- [ ] Screenshots taken for all viewport sizes
- [ ] Interactive states tested and screenshotted
- [ ] Visual quality verified
- [ ] No regressions in surrounding UI
- [ ] Screenshots saved to tests/screenshots/
- [ ] Issues found have been fixed

### Summary

> **Core principle: No UI change is complete without visual testing.**
>
> This is mandatory. This is non-negotiable.
>
> Code review is not enough. Manual testing is not enough.
>
> You MUST use Playwright to navigate, interact, and screenshot.
>
> Only then can you confidently mark UI work as done.
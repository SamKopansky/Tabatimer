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
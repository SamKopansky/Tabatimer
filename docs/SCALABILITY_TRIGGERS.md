# Scalability Triggers

This document helps you identify when to think architecturally and design for scale, rather than implementing quick one-off solutions.

## Core Principle

**When creating the FIRST of something, ask: "Where does the 10th one go?"**

If you can't answer confidently, the structure isn't ready. Stop and design for scale.

## 🚨 Automatic Triggers

These situations ALWAYS require structured, scalable solutions:

### Creating First Instance

When you're about to create the first of any category:

- **First test file** → Design complete test taxonomy (unit, integration, infrastructure, e2e)
- **First script** → Create categorized scripts/ directory with clear purposes
- **First API route** → Establish routing patterns and conventions
- **First config file** → Plan configuration system and organization
- **First utility function** → Design utility categories (time, string, array, validation)
- **First component** → Define component organization patterns
- **First database migration** → Set up migration workflow and naming
- **First hook** → Establish hooks directory and naming conventions
- **First action/reducer** → Design state management structure
- **First middleware** → Plan middleware organization and composition

**Action Required:**
1. Pause implementation
2. Design structure for 10+ instances
3. Document the pattern
4. Create skeleton/scaffolding
5. Add examples
6. Then implement the first instance

### Third Instance

If you're creating the 3rd of something and there's no clear structure, you've already failed to scale properly.

**You should have:**
- Clear directory structure
- Documented conventions
- Examples showing the pattern
- Easy path for adding more

**If you don't have these:**
1. Stop immediately
2. Refactor existing instances into proper structure
3. Document the pattern
4. Then add the third instance

### Copying & Pasting Code

If you find yourself copying a file to create a new one:

**Red flags:**
- Copying test-1.ts → test-2.ts
- Copying script.ts → script-new.ts
- Copying component-a.tsx → component-b.tsx (with changes)

**You need:**
- Templates or generators
- Clear categorization
- Established patterns
- Documentation of the pattern
- Prevention of drift

### Adding to "Utils" or "Helpers"

Anytime you're adding to a general-purpose directory without subcategories:

**Bad patterns:**
```
lib/utils.ts          ← 500+ line junk drawer
lib/helpers.ts        ← Everything goes here
scripts/              ← Flat directory with 20+ unrelated scripts
src/components/       ← 50+ components in one directory
```

**Required action:**
1. Create subcategories
2. Split by purpose/type/domain
3. Document organization logic
4. Refactor existing code

## Questions to Ask

Before implementing anything, run through this checklist:

### 1. Will there be more of these?

Ask for these categories:
- Tests (yes, unless truly one-off feature)
- Scripts (yes, if it's automation/tooling)
- Configs (yes, different environments/purposes)
- API routes (yes, apps have multiple endpoints)
- Components (yes, unless truly unique)
- Utilities (yes, apps need many helpers)
- Database tables (yes, apps have multiple entities)
- Hooks (yes, reusable logic patterns)

**If "probably yes"** → Design structure now
**If "definitely no"** → Inline is fine (rare!)

### 2. How many will we have in 6 months?

Estimate realistically:
- **1-3 instances**: Simple structure OK, but document pattern
- **4-10 instances**: Needs clear categories
- **10+ instances**: Requires strong taxonomy, tooling, automation
- **50+ instances**: Needs generators, linting, enforcement

### 3. How will newcomers know where to put the next one?

The structure should be self-documenting:

**Good indicators:**
- Clear directory names
- README files explaining purpose
- Consistent naming patterns
- Examples to follow
- Obvious categories

**Bad indicators:**
- "Just ask me"
- No documentation
- Inconsistent naming
- Unclear categories
- No examples

### 4. What prevents inconsistency?

Without structure, you'll get:
- Different naming conventions
- Scattered locations
- Duplicated patterns
- Technical debt
- Confusion

**Prevention mechanisms:**
- Clear documented patterns
- Examples to copy
- Linting/validation rules
- Code review standards
- Template files

### 5. Can we find all instances easily?

You should be able to answer immediately:
- "Show me all tests" → one glob pattern
- "Show me all scripts" → one directory
- "Show me all API routes" → clear pattern
- "Show me all components" → organized structure

**Test it:**
```bash
# Should work instantly:
find tests/ -name "*.test.ts"
ls scripts/database/
ls src/components/timer/
```

If you need complex searches or documentation to find things, the structure failed.

## Concrete Examples

### Example 1: First Test File

**Situation:** Need to test RLS policies in database

**❌ Bad approach:**
```
Decision: "I'll just create a quick script"
Action: Create scripts/test-rls.ts
Result: Where do unit tests go? Integration tests? E2E tests?
```

**✅ Good approach:**
```
Decision: "This is the first test, design complete taxonomy"
Actions:
1. Identify test types needed: unit, integration, infrastructure, e2e
2. Create directory structure:
   - src/**/*.test.ts (co-located unit tests)
   - src/lib/actions/**/*.test.ts (integration tests)
   - tests/database/ (infrastructure tests)
   - e2e/ (e2e tests)
3. Set up test helpers: src/test/helpers/
4. Configure Vitest workspace for separate environments
5. Document in docs/TESTING.md
6. Create npm scripts (test:unit, test:integration, etc.)
7. Now implement: tests/database/rls-policies.test.ts
```

### Example 2: First Utility Function

**Situation:** Need to format time durations

**❌ Bad approach:**
```
Decision: "Just add it to lib/utils.ts"
Action: Add formatDuration() to growing utils file
Result: 500-line utils.ts with unrelated functions
```

**✅ Good approach:**
```
Decision: "First utility - establish category system"
Actions:
1. Identify utility categories: time, string, array, validation, etc.
2. Create structure:
   lib/utils/
   ├── time.ts
   ├── time.test.ts
   ├── string.ts
   ├── string.test.ts
   ├── array.ts
   └── array.test.ts
3. Document in project.md
4. Now implement formatDuration() in lib/utils/time.ts
```

### Example 3: First API Route

**Situation:** Need endpoint to generate workouts

**❌ Bad approach:**
```
Decision: "Just create app/api/generate.ts"
Action: Create single route file
Result: Where do other endpoints go? What's the pattern?
```

**✅ Good approach:**
```
Decision: "First API route - establish routing conventions"
Actions:
1. Design API structure: app/api/[feature]/[action]/route.ts
2. Identify features: workouts, exercises, history, user
3. Document pattern in project.md
4. Create shared middleware structure
5. Now implement: app/api/workouts/generate/route.ts
```

### Example 4: Third Script (Already Too Late)

**Situation:** Adding third script, no structure exists

**Current state:**
```
scripts/
├── test-db.ts
├── seed-data.ts
└── migrate.ts  ← Adding this
```

**✅ Required fix:**
```
1. Stop - recognize we failed to scale
2. Identify categories:
   - database/ (migrations, seeds, tests)
   - deployment/ (build, deploy)
   - development/ (setup, generators)
3. Refactor:
   scripts/
   ├── database/
   │   ├── test-rls.ts
   │   ├── seed-data.ts
   │   └── migrate.ts
   ├── deployment/
   └── development/
4. Document in scripts/README.md
5. Update package.json scripts
```

## Warning Signs

### You're About To Make a Mistake If...

- ❌ File named with numbers: `test-1.ts`, `util2.ts`
- ❌ File named "new" or "temp": `new-component.tsx`, `temp-script.ts`
- ❌ Copy-pasting entire files to make new ones
- ❌ Can't decide where new file goes (no clear pattern)
- ❌ Adding to a 200+ line "utils" file
- ❌ Creating parallel structures: `scripts/` vs `tools/` vs `bin/`
- ❌ Thinking "I'll organize later"
- ❌ No tests for the first instance (how will you test the next 10?)

### You Did It Right If...

- ✅ Clear, documented directory structure
- ✅ New developers know where to add things
- ✅ Consistent naming across all instances
- ✅ Easy to find all instances of a type
- ✅ Pattern documented in project.md or README
- ✅ Examples show the pattern
- ✅ Scales to 50+ instances without changes

## Integration with Development Workflow

### In TodoWrite Planning

When planning tasks, include architectural checkpoints:

```markdown
## Planning Tasks

- [ ] 0.1 Architecture: Is this first of a pattern? If yes, design for 10+
- [ ] 0.2 Structure: Document directory/file organization
- [ ] 0.3 Conventions: Define naming and discovery patterns
- [ ] 1.1 Implementation: [actual work]
```

### In Code Reviews

Reviewers should ask:

1. Is this the first or third instance of something?
2. Is the structure documented?
3. Can I find similar files easily?
4. Is the pattern clear and consistent?
5. Will this scale to 10+ instances?

### In OpenSpec Changes

When creating proposals, include in design.md:

```markdown
## Scale & Growth Path

### Current State
- How many instances exist today?

### Growth Projections
- 10 instances: What structure is needed?
- 50 instances: What tooling/automation is needed?

### Maintenance Burden
- How will developers discover this?
- What prevents fragmentation?
```

## Quick Reference

| Situation | Threshold | Action Required |
|-----------|-----------|-----------------|
| First instance | Always | Design for 10+, document pattern |
| Third instance | Always | Must have clear structure by now |
| Copying files | Always | Need templates/patterns |
| Adding to utils | Every time | Requires subcategories |
| Flat directory growing | > 10 files | Needs categorization |
| No clear place for file | Any time | Structure isn't ready |

## Final Reminder

> **"Where does the 10th one go?"**
>
> If you can't answer this confidently, stop and design the structure first.
>
> It's always cheaper to design structure up-front than to refactor later.

## See Also

- `openspec/project.md` - Architecture Principles section
- `openspec/AGENTS.md` - Scale Checkpoint in Stage 2
- `CLAUDE.md` - Architectural thinking instructions
- `docs/TESTING.md` - Test structure example

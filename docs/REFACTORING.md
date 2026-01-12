# Refactoring Framework

## What is a Refactor?

A **refactor** is any change that:
- Affects 5+ files in a coordinated way
- Removes/replaces something used in multiple places
- Changes a pattern/convention used throughout the codebase
- Could leave things broken if not completed systematically
- Has cascading dependencies (change A requires B, C, D...)
- Requires coordination between code, tests, and documentation

**Key distinction:**
- **Simple change**: "Fix this bug" → Direct implementation
- **Refactor**: "Let's change how we do X" → Discovery then implementation

## Refactor Trigger Patterns

### Language Triggers

If you're thinking or the user says any of these, it's likely a refactor:

**Direct signals:**
- "Let's switch from X to Y"
- "Replace all instances of..."
- "Migrate to..."
- "Refactor the [pattern/system]"
- "Standardize [approach]"
- "Change [convention] to [convention]"
- "Remove [technology/pattern]"
- "Update all [things] to use..."

**Indirect signals:**
- "This approach isn't working"
- "We should do [X] consistently"
- "Let's clean up the [area]"
- "Consolidate [scattered things]"
- "Make [system] work like [other system]"

**Conceptual signals:**
- User mentions "everywhere" or "throughout"
- Task requires changing the same thing in multiple places
- You notice inconsistent patterns that need unification
- You're removing something that has dependencies
- You're changing a convention or standard

### Scope Triggers

These indicate refactor scope:

- 🔴 **Large**: 10+ files, multiple directories, documentation updates
- 🟡 **Medium**: 5-10 files, single feature area, some doc updates
- 🟢 **Small**: 3-4 files, tightly scoped, minimal doc impact

**Rule**: Medium and Large refactors REQUIRE the workflow below.

### Metacognition Triggers

Stop if you catch yourself thinking:
- "This feels bigger than I initially thought"
- "I'll need to update this everywhere"
- "This could break things if I miss something"
- "There are probably more places affected"
- "I should search for all instances first"

## Mandatory Refactor Workflow

When triggers are detected, follow this workflow:

### Step 0: Recognition & Pause

```
🛑 PAUSE: I've detected refactor trigger patterns.
   This requires systematic planning before implementation.
```

**What to do:**
1. State what you've detected: "This appears to be a [type] refactor affecting [scope]"
2. Ask clarifying questions if scope is unclear
3. Set explicit expectation: "I'll need to do discovery first"

### Step 1: Discovery (MANDATORY)

Create a discovery document: `docs/refactors/[name]-[date].md`

Use this template:

````markdown
# [Refactor Name]

**Date**: YYYY-MM-DD
**Status**: Discovery → Planning → Implementation → Validation → Complete

## Objective

What are we changing and why?
- **From**: [Current state]
- **To**: [Desired state]
- **Reason**: [Why making this change]

## Scope Assessment

- [ ] Small (3-4 files)
- [ ] Medium (5-10 files)
- [ ] Large (10+ files)

## Affected Areas

### Code
- [ ] `path/to/file1.ts` - [what changes]
- [ ] `path/to/file2.ts` - [what changes]

### Tests
- [ ] `path/to/test1.test.ts` - [what changes]

### Configuration
- [ ] `package.json` - [what changes]
- [ ] `*.config.*` - [what changes]

### Documentation
- [ ] `openspec/project.md` - [sections to update]
- [ ] `CLAUDE.md` - [sections to update]
- [ ] `docs/*.md` - [files to update]
- [ ] `README.md` - [what changes]

### Other
- [ ] Database migrations
- [ ] Environment variables
- [ ] CI/CD configuration
- [ ] Third-party integrations

## Discovery Commands

Commands used to find affected areas:

```bash
# Find all references
rg -i "pattern-to-find"

# Find imports
rg "from ['\"]package-name"

# Find specific files
find . -name "*pattern*"
```

## Dependencies

What must happen in order?

1. First: [step]
2. Then: [step]
3. Finally: [step]

## Risk Assessment

- **Breaking changes**: [Yes/No - what breaks]
- **Data migration needed**: [Yes/No]
- **Rollback strategy**: [How to undo if needed]
- **Testing requirements**: [What must be tested]

## Validation Criteria

How do we know it's complete?

- [ ] All files in inventory updated
- [ ] No references to old pattern: `rg -i "old-pattern"`
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] Documentation updated
- [ ] [Other criteria]
````

### Step 2: User Approval

Present the discovery document:

```
I've completed discovery for this refactor:
- Scope: [X] files across [Y] areas
- Estimated effort: [size]
- Risks: [key risks]

Review: docs/refactors/[name]-[date].md

Should I proceed with implementation? Any concerns or changes needed?
```

### Step 3: Implementation Planning

If Medium/Large or affects architecture, **create OpenSpec proposal**:

```bash
openspec/changes/refactor-[name]/
├── proposal.md     # Why, what, impact
├── tasks.md        # Step-by-step checklist
├── design.md       # If architecture changes
└── specs/          # If behavior changes
```

**Create TodoWrite checklist** following tasks.md:

```markdown
- [ ] 0.1 Discovery complete (reference: docs/refactors/[name]-[date].md)
- [ ] 1.1 [First implementation step]
- [ ] 1.2 [Second implementation step]
...
- [ ] 9.1 Validation: Search for remnants
- [ ] 9.2 Validation: Build and test
- [ ] 9.3 Validation: Documentation review
```

### Step 4: Systematic Implementation

Work through tasks sequentially:
- Complete each item fully before moving to next
- Mark todos as in_progress → completed
- Update discovery doc as you go
- Document unexpected findings

**Best practices:**
- One logical change at a time
- Test after each major change
- Keep discovery doc updated with findings
- Add notes about complications or deviations

### Step 5: Validation (MANDATORY)

Before declaring complete, check ALL validation criteria:

```bash
# Search for old patterns
rg -i "old-pattern-name"
rg "from ['\"]old-import-path"

# Build & test
npm run build
npm run type-check
npm run test
npm run lint

# Manual verification
# - Core flows still work
# - No broken links in docs
# - Types are correct
# - No console errors in browser
```

**Checklist:**
- [ ] All items in discovery doc completed
- [ ] No remaining references to old pattern
- [ ] Build succeeds with no errors
- [ ] All tests pass
- [ ] TypeScript has no errors
- [ ] Documentation is consistent
- [ ] Code examples work
- [ ] No broken imports

## Refactor Types & Patterns

### Technology Replacement

**Examples**: "switch from X to Y", "migrate to Z", "remove dependency D"

**Triggers**:
- Direct mention of swapping technologies
- Removing packages or dependencies
- Changing database/ORM/framework

**Key risks**:
- Incomplete replacement leaving broken imports
- Missing configuration updates
- Orphaned files and dead code

**Critical steps**:
1. Search codebase for ALL references first
2. Map old API to new API
3. Update incrementally (don't delete until replaced)
4. Validate no remnants remain

**Discovery checklist**:
- [ ] All source files using the technology
- [ ] All test files
- [ ] All configuration files
- [ ] All documentation
- [ ] Package.json dependencies
- [ ] Environment variables
- [ ] Type definitions

### Pattern Migration

**Examples**: "standardize on", "unify approach", "make consistent", "use [pattern] everywhere"

**Triggers**:
- Multiple implementations of same concept
- Inconsistent conventions
- Desire to standardize

**Key risks**:
- Missing instances of old pattern
- Inconsistent application (some old, some new)
- Breaking existing functionality

**Critical steps**:
1. Find ALL instances of old pattern
2. Verify new pattern works for all use cases
3. Convert systematically (don't mix old and new)
4. Update related documentation and examples

**Discovery checklist**:
- [ ] All files using old pattern
- [ ] Test files demonstrating old pattern
- [ ] Documentation showing old pattern
- [ ] Edge cases that might not fit new pattern

### Architecture Change

**Examples**: "restructure", "reorganize", "change how we...", "split into modules"

**Triggers**:
- Moving files/directories
- Changing module boundaries
- Splitting or merging components
- Changing data flow

**Key risks**:
- Breaking existing functionality
- Cascading import updates
- Lost functionality in the shuffle

**Critical steps**:
1. Document what moves where
2. Update all imports systematically
3. Verify no functionality is lost
4. Update build/bundle configuration

**Discovery checklist**:
- [ ] All files being moved
- [ ] All files importing moved files
- [ ] Configuration referencing old paths
- [ ] Documentation with old paths

### Convention Change

**Examples**: "rename throughout", "change naming", "update style", "use [convention] everywhere"

**Triggers**:
- Changing variable/function/file naming
- Updating code style or formatting
- Changing API conventions

**Key risks**:
- Partial application (mixed conventions)
- Breaking external APIs
- Missing instances in strings/comments

**Critical steps**:
1. Use automated tools where possible (find-and-replace)
2. Verify external APIs aren't affected
3. Update documentation examples
4. Check string literals and comments

**Discovery checklist**:
- [ ] All code using old convention
- [ ] Tests using old convention
- [ ] Documentation using old convention
- [ ] Comments and string literals

### Consolidation

**Examples**: "merge", "combine", "consolidate", "deduplicate", "remove duplication"

**Triggers**:
- Multiple implementations of same functionality
- Scattered related code
- Duplication across files

**Key risks**:
- Losing subtle differences in functionality
- Breaking dependents expecting old locations
- Removing something that's actually needed

**Critical steps**:
1. Map all functionality before removing anything
2. Verify all use cases are covered
3. Update dependents to use consolidated version
4. Only delete after all references updated

**Discovery checklist**:
- [ ] All implementations to be merged
- [ ] All dependents of each implementation
- [ ] Subtle differences between implementations
- [ ] Tests covering all use cases

### Code Cleanup

**Examples**: "remove dead code", "clean up", "delete unused", "remove deprecated"

**Triggers**:
- Removing unused functions/files
- Deleting deprecated code
- Cleaning up experiments

**Key risks**:
- Removing something that's actually used
- Breaking build/test dependencies
- Losing functionality that might be needed

**Critical steps**:
1. Verify code is truly unused
2. Search for string references (not just imports)
3. Check for dynamic imports or reflection
4. Remove incrementally with validation

**Discovery checklist**:
- [ ] Search for all imports
- [ ] Search for string references
- [ ] Check for dynamic usage
- [ ] Verify tests don't reference it

## Integration with Existing Workflows

### With OpenSpec

- **Discovery phase** helps determine if OpenSpec proposal is needed
- **Large refactors** should use OpenSpec workflow
- **Archive refactor** when complete using `openspec archive`

When to use OpenSpec for refactors:
- Medium/Large scope (5+ files)
- Changes affect documented capabilities
- Breaking changes to APIs
- Architecture modifications

### With Scale Checkpoint

- **Scale Checkpoint** prevents bad initial structure (creation)
- **Refactor Framework** fixes existing bad structure (modification)
- Both ask "What's the right organization?"

Relationship:
- Use Scale Checkpoint when creating FIRST instance
- Use Refactor Framework when changing EXISTING patterns

### With TodoWrite

- **Discovery document** becomes source of truth for todos
- **Refactor todos** should explicitly reference discovery doc
- **Validation steps** are final todos

Example todo structure:
```markdown
- [ ] 0.1 Discovery complete (docs/refactors/name-date.md)
- [ ] 1.1 Update core implementation
- [ ] 1.2 Update tests
- [ ] 2.1 Update documentation
- [ ] 9.1 Validation: Search for remnants
- [ ] 9.2 Validation: Build and test
```

## Quick Reference

### Decision Tree

```
Is this a refactor?
├─ Affects 5+ files? → YES
├─ Removes/replaces pattern used in multiple places? → YES
├─ Changes convention/standard throughout code? → YES
├─ Has cascading dependencies? → YES
├─ Could break things if incomplete? → YES
└─ Otherwise → Probably not, proceed normally

If YES to any → Follow Refactor Workflow
```

### Red Flags

Stop and use Refactor Workflow if you catch yourself thinking:

- ❌ "I'll just change this and see what breaks"
- ❌ "Let me remove this dependency quickly"
- ❌ "I'll update the obvious files and handle others later"
- ❌ "This should be a quick find-and-replace"
- ❌ "I'll figure out what else needs changing as I go"

### Green Lights

These are OK to do directly (not refactors):

- ✅ Fixing a single bug in one file
- ✅ Adding a new feature that doesn't change existing patterns
- ✅ Updating a typo or comment
- ✅ Changing implementation without changing interface
- ✅ Adding tests for existing behavior
- ✅ Updating dependencies (non-breaking)

### Common Mistakes to Avoid

1. **Starting without discovery**
   - Problem: Don't know full scope
   - Solution: Always create discovery doc first

2. **Removing before replacing**
   - Problem: Leaves broken code
   - Solution: Replace first, then remove

3. **Incomplete updates**
   - Problem: Mixed old and new patterns
   - Solution: Use validation checklist

4. **Skipping documentation**
   - Problem: Docs contradict code
   - Solution: Update docs as part of refactor

5. **No validation**
   - Problem: Hidden breakage
   - Solution: Run all validation commands

## Example: Technology Replacement

Let's walk through replacing Drizzle with Supabase:

### Step 0: Recognition

User says: "Let's switch from Drizzle to Supabase"

🛑 PAUSE - Trigger detected: "switch from X to Y"

This is a **Large** refactor (technology replacement, 10+ files)

### Step 1: Discovery

Create `docs/refactors/drizzle-to-supabase-2026-01-11.md`

```bash
# Find all Drizzle references
rg -i "drizzle"

# Find Drizzle imports
rg "from ['\"]drizzle"

# Find related files
find . -name "*drizzle*"
find . -name "schema*"
find . -name "*queries*"
```

Document findings:
- Code: src/lib/db/ (all files)
- Config: None (already removed)
- Docs: openspec/project.md, openspec/changes/*/*, docs/
- Tests: Need to create after migration

### Step 2: User Approval

"I've found 18 files across 5 areas needing updates. This is a Large refactor requiring careful migration. Proceed?"

### Step 3: Planning

Create OpenSpec proposal: `openspec/changes/migrate-drizzle-to-supabase/`

Create TodoWrite checklist with 20+ items covering:
- Schema verification
- Client replacement
- Query migration (by category)
- Seed data migration
- Documentation updates
- Validation

### Step 4: Implementation

Work through todos systematically:
1. Verify Supabase schema matches Drizzle
2. Replace src/lib/db/index.ts
3. Migrate queries by category (users, exercises, workouts, etc.)
4. Update seed data
5. Update documentation

### Step 5: Validation

```bash
# Check for remaining Drizzle references
rg -i "drizzle"

# Verify build
npm run build

# Run tests
npm run test

# Check types
npm run type-check
```

All clear ✅

## Summary

**Core principle**: When changing something used in MULTIPLE places, STOP and inventory ALL affected areas before implementing.

**Key workflow**: Recognition → Discovery → Approval → Planning → Implementation → Validation

**Success metric**: Never leave broken code, dead imports, or inconsistent documentation.

**Remember**: It's faster to discover first than to debug later.

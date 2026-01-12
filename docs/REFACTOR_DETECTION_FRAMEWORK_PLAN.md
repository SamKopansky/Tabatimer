# Refactor Detection & Planning Framework

**Created**: 2026-01-11
**Status**: Plan
**Purpose**: Enable Claude to proactively detect, pause, and systematically plan ANY refactor before implementation

## Problem Statement

The Drizzle-to-Supabase migration left broken code, incomplete documentation updates, and missing references because:
1. No systematic discovery phase before starting
2. No inventory of all affected locations
3. No validation that the refactor was complete
4. Treated as "remove package" rather than "replace entire data layer"

**Root cause**: No framework to detect when a task is actually a refactor requiring systematic planning vs. a simple change that can be implemented directly.

## Solution Overview

Create a **general refactor detection framework** that helps Claude:
1. **Recognize** refactor patterns in user requests and task scope
2. **Pause** implementation until discovery is complete
3. **Inventory** all affected areas systematically
4. **Plan** implementation with proper sequencing
5. **Validate** completeness before declaring done

This framework applies to ANY refactor type:
- Technology replacements (Drizzle → Supabase)
- Pattern migrations (standardizing approaches)
- Architecture changes (restructuring systems)
- Convention changes (renaming patterns)
- Consolidation (merging scattered code)
- Cleanup (removing dead code safely)

## Core Principle

> **"What are ALL the places this touches?"**
>
> If you can't answer confidently, the discovery isn't complete. STOP and inventory first.

This mirrors the Scale Checkpoint principle:
- **Scale Checkpoint** (creation): "Where does the 10th one go?"
- **Refactor Checkpoint** (modification): "What are ALL the places this touches?"

Both share: **Stop, inventory/design, THEN implement**

## Implementation Plan

### File 1: `docs/REFACTORING.md` - The Central Framework

**Purpose**: Authoritative guide for recognizing and handling refactors

**Key sections**:

1. **What is a Refactor?**
   - Clear definition with examples
   - Distinction between simple change vs. refactor
   - Scope indicators (Small/Medium/Large)

2. **Refactor Trigger Patterns**
   - **Language triggers**: "switch from", "migrate to", "replace all", "refactor", "standardize", etc.
   - **Scope triggers**: 5+ files, multiple directories, coordinated changes
   - **Conceptual triggers**: User mentions "everywhere", removing dependencies, changing conventions

3. **Mandatory Refactor Workflow**
   - **Step 0: Recognition & Pause** - Explicit stop point
   - **Step 1: Discovery (MANDATORY)** - Create inventory document
   - **Step 2: User Approval** - Present scope, get confirmation
   - **Step 3: Implementation Planning** - OpenSpec for medium/large, TodoWrite for all
   - **Step 4: Systematic Implementation** - Work through tasks sequentially
   - **Step 5: Validation (MANDATORY)** - Search, build, test, verify

4. **Discovery Document Template**
   ```
   docs/refactors/[name]-[date].md

   Sections:
   - Objective (from/to/reason)
   - Scope Assessment (small/medium/large)
   - Affected Areas (code, tests, config, docs, other)
   - Dependencies (what order)
   - Risk Assessment (breaking changes, data migration, rollback)
   - Validation Criteria (how to know it's complete)
   ```

5. **Refactor Types & Patterns**
   - Technology Replacement
   - Pattern Migration
   - Architecture Change
   - Convention Change
   - Consolidation
   - Code Cleanup
   - Each with: triggers, key risks, critical steps

6. **Integration with Existing Workflows**
   - With OpenSpec (when to create proposals)
   - With Scale Checkpoint (prevention vs. fixing)
   - With TodoWrite (tracking implementation)

7. **Quick Reference**
   - Decision tree: "Is this a refactor?"
   - Red flags (bad patterns to avoid)
   - Green lights (safe to proceed directly)

### File 2: `CLAUDE.md` Updates - Add Refactor Awareness

**Location**: After "Critical Rule: Design for Scale From the Start"

**Add new section**: "Refactor Detection & Planning"

**Key content**:
- **Critical Rule**: Detect Refactors Before Starting
- **Trigger Phrases**: Exhaustive list
- **Trigger Situations**: Scope and impact indicators
- **When Triggers Detected**: Immediate actions (pause, read docs, follow workflow)
- **Example**: Side-by-side wrong vs. correct approach for Drizzle-to-Supabase
- **Integration with Scale Checkpoint**: Two mandatory checkpoints (creation vs. modification)

### File 3: `openspec/AGENTS.md` Updates - Add to Workflow

**Location**: In Stage 2 workflow, after Scale Checkpoint (around line 63)

**Add step 4**: "⚠️ REFACTOR CHECKPOINT"

**Content**:
```markdown
4. **⚠️ REFACTOR CHECKPOINT** - Before changing existing patterns, pause and assess:
   - Is this changing something used in 5+ places?
   - If yes, will incomplete changes break things?
   - If yes to both, STOP - use the Refactor Framework:
     * Read `docs/REFACTORING.md` completely
     * Create discovery document inventorying ALL affected areas
     * Get user approval before implementing
     * Create OpenSpec proposal for medium/large refactors
     * Implement systematically with validation
   - Ask: "What are ALL the places this touches?"
   - See `docs/REFACTORING.md` for complete workflow
```

### File 4: `.claude/commands/detect-refactor.md` - Callable Command

**Purpose**: Allow explicit refactor detection check

**Trigger**: User or Claude can invoke to analyze current task

**Content**:
- Trigger checklist (language, scope, impact)
- Decision logic (2+ triggers → REFACTOR)
- Template for assessment output
- Recommendation with reasoning

### File 5: `.claude/refactor-awareness.md` - Protocol Document

**Purpose**: System-level integration for automatic pattern recognition

**Key sections**:

1. **Automatic Pattern Recognition**
   - High-confidence triggers (always stop)
   - Medium-confidence triggers (investigate)
   - When triggered: DO / DON'T lists

2. **Self-Check Questions**
   - 4 questions Claude asks before ANY implementation
   - 2+ yes → Stop and use Refactor Framework

3. **Success Metrics**
   - Doing it right: Catch before starting, create discovery docs, validate completeness
   - Doing it wrong: User finds missed files, build breaks, incomplete updates

### File 6: `openspec/project.md` Updates - Technology Location Map

**Location**: In "Tech Stack" section

**Add subsection**: "Technology Location Map"

**Purpose**: Document where each core technology lives so refactors know what to update

**Format**:
```markdown
### Technology Location Map

**Database & Data Layer:**
- Supabase Client: `src/lib/supabase/`
- Database Queries: `src/lib/db/queries.ts`, `src/lib/actions/*.ts`
- Schema Migrations: `supabase/migrations/`
- Type Definitions: `src/lib/db/database.types.ts`
- Seed Data: `supabase/seed.sql`

**AI Integration:**
- Location: `src/lib/ai/`
- Configuration: `.env.local`
- Types: `src/lib/ai/types.ts`

[Continue for other technologies...]
```

**Update line 158**: Change from:
```
- **ORM**: Drizzle ORM or Prisma (TypeScript-first, type-safe queries)
```
To:
```
- **Database Client**: Supabase (PostgreSQL with built-in auth, storage, and real-time)
```

## How It Works: Multi-Layered Triggering

### Layer 1: Linguistic Detection
Claude scans user messages for trigger phrases:
- "switch from X to Y"
- "migrate to..."
- "replace all..."
- "refactor the..."
- "standardize..."
- "make [X] consistent"

### Layer 2: Conceptual Detection
Claude recognizes task patterns:
- Affects 5+ files in coordinated way
- Removes/replaces widely-used pattern
- Changes convention throughout codebase
- Has cascading dependencies

### Layer 3: Metacognition
Claude self-monitors:
- "This feels bigger than expected"
- "I'll need to update this everywhere"
- "This could break things if incomplete"

### Layer 4: Integration
Built into existing checkpoints:
- **Before creating** (Scale Checkpoint) → Design for 10+
- **Before modifying** (Refactor Checkpoint) → Inventory all affected
- **During planning** (OpenSpec) → Use for medium/large refactors
- **During execution** (TodoWrite) → Track systematic progress

## Workflow Comparison

### Without Framework (What Happened)
```
User: "Switch from Drizzle to Supabase"
↓
Remove package.json entry
↓
Update a few obvious files
↓
Declare complete
↓
RESULT: Broken code, incomplete docs, missing updates
```

### With Framework (What Should Happen)
```
User: "Switch from Drizzle to Supabase"
↓
🛑 REFACTOR DETECTED: "switch from X to Y" trigger
↓
Pause: Read docs/REFACTORING.md
↓
Discovery: Create docs/refactors/drizzle-to-supabase-2026-01-11.md
  - Search: rg -i "drizzle" (find ALL references)
  - Inventory: Code, tests, config, docs, migrations
  - Dependencies: Schema → Client → Queries → Tests → Docs
  - Validation: Search commands, build/test commands
↓
User Approval: Present scope (18 files, 5 areas, medium risk)
↓
Planning: Create OpenSpec proposal + TodoWrite checklist
↓
Implementation: Work through systematically
  - Mark in_progress → completed for each item
  - Update discovery doc with findings
↓
Validation: Execute all validation criteria
  - rg -i "drizzle" returns zero (or only historical)
  - npm run build succeeds
  - npm run test passes
  - Documentation reviewed
↓
Complete: All areas updated, nothing broken, fully validated
```

## Success Criteria

The framework is working if Claude:
- ✅ Catches refactor patterns BEFORE starting implementation
- ✅ Creates discovery documents for ambiguous changes
- ✅ Explicitly validates completeness before declaring done
- ✅ Never leaves broken imports or dead code
- ✅ Never requires user to point out obvious missed files

The framework needs work if:
- ❌ User asks "Did you update [obvious file]?"
- ❌ Claude finds more affected files during implementation
- ❌ Build breaks after Claude declares complete
- ❌ Documentation contradicts actual code
- ❌ "Quick" refactors turn into multi-session debugging

## Implementation Checklist

### Phase 1: Core Framework
- [ ] Create `docs/REFACTORING.md` with complete workflow
- [ ] Update `CLAUDE.md` with refactor detection section
- [ ] Update `openspec/AGENTS.md` with Refactor Checkpoint
- [ ] Create `.claude/commands/detect-refactor.md`
- [ ] Create `.claude/refactor-awareness.md`

### Phase 2: Documentation Updates
- [ ] Add Technology Location Map to `openspec/project.md`
- [ ] Fix line 158 in `openspec/project.md` (remove Drizzle reference)
- [ ] Update any other Drizzle references in:
  - [ ] `openspec/changes/build-personal-trainer-mvp/tasks.md`
  - [ ] `openspec/changes/build-personal-trainer-mvp/design.md`
  - [ ] `openspec/changes/build-personal-trainer-mvp/proposal.md`

### Phase 3: Test the Framework
- [ ] Pick a small refactor task
- [ ] Verify Claude detects triggers
- [ ] Verify Claude pauses and creates discovery doc
- [ ] Verify systematic implementation
- [ ] Verify validation catches missed items

### Phase 4: Iterate
- [ ] Collect false positives/negatives
- [ ] Refine trigger patterns
- [ ] Improve discovery template
- [ ] Add examples from real refactors

## Optional Enhancements

### 1. Validation Hook
`.claude/hooks/post-tool.sh` - Automated checks after edits:
```bash
if [[ "$TOOL_NAME" == "Edit" || "$TOOL_NAME" == "Write" ]]; then
  # Check for broken imports to removed dependencies
  if grep -r "from 'drizzle" src/ 2>/dev/null; then
    echo "⚠️ WARNING: Found Drizzle imports but Drizzle removed"
  fi
fi
```

### 2. Refactor Template Generator
Script to scaffold discovery documents:
```bash
scripts/new-refactor.sh [name]
# Creates docs/refactors/[name]-[date].md with template
```

### 3. Completion Validator
Script to run all validation checks:
```bash
scripts/validate-refactor.sh [name]
# Runs searches, builds, tests, doc checks
```

## Related Documentation

- `docs/DRIZZLE_TO_SUPABASE_MIGRATION.md` - Example of what went wrong
- `docs/SCALABILITY_TRIGGERS.md` - When to think architecturally (creation)
- `openspec/AGENTS.md` - Agent workflow (includes Scale Checkpoint)
- `CLAUDE.md` - Project instructions (includes Scale Checkpoint)

## Key Insights

### Why This Works

1. **Multiple detection layers** - Catches refactors from different angles
2. **Mandatory pause** - Can't skip discovery phase
3. **Explicit validation** - Clear completion criteria
4. **Workflow integration** - Uses existing tools (OpenSpec, TodoWrite)
5. **Memory aid** - Documents serve as external memory across sessions

### Why Previous Approach Failed

1. **No trigger detection** - Treated as simple change
2. **No discovery phase** - Started removing immediately
3. **No inventory** - Didn't know all affected areas
4. **No validation** - Declared complete without verification
5. **No continuity** - No document to guide completion

### Generalization Principle

The framework generalizes beyond tech swaps to ANY refactor because:
- Triggers are pattern-based, not technology-specific
- Discovery process is the same (what touches what?)
- Validation is universal (search, build, test)
- Risk management applies to all refactors

This makes it future-proof for:
- Architecture changes
- Pattern migrations
- Convention updates
- Code consolidation
- Dependency management
- System reorganization

## Next Steps

1. **Review this plan** - Ensure it addresses the root problem
2. **Implement Phase 1** - Create core framework files
3. **Implement Phase 2** - Update documentation
4. **Test with real refactor** - Validate the workflow works
5. **Iterate based on experience** - Refine triggers and process

The goal: Never again have an incomplete refactor leave broken code in the repository.

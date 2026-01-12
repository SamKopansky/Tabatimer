# Refactor Awareness Protocol

## Automatic Pattern Recognition

Before implementing ANY task, scan for these refactor indicators:

### High-Confidence Triggers (Always stop)

- User says "switch", "migrate", "replace all", "refactor", "standardize"
- Task affects 5+ files in coordinated manner
- Removing something with dependencies
- Changing pattern used throughout codebase

### Medium-Confidence Triggers (Investigate)

- Task seems "bigger than expected"
- You're thinking "I'll need to update this everywhere"
- Multiple directories affected
- Code + tests + docs all need updates

### When Triggered

DO:
- Explicitly state: "I've detected refactor patterns"
- Reference specific triggers detected
- Explain why systematic planning is needed
- Follow `docs/REFACTORING.md` workflow

DON'T:
- Start implementing immediately
- Remove things without inventorying dependents
- Update "obvious" files and assume you're done
- Skip validation phase

## Self-Check Questions

Before ANY implementation, ask yourself:

1. "Is this changing something used in multiple places?" → If yes, might be refactor
2. "Could this break things if I don't do it completely?" → If yes, might be refactor
3. "Am I removing or replacing something?" → If yes, might be refactor
4. "Will I need to update tests AND docs?" → If yes, might be refactor

**2+ yes answers → Stop and use Refactor Framework**

## Workflow Integration

### Before Implementation (Every Task)

```
User request → Scan for triggers → Triggered?
                                      ↓ YES
                                   STOP → Read docs/REFACTORING.md → Discovery → Approval → Plan → Execute → Validate
                                      ↓ NO
                                   Proceed normally
```

### During TodoWrite Planning

If refactor detected, include discovery as first todo:

```markdown
- [ ] 0.1 REFACTOR DISCOVERY: Create docs/refactors/[name]-[date].md
- [ ] 0.2 User approval of scope
- [ ] 1.1 [First implementation step]
...
- [ ] 9.1 VALIDATION: Search for remnants
- [ ] 9.2 VALIDATION: Build and test
```

### During OpenSpec Proposals

If creating proposal and refactor detected:

1. Mention in proposal.md "Why" section that this is a refactor
2. Include discovery document reference
3. Add validation section to tasks.md
4. Consider adding migration guide to design.md

## Success Metrics

You're doing this right if:
- ✅ You catch yourself BEFORE starting implementation
- ✅ You create discovery docs for ambiguous changes
- ✅ You explicitly validate completeness before declaring done
- ✅ You never leave broken imports or dead code
- ✅ User never has to point out missed files

You're doing this wrong if:
- ❌ User asks "Did you update [obvious file]?"
- ❌ You find more affected files during implementation
- ❌ Build breaks after you declare complete
- ❌ Documentation contradicts actual code
- ❌ "Quick" refactors turn into multi-session debugging

## Refactor Type Recognition

### Technology Replacement

**Pattern**: "switch from X to Y", "migrate to Z", "remove [package]"

**What to inventory**:
- All imports from old technology
- All configuration files
- All documentation references
- All tests using old technology
- Type definitions and generated code

### Pattern Migration

**Pattern**: "standardize on", "make consistent", "use [pattern] everywhere"

**What to inventory**:
- All instances of old pattern
- All tests demonstrating old pattern
- All documentation showing old pattern
- Edge cases that might not fit new pattern

### Architecture Change

**Pattern**: "restructure", "reorganize", "move to", "change architecture"

**What to inventory**:
- All files being moved
- All imports from moved files
- Configuration with path references
- Documentation with path references

### Convention Change

**Pattern**: "rename throughout", "change naming", "update convention"

**What to inventory**:
- All code using old convention
- String literals with old convention
- Tests using old convention
- Documentation using old convention

### Consolidation

**Pattern**: "merge", "combine", "consolidate", "deduplicate"

**What to inventory**:
- All implementations being merged
- All dependents of each implementation
- Differences between implementations
- Tests for all implementations

### Code Cleanup

**Pattern**: "remove dead code", "delete unused", "clean up"

**What to inventory**:
- All imports (direct and transitive)
- String references
- Dynamic imports or reflection
- Test dependencies

## Example Dialogue

### Good: Detected and Paused

```
User: "Let's switch from Drizzle to Supabase"

Claude:
🛑 REFACTOR DETECTED

I've detected refactor trigger patterns:
- Language trigger: "switch from X to Y"
- This is a technology replacement refactor
- Likely affects: database client, queries, tests, config, docs

This requires systematic planning before implementation.

I'll create a discovery document to inventory all affected areas:
docs/refactors/drizzle-to-supabase-2026-01-11.md

Let me search for all Drizzle references first...
```

### Bad: Jumped to Implementation

```
User: "Let's switch from Drizzle to Supabase"

Claude:
Sure! Let me remove Drizzle from package.json...

[Updates package.json]
[Updates a few obvious files]

Done! ❌
```

## Integration Points

### With Scale Checkpoint

- Scale Checkpoint: "Where does the 10th one go?" (creation)
- Refactor Checkpoint: "What are ALL the places this touches?" (modification)

Use Scale Checkpoint when creating FIRST instance.
Use Refactor Framework when changing EXISTING patterns.

### With OpenSpec

- Small refactors: TodoWrite checklist only
- Medium refactors: OpenSpec proposal + TodoWrite
- Large refactors: OpenSpec proposal + discovery doc + TodoWrite

### With TodoWrite

Always include:
- Discovery as first todo (0.1)
- Validation as last todos (9.x)
- Reference discovery doc in todos

## Quick Decision Matrix

| Scenario | Is it a refactor? | Action |
|----------|------------------|--------|
| Fix bug in one file | No | Implement directly |
| Add new feature | No | Implement directly |
| Update typo | No | Fix directly |
| Switch technologies | YES | Use Refactor Framework |
| Standardize pattern | YES | Use Refactor Framework |
| Reorganize files | YES | Use Refactor Framework |
| Change convention | YES | Use Refactor Framework |
| Consolidate code | YES | Use Refactor Framework |
| Remove dependency | YES | Use Refactor Framework |

## Remember

**Core principle**: When changing something used in MULTIPLE places, STOP and inventory ALL affected areas before implementing.

**The cost of discovery**: 10 minutes
**The cost of debugging incomplete refactor**: Hours or days

Always choose discovery first.

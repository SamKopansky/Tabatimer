---
name: Detect Refactor
description: Check if current task is a refactor requiring systematic planning
---

# Refactor Detection Check

Run this analysis on the current task to determine if it requires the Refactor Framework.

## Trigger Analysis

Check against these patterns:

### Language Triggers
- [ ] Contains: "switch from", "migrate to", "replace all", "refactor", "standardize", "change throughout"
- [ ] User mentions "everywhere" or "multiple places"
- [ ] Task involves removing widely-used component

### Scope Triggers
- [ ] Affects 5+ files in coordinated way
- [ ] Removes/replaces pattern used in multiple places
- [ ] Changes convention applied throughout codebase
- [ ] Has cascading dependencies (A requires B, C, D...)
- [ ] Could leave things broken if incomplete

### Impact Triggers
- [ ] Requires changes to code AND tests AND docs
- [ ] Changes public interfaces or contracts
- [ ] Affects data storage or migrations
- [ ] Modifies architecture or system boundaries

## Decision

**If 2+ triggers detected → REFACTOR**

Follow `docs/REFACTORING.md` workflow:
1. Create discovery document
2. Inventory all affected areas
3. Get user approval
4. Plan systematically
5. Implement with validation

**If 0-1 triggers → NORMAL CHANGE**

Proceed with standard implementation flow.

## Assessment Template

**Task description**: [Summarize the task]

**Detected triggers**:
- Language: [List detected language triggers or "none"]
- Scope: [List detected scope triggers or "none"]
- Impact: [List detected impact triggers or "none"]
- Total trigger count: [X]

**Recommendation**: [REFACTOR WORKFLOW / NORMAL CHANGE]

**Reasoning**: [Explain why this is/isn't a refactor and what the key risks or considerations are]

**Next steps**: [What should happen next based on the recommendation]

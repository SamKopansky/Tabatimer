# Visual Testing Enforcement System

## Overview

This project has a **mandatory** visual testing requirement for ALL UI changes. This is enforced through multiple layers to ensure it happens without exception.

## Enforcement Layers

### 1. CLAUDE.md - AI Assistant Instructions

The `CLAUDE.md` file contains a complete "Visual Testing & Validation" section that:

- Defines visual testing as MANDATORY, not optional
- Lists all scenarios where visual testing applies
- Provides step-by-step workflow
- Includes Playwright MCP command examples
- Shows complete example workflows
- Lists red flags to avoid
- Includes an enforcement checklist

**Key principle:** No UI change is complete without visual testing.

### 2. OpenSpec Workflow - Stage 2 Checkpoint

The `openspec/AGENTS.md` file includes a **⚠️ VISUAL TESTING CHECKPOINT** in Stage 2 (Implementation):

```
7. ⚠️ VISUAL TESTING CHECKPOINT - After ANY UI change, MANDATORY visual testing:
   - Did you create or modify pages, components, styles, or layouts?
   - If yes, you MUST run visual E2E tests with Playwright screenshots
   - STOP - do not mark UI work complete until visual testing is done
```

This checkpoint appears alongside the Scale and Refactor checkpoints, making it equally mandatory.

### 3. TodoWrite Integration

Visual testing must be included as a separate todo item:

```markdown
- [ ] 1.1 Implement login form UI
- [ ] 1.2 Add form validation
- [ ] 1.3 Visual Testing: Test login form with screenshots
```

The visual testing todo MUST be completed before marking UI work done.

### 4. Screenshot Directory Structure

Screenshots are organized and committed to git:

```
tests/screenshots/
├── auth/           # Authentication pages
├── timer/          # Timer pages and components
├── workouts/       # Workout-related pages
├── exercises/      # Exercise library pages
├── history/        # Workout history pages
└── [feature]/      # Other feature areas
```

See `tests/screenshots/README.md` for full documentation.

## Standard Testing Protocol

For every UI change, you must:

### 1. Viewport Sizes

Test at these standard sizes:
- **Desktop**: 1920x1080
- **Tablet**: 768x1024 (optional for MVP)
- **Mobile**: 375x667 (iPhone SE)

### 2. States to Capture

- Default/initial state
- Interactive states (focus, hover if needed)
- Data states (loading, populated, empty if applicable)
- Error states (validation errors, API errors)
- Edge cases (long text, many items, etc.)

### 3. Naming Convention

```
[page-name]-[state]-[viewport].png

Examples:
- login-page-desktop.png
- login-error-mobile.png
- signup-form-focused-tablet.png
```

## Example: Auth Pages Visual Testing

The auth pages (signup and login) were tested following this protocol:

### Screenshots Captured

1. `signup-page-desktop.png` - Signup form at 1920x1080
2. `signup-page-mobile.png` - Signup form at 375x667
3. `login-page-desktop.png` - Login form at 1920x1080
4. `login-page-mobile.png` - Login form at 375x667
5. `login-error-mobile.png` - Login with validation error

### Verification Performed

✅ Layout is centered and properly aligned
✅ Gradient background displays correctly
✅ Form fields are readable and properly sized
✅ Responsive design works at mobile and desktop sizes
✅ Form validation displays error messages
✅ Links are clickable and styled correctly
✅ Typography is consistent with design system

## Playwright MCP Commands

Use these commands for visual testing:

```typescript
// 1. Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:3000/page" })

// 2. Resize for viewport
mcp__playwright__browser_resize({ width: 1920, height: 1080 }) // Desktop
mcp__playwright__browser_resize({ width: 375, height: 667 })   // Mobile

// 3. Take screenshot
mcp__playwright__browser_take_screenshot({
  filename: "tests/screenshots/feature/page-state-viewport.png",
  fullPage: true
})

// 4. Interact with elements (for state testing)
mcp__playwright__browser_click({ element: "Button", ref: "e123" })
mcp__playwright__browser_type({ element: "Input", ref: "e456", text: "value" })

// 5. Take accessibility snapshot (optional, for reference)
mcp__playwright__browser_snapshot({
  filename: "tests/screenshots/feature/page-snapshot.md"
})
```

## Why This Matters

Visual testing catches issues that code review cannot:

- **Layout breaks** - Elements overlapping or misaligned
- **Responsive issues** - Mobile layout breaking
- **CSS conflicts** - Unintended style changes
- **Accessibility problems** - Poor contrast, tiny text
- **Browser rendering bugs** - Differences in rendering
- **Regressions** - Changes breaking other UI areas
- **State issues** - Loading/error states not displaying properly

## Workflow Summary

1. Make UI changes
2. Add "Visual Testing" todo if not present
3. Start dev server (`npm run dev`)
4. Use Playwright MCP to:
   - Navigate to changed pages
   - Test at desktop and mobile viewports
   - Capture all relevant states
   - Save screenshots to `tests/screenshots/[feature]/`
5. Review screenshots for quality
6. Fix any issues found
7. Mark visual testing todo as complete
8. ONLY THEN mark UI work as complete

## Non-Compliance

If you find yourself:
- ❌ Skipping screenshots
- ❌ Testing only one viewport
- ❌ Not testing error states
- ❌ Marking UI work complete without visual testing

**STOP.** Go back and complete visual testing properly.

## Questions?

See:
- `CLAUDE.md` - Full "Visual Testing & Validation" section
- `openspec/AGENTS.md` - Stage 2, Step 7: Visual Testing Checkpoint
- `tests/screenshots/README.md` - Screenshot directory documentation
- `tests/screenshots/auth/` - Example screenshots from auth pages

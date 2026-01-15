# Visual Test Screenshots

This directory contains screenshots from visual E2E tests using Playwright.

## Purpose

- Verify UI changes visually before marking work complete
- Catch layout breaks and visual regressions
- Document UI states for reference
- Test responsive design across breakpoints

## Directory Structure

```
screenshots/
├── auth/           # Authentication pages
├── timer/          # Timer pages and components
├── workouts/       # Workout-related pages
├── exercises/      # Exercise library pages
├── history/        # Workout history pages
├── settings/       # Settings and profile pages
└── [feature]/      # Other feature areas
```

## Naming Conventions

Screenshots should be named descriptively:

```
[page-name]-[state]-[viewport].png

Examples:
- login-page-desktop.png
- login-error-mobile.png
- signup-form-focused-tablet.png
- timer-running-mobile.png
```

## Standard Viewport Sizes

Use these standard sizes for consistency:

- **Desktop**: 1920x1080
- **Tablet**: 768x1024
- **Mobile**: 375x667 (iPhone SE)

## States to Test

For each page/component, capture:

1. **Default state** - Initial load
2. **Interactive states** - Hover, focus, active
3. **Data states** - Empty, loading, populated
4. **Error states** - Validation errors, API errors
5. **Edge cases** - Long text, many items, etc.

## Workflow

1. Make UI changes
2. Start dev server (`npm run dev`)
3. Use Playwright MCP to navigate and screenshot
4. Review screenshots for quality
5. Fix any issues found
6. Commit screenshots with code changes

## .gitignore Note

Screenshots ARE committed to git to serve as visual documentation and regression detection.

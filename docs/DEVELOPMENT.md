# Development Guide

This guide covers the development workflow, tools, and best practices for contributing to this project.

## Quick Start

```bash
# Install dependencies
npm install

# Start local Supabase
npm run db:start

# Reset database and seed data
npm run db:reset
npm run db:seed

# Generate environment file
npm run dev:env

# Start development server
npm run dev
```

## Development Workflow

### Branch Management

**⚠️ IMPORTANT:** This project has specific branch management requirements to prevent merge conflicts and maintain clean git history.

**See [CLAUDE.md](../CLAUDE.md) - Branch Management & Development Workflow** for the complete, authoritative workflow that must be followed before starting any development work.

Key points:
- Always create feature branches from latest `main`
- Verify working directory is clean before starting
- Use descriptive branch names (`feature/`, `fix/`, `refactor/`, `docs/`)

The CLAUDE.md file contains the detailed step-by-step workflow, examples, and enforcement checklist.

## Code Quality Tools

### Linting

This project uses **ESLint** with Next.js, TypeScript, and Prettier integration.

**Run linting:**
```bash
npm run lint
```

**ESLint configuration:** `.eslintrc.json`
- Extends: `next/core-web-vitals`, `next/typescript`, `prettier`
- Custom rules:
  - `prettier/prettier`: "warn" - Prettier formatting issues
  - `@typescript-eslint/no-unused-vars`: "warn" - Unused variables (allows `_` prefix)
  - `@typescript-eslint/no-explicit-any`: "warn" - Usage of `any` type

**Auto-fix issues:**
Most ESLint issues can be auto-fixed by your IDE or by running:
```bash
npx eslint . --fix
```

### Code Formatting

This project uses **Prettier** for consistent code formatting.

**Prettier configuration:** `.prettierrc`
- Semicolons: enabled
- Quotes: double quotes
- Print width: 100 characters
- Tab width: 2 spaces
- Trailing commas: ES5

**Format code:**
Your IDE should auto-format on save. Alternatively:
```bash
npx prettier --write .
```

**Note:** Prettier runs as part of ESLint (`npm run lint`), so you typically don't need to run it separately.

### TypeScript

TypeScript is configured for strict type checking.

**Type checking:**
```bash
npx tsc --noEmit
```

This is automatically done during `npm run build` and should be integrated into your IDE.

## Testing

### Test Structure

Tests are organized by type:
- **Unit tests:** Co-located with source files (`*.test.ts`, `*.test.tsx`)
- **Integration tests:** In `src/lib/actions/**/*.test.ts`
- **Infrastructure tests:** In `tests/` directory
- **E2E tests:** Using Playwright

See [TESTING.md](./TESTING.md) for complete testing guidelines.

### Running Tests

```bash
# Run all tests in watch mode
npm test

# Run unit tests once
npm run test:unit

# Run integration tests (requires Supabase)
npm run test:integration

# Run all tests once
npm run test:all
```

### Visual Testing

All UI changes must be visually tested using Playwright:

```bash
# Start dev server first
npm run dev

# Use Playwright MCP tools to navigate and screenshot
```

See [VISUAL-TESTING.md](./VISUAL-TESTING.md) for complete visual testing workflow.

## Database Development

### Local Supabase

```bash
# Start Supabase (required for development)
npm run db:start

# Check status
npm run db:status

# Stop Supabase
npm run db:stop
```

**Access points:**
- Studio UI: http://localhost:54323
- API: http://localhost:54321
- Database: postgresql://postgres:postgres@localhost:54322/postgres

### Database Migrations

```bash
# Reset database (run all migrations)
npm run db:reset

# Push schema changes
npm run db:push

# Generate TypeScript types from schema
npm run db:types
```

### Seeding Data

```bash
# Seed all data
npm run db:seed

# Seed test users only
npm run seed:users

# Seed everything
npm run seed:all
```

## Project Architecture

### Server Actions Organization

Server actions are organized **by feature domain**, not by technical function.

**Pattern:** Page/Feature → Actions File
- Profile page → `src/lib/actions/profile.ts`
- Workout management → `src/lib/actions/workouts.ts`
- Exercise library → `src/lib/actions/exercises.ts`

See [SERVER_ACTIONS.md](./SERVER_ACTIONS.md) for complete guidelines.

### File Organization Principles

**Key principle:** When creating the FIRST instance of anything, design as if 10 already exist.

Before creating:
- First test file → Design complete test taxonomy
- First utility → Create category system
- First component of a type → Plan component organization

See [SCALABILITY_TRIGGERS.md](./SCALABILITY_TRIGGERS.md) for details.

## Coding Standards

### TypeScript

- Use strict typing (avoid `any`)
- Prefer interfaces over types for object shapes
- Use Zod for runtime validation
- Generate database types from Supabase schema

### React/Next.js

- Use Server Components by default
- Add `'use client'` only when needed
- Co-locate styles with components
- Use Server Actions for mutations

### Naming Conventions

- **Files:** kebab-case (`user-profile.tsx`)
- **Components:** PascalCase (`UserProfile`)
- **Functions:** camelCase (`getUserProfile`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

### Error Handling

- Validate at system boundaries (user input, external APIs)
- Use Zod schemas for validation
- Return structured errors from Server Actions
- Don't add unnecessary try/catch blocks

## Common Tasks

### Adding a New Page

1. Create route file: `src/app/new-page/page.tsx`
2. Create components: `src/components/new-page/`
3. Create server actions: `src/lib/actions/new-page.ts`
4. Add tests: Co-locate with components and actions
5. Add visual tests: Use Playwright for screenshots

### Adding a New Server Action

1. Determine feature domain
2. Add to appropriate `src/lib/actions/[feature].ts` file
3. Add `'use server'` directive
4. Define Zod validation schema
5. Add integration tests
6. Export function

### Running Database Queries

```typescript
import { createClient } from "@/lib/db/server";

export async function getData() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("table_name")
    .select("*");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
```

## Environment Variables

### Required Variables

Create `.env.local` with:
```bash
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### Auto-generation

For local development:
```bash
npm run dev:env
```

This generates `.env.local` from your local Supabase instance.

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Supabase not starting:**
```bash
# Stop and restart
npm run db:stop
npm run db:start
```

**Database out of sync:**
```bash
# Reset database
npm run db:reset
npm run db:seed
```

**TypeScript errors:**
```bash
# Regenerate database types
npm run db:types
```

### Getting Help

- Check existing documentation in `docs/`
- Review [CLAUDE.md](../CLAUDE.md) for AI assistant workflows
- Check Supabase logs: `supabase logs`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

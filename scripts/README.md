# Scripts Directory

This directory contains utility scripts for development, testing, and maintenance tasks.

## Script Categories

- **Testing Scripts**: Scripts for running tests and validations
  - `test-rls-policies.ts` - Tests Row Level Security policies
  - (Future: `test-visual-*.ts` - Visual testing helpers)

- **Database Scripts**: Scripts for database operations
  - (Future: `migrate-*.ts`, `seed-*.ts`)

- **Build Scripts**: Scripts for build and deployment tasks
  - (Future: `build-*.ts`, `deploy-*.ts`)

- **Utility Scripts**: General utility scripts
  - (Future: `cleanup-*.ts`, `analyze-*.ts`)

## Naming Conventions

- Use kebab-case for script names
- Prefix with category when appropriate (e.g., `test-`, `db-`, `build-`)
- Use descriptive names that indicate what the script does
- Example: `test-rls-policies.ts`, `db-seed-exercises.ts`

## Running Scripts

All scripts should be runnable via `tsx`:

```bash
tsx scripts/script-name.ts
```

Or add them to package.json for convenience:

```json
{
  "scripts": {
    "db:test-rls": "tsx scripts/test-rls-policies.ts"
  }
}
```

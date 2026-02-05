# Personal Trainer App

An AI-powered workout companion app built with Next.js and Supabase.

## Overview

This application provides personalized workout guidance and tracking. Features include:

- User authentication and profiles
- Workout generation and management
- Exercise library and tracking
- Workout history

## Tech Stack

- **Framework:** Next.js 16 (React 19)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Forms:** React Hook Form + Zod validation
- **UI Components:** Radix UI + shadcn/ui
- **Testing:** Vitest + React Testing Library + Playwright

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase CLI (for local development)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tabatimer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   npm run dev:env
   ```

4. Start the local Supabase instance:
   ```bash
   npm run db:start
   ```

5. Run database migrations and seed data:
   ```bash
   npm run db:reset
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests in watch mode |
| `npm run test:unit` | Run unit tests once |
| `npm run test:integration` | Run integration tests |
| `npm run test:all` | Run all tests |

### Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:start` | Start local Supabase |
| `npm run db:stop` | Stop local Supabase |
| `npm run db:status` | Check Supabase status |
| `npm run db:reset` | Reset database (migrations) |
| `npm run db:push` | Push schema changes |
| `npm run db:types` | Generate TypeScript types |
| `npm run db:seed` | Seed database with data |

### Seeding Commands

| Command | Description |
|---------|-------------|
| `npm run seed:users` | Seed test user accounts |
| `npm run seed:all` | Run all seed scripts |

## Documentation

Detailed documentation is available in the `docs/` directory:

- [Development Guide](./docs/DEVELOPMENT.md) - Setup, workflows, and best practices
- [Testing](./docs/TESTING.md) - Testing strategy and guidelines
- [Server Actions](./docs/SERVER_ACTIONS.md) - Server action organization
- [Session Management](./docs/SESSION_MANAGEMENT.md) - Authentication patterns
- [Visual Testing](./docs/VISUAL-TESTING.md) - UI testing with Playwright

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and shared code
│   │   ├── actions/     # Server actions (by feature)
│   │   ├── db/          # Database utilities and types
│   │   └── utils/       # Helper functions
│   └── test/            # Test utilities and helpers
├── tests/               # Infrastructure tests
├── scripts/             # Development and utility scripts
├── supabase/            # Supabase configuration and migrations
└── docs/                # Project documentation
```

## Contributing

Please read [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for development workflow, coding standards, and contribution guidelines.

## License

ISC

# Project Structure

Directory organization conventions and structural requirements for the TabaTimer codebase.

## Requirements

### Requirement: Feature-First Organization
The project SHALL organize code by feature/capability rather than by technical type.

#### Scenario: Component organization
- **WHEN** creating a component
- **THEN** component SHALL be placed in feature directory
- **AND** SHALL use pattern `src/components/[feature]/ComponentName.tsx`
- **AND** example: `src/components/timer/Timer.tsx`, not `src/components/Timer.tsx`

#### Scenario: Feature subdirectories
- **WHEN** a feature has multiple related components
- **THEN** components SHALL be grouped in feature subdirectory
- **AND** example: `src/components/timer/` for all timer-related components
- **AND** example: `src/components/workout/` for all workout-related components

#### Scenario: Shared components
- **WHEN** a component is truly shared across multiple features
- **THEN** component SHALL be placed in `src/components/shared/`
- **AND** SHALL only be used for genuinely reusable components
- **AND** feature-specific components SHALL NOT go in shared

### Requirement: Utility Organization by Category
The project SHALL organize utilities into categorized subdirectories, not flat files.

#### Scenario: Time utilities
- **WHEN** creating time-related utility functions
- **THEN** functions SHALL be in `src/lib/utils/time.ts`
- **AND** SHALL have co-located test at `src/lib/utils/time.test.ts`

#### Scenario: String utilities
- **WHEN** creating string manipulation functions
- **THEN** functions SHALL be in `src/lib/utils/string.ts`

#### Scenario: Array utilities
- **WHEN** creating array helper functions
- **THEN** functions SHALL be in `src/lib/utils/array.ts`

#### Scenario: Validation utilities
- **WHEN** creating input validation functions
- **THEN** functions SHALL be in `src/lib/utils/validation.ts`

#### Scenario: Prevent junk drawer
- **WHEN** considering adding to utils
- **THEN** SHALL identify appropriate category first
- **AND** SHALL create new category if needed
- **AND** SHALL NOT add to generic `utils.ts` file

### Requirement: API Route Organization
The project SHALL organize API routes by feature and action.

#### Scenario: API route structure
- **WHEN** creating an API endpoint
- **THEN** SHALL use pattern `app/api/[feature]/[action]/route.ts`
- **AND** example: `app/api/workouts/generate/route.ts`
- **AND** example: `app/api/exercises/search/route.ts`

#### Scenario: RESTful conventions
- **WHEN** implementing CRUD operations
- **THEN** SHALL use RESTful action names:
  - `create` for POST operations
  - `list` or `search` for GET collections
  - `update` for PUT/PATCH operations
  - `delete` for DELETE operations

#### Scenario: API route grouping
- **WHEN** a feature has multiple endpoints
- **THEN** all SHALL be under same feature directory
- **AND** example: `app/api/workouts/generate/`, `app/api/workouts/save/`, `app/api/workouts/list/`

### Requirement: Hook Organization
The project SHALL organize custom React hooks in feature-specific or shared directories.

#### Scenario: Feature-specific hooks
- **WHEN** creating a hook used by single feature
- **THEN** hook SHALL be co-located with feature
- **AND** example: `src/components/timer/useTimer.ts`
- **AND** SHALL have co-located test

#### Scenario: Shared hooks
- **WHEN** creating a hook used across multiple features
- **THEN** hook SHALL be in `src/hooks/`
- **AND** SHALL use camelCase naming starting with 'use'
- **AND** example: `src/hooks/useAuth.ts`, `src/hooks/useMediaQuery.ts`

#### Scenario: Hook naming
- **WHEN** naming any hook
- **THEN** name SHALL start with 'use' prefix
- **AND** SHALL be descriptive of hook's purpose
- **AND** example: `useTimer`, `useWorkoutGenerator`, `useAudioCues`

### Requirement: Directory Structure Initialization
The project SHALL initialize with a complete, scalable directory structure.

#### Scenario: Core directories exist
- **WHEN** project is initialized
- **THEN** the following directories SHALL exist:
  - `src/app/` (Next.js App Router)
  - `src/components/` (React components)
  - `src/lib/` (utility libraries)
  - `src/hooks/` (shared React hooks)
  - `src/types/` (TypeScript types)
  - `src/actions/` (Server Actions)
  - `src/test/` (test utilities)
  - `tests/` (infrastructure tests)
  - `e2e/` (end-to-end tests)
  - `docs/` (documentation)

#### Scenario: Feature directories exist
- **WHEN** project is initialized with known features
- **THEN** feature directories SHALL be created:
  - `src/components/timer/`
  - `src/components/workout/`
  - `src/components/ui/` (shadcn/ui components)
  - `src/components/shared/` (truly shared components)

#### Scenario: Utility categories exist
- **WHEN** project is initialized
- **THEN** utility category structure SHALL exist:
  - `src/lib/utils/` (categorized utilities)
  - `src/lib/db/` (database client and queries)
  - `src/lib/ai/` (AI integration)
  - `src/lib/supabase/` (Supabase helpers)

### Requirement: No Flat Directories
The project SHALL prevent flat directories that will grow unbounded.

#### Scenario: Component directory limit
- **WHEN** a directory contains 10+ components
- **THEN** components SHALL be organized into subdirectories
- **AND** SHALL group by feature, purpose, or domain

#### Scenario: Scripts organization
- **WHEN** project has scripts/tooling
- **THEN** scripts SHALL be categorized:
  - `scripts/database/` (database operations)
  - `scripts/deployment/` (build, deploy)
  - `scripts/development/` (setup, generators)
- **AND** SHALL NOT be in flat `scripts/` directory

#### Scenario: Utils organization
- **WHEN** utilities are added
- **THEN** SHALL be in categorized files (`time.ts`, `string.ts`, etc.)
- **AND** SHALL NOT accumulate in single `utils.ts` file

### Requirement: Documentation Structure
The project SHALL organize documentation by purpose and audience.

#### Scenario: Technical documentation
- **WHEN** documenting technical decisions or architecture
- **THEN** documentation SHALL be in `docs/` directory
- **AND** SHALL use descriptive names
- **AND** examples: `TESTING.md`, `SCALABILITY_TRIGGERS.md`, `ARCHITECTURE.md`

#### Scenario: API documentation
- **WHEN** documenting API endpoints
- **THEN** SHALL be in `docs/api/` subdirectory
- **AND** SHALL organize by feature

#### Scenario: OpenSpec documentation
- **WHEN** creating specifications and proposals
- **THEN** SHALL use `openspec/` directory structure:
  - `openspec/specs/` (current specifications)
  - `openspec/changes/` (active proposals)
  - `openspec/changes/archive/` (completed changes)
  - `openspec/project.md` (project conventions)
  - `openspec/AGENTS.md` (AI assistant instructions)

### Requirement: Type Organization
The project SHALL organize TypeScript types by feature or shared usage.

#### Scenario: Database types
- **WHEN** defining database schema types
- **THEN** types SHALL be in `src/types/database.ts`
- **AND** SHALL be generated from Supabase schema

#### Scenario: Feature types
- **WHEN** defining types for a feature
- **THEN** types SHALL be in `src/types/[feature].ts`
- **AND** examples: `src/types/workout.ts`, `src/types/timer.ts`, `src/types/exercise.ts`

#### Scenario: Shared types
- **WHEN** defining types used across features
- **THEN** types SHALL be in `src/types/common.ts`
- **AND** SHALL only include genuinely shared types

### Requirement: Co-location of Related Files
The project SHALL co-locate related files to improve discoverability.

#### Scenario: Component and test
- **WHEN** a component has tests
- **THEN** test SHALL be in same directory
- **AND** SHALL use pattern `ComponentName.test.tsx`

#### Scenario: Component and styles
- **WHEN** a component has component-specific styles
- **THEN** styles SHALL be in same directory
- **AND** SHALL use pattern `ComponentName.module.css`

#### Scenario: Component and stories
- **WHEN** a component has Storybook stories
- **THEN** stories SHALL be in same directory
- **AND** SHALL use pattern `ComponentName.stories.tsx`

#### Scenario: Utility and test
- **WHEN** a utility function has tests
- **THEN** test SHALL be in same directory
- **AND** SHALL use pattern `utilityName.test.ts`

### Requirement: README Files for Navigation
The project SHALL include README files in directories to explain organization.

#### Scenario: Component directory README
- **WHEN** a feature has multiple components
- **THEN** feature directory SHALL include `README.md`
- **AND** SHALL explain what components belong in this directory
- **AND** SHALL show examples

#### Scenario: Scripts directory README
- **WHEN** scripts exist
- **THEN** `scripts/README.md` SHALL explain:
  - Purpose of each subdirectory
  - Naming conventions
  - How to add new scripts

#### Scenario: Test directory README
- **WHEN** infrastructure tests exist
- **THEN** `tests/README.md` SHALL explain:
  - What tests belong here
  - How to run tests
  - Helper utilities available

### Requirement: Prevent Parallel Structures
The project SHALL NOT create multiple directories serving the same purpose.

#### Scenario: Single script location
- **WHEN** adding automation scripts
- **THEN** SHALL use `scripts/` directory only
- **AND** SHALL NOT create `tools/`, `bin/`, or `util-scripts/` alternatives

#### Scenario: Single utility location
- **WHEN** adding utility functions
- **THEN** SHALL use `src/lib/utils/` only
- **AND** SHALL NOT create `src/helpers/`, `src/common/`, or `src/shared/` for utilities

#### Scenario: Single test location per type
- **WHEN** adding tests
- **THEN** SHALL follow established convention:
  - Co-located for unit/integration
  - `tests/` for infrastructure
  - `e2e/` for end-to-end
- **AND** SHALL NOT create alternative test directories

### Requirement: Directory Naming Conventions
The project SHALL use consistent naming conventions for directories.

#### Scenario: Directory name format
- **WHEN** creating any directory
- **THEN** name SHALL use kebab-case (lowercase with hyphens)
- **AND** examples: `workout-generator`, `user-profile`, `api-routes`
- **AND** NOT camelCase, PascalCase, or snake_case

#### Scenario: Directory name clarity
- **WHEN** naming a directory
- **THEN** name SHALL be descriptive and unambiguous
- **AND** SHALL indicate purpose or feature
- **AND** SHALL NOT use generic names like `stuff`, `misc`, `other`

#### Scenario: Directory name consistency
- **WHEN** naming similar directories
- **THEN** SHALL use parallel naming structure
- **AND** example: `workout-list`, `workout-detail`, `workout-edit` (all start with feature name)

### Requirement: File Naming Conventions
The project SHALL use consistent naming conventions for files.

#### Scenario: Component files
- **WHEN** creating a React component
- **THEN** file SHALL use PascalCase
- **AND** SHALL match component name
- **AND** example: `Timer.tsx`, `WorkoutCard.tsx`, `ExerciseList.tsx`

#### Scenario: Utility files
- **WHEN** creating utility files
- **THEN** file SHALL use camelCase
- **AND** example: `time.ts`, `formatters.ts`, `validators.ts`

#### Scenario: Test files
- **WHEN** creating test files
- **THEN** SHALL use same name as source file plus `.test.ts` or `.test.tsx`
- **AND** example: `Timer.test.tsx`, `time.test.ts`

#### Scenario: Configuration files
- **WHEN** creating config files
- **THEN** SHALL use standard tool names
- **AND** examples: `vitest.config.ts`, `tsconfig.json`

## Design Decisions

### Why Feature-First Organization?
- **Discoverability**: Related code lives together
- **Scalability**: Features can grow independently
- **Mental model**: Matches how developers think about the app
- **Refactoring**: Easier to extract or remove entire features

### Why Categorized Utils?
- **Prevents junk drawer**: No 1000-line utils.ts file
- **Clear purpose**: Each file has specific domain
- **Easy to find**: Know exactly where to look
- **Scalable**: Can add categories without reorganization

### Why Co-location?
- **Visibility**: Related files are immediately visible
- **Maintenance**: Easy to keep files in sync
- **Deletion**: Removing feature removes all related files
- **Navigation**: No jumping between distant directories

### Why READMEs?
- **Self-documenting**: Structure explains itself
- **Onboarding**: New developers understand organization
- **Consistency**: Guidelines prevent drift
- **Examples**: Show correct patterns

## Anti-Patterns

The following patterns SHALL NOT be used:

- ❌ Flat `src/components/` with 50+ components
- ❌ Single `utils.ts` or `helpers.ts` file
- ❌ Parallel structures: `scripts/` + `tools/` + `bin/`
- ❌ Generic directories: `stuff/`, `misc/`, `other/`
- ❌ Numbered files: `component1.tsx`, `test2.ts`
- ❌ Temporary names: `new-component.tsx`, `temp.ts`
- ❌ Type-based organization: `src/components/`, `src/containers/`, `src/presentational/`

## Related Specifications
- `openspec/specs/testing/spec.md` - Test organization requirements
- `openspec/project.md` - Architecture principles and conventions

## Migration Path

If existing structure doesn't match requirements:
1. Identify violations (flat directories, uncategorized files)
2. Create proper structure
3. Move files to correct locations
4. Update imports
5. Add README files
6. Document the pattern

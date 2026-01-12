# Testing

Test organization and infrastructure for the TabaTimer project.

## Requirements

### Requirement: Test Organization by Type
The project SHALL organize tests into four distinct categories with separate execution environments and locations.

#### Scenario: Unit test placement
- **WHEN** creating a unit test for a component, hook, or utility function
- **THEN** the test file SHALL be co-located with the source file
- **AND** SHALL use `.test.ts` or `.test.tsx` extension
- **AND** SHALL be excluded from production builds

#### Scenario: Integration test placement
- **WHEN** creating an integration test for server actions or database queries
- **THEN** the test SHALL be co-located in `src/lib/actions/**/*.test.ts`
- **AND** SHALL use Node environment
- **AND** SHALL have longer timeouts for database operations

#### Scenario: Infrastructure test placement
- **WHEN** creating tests for database migrations, RLS policies, or seed data
- **THEN** the test SHALL be placed in `/tests/database/` directory
- **AND** SHALL use real database (development or test instance)
- **AND** SHALL have extended timeouts (30s+)

#### Scenario: E2E test placement
- **WHEN** creating end-to-end tests for user flows
- **THEN** the test SHALL be placed in `/e2e/` directory
- **AND** SHALL use `.spec.ts` extension (Playwright convention)
- **AND** SHALL test complete user journeys through the UI

### Requirement: Vitest Workspace Configuration
The project SHALL use Vitest workspace to manage separate test configurations for different test types.

#### Scenario: Unit test configuration
- **WHEN** running unit tests
- **THEN** tests matching `src/**/*.test.{ts,tsx}` SHALL execute
- **AND** SHALL exclude `src/lib/actions/**/*.test.ts`
- **AND** SHALL use jsdom environment
- **AND** SHALL load test setup from `./src/test/setup.ts`

#### Scenario: Integration test configuration
- **WHEN** running integration tests
- **THEN** tests matching `src/lib/actions/**/*.test.ts` SHALL execute
- **AND** SHALL use Node environment
- **AND** SHALL have 10s timeout minimum

#### Scenario: Infrastructure test configuration
- **WHEN** running infrastructure tests
- **THEN** tests matching `tests/**/*.test.ts` SHALL execute
- **AND** SHALL use Node environment
- **AND** SHALL have 30s timeout minimum

### Requirement: Test Helper Structure
The project SHALL provide reusable test utilities in standardized locations.

#### Scenario: Database test helpers
- **WHEN** a test needs to create test data
- **THEN** helpers SHALL be available in `src/test/helpers/test-db.ts`
- **AND** SHALL provide functions like `createTestUser()`, `createTestWorkout()`
- **AND** SHALL provide cleanup functions like `cleanupTestData()`

#### Scenario: Auth test helpers
- **WHEN** a test needs authenticated clients
- **THEN** helpers SHALL be available in `src/test/helpers/test-auth.ts`
- **AND** SHALL provide `signInTestUser()`, `createAuthenticatedClient()`

#### Scenario: Test fixtures
- **WHEN** tests need consistent test data
- **THEN** fixtures SHALL be defined in `src/test/helpers/fixtures.ts`
- **AND** SHALL export constants like `TEST_USERS`, `TEST_WORKOUTS`, `TEST_EXERCISES`

#### Scenario: Mock implementations
- **WHEN** tests need mocked dependencies
- **THEN** mocks SHALL be placed in `src/test/mocks/`
- **AND** SHALL be organized by module (e.g., `supabase.ts`, `next-navigation.ts`)

### Requirement: Test Execution Scripts
The project SHALL provide npm scripts for running different test categories independently.

#### Scenario: Running unit tests only
- **WHEN** developer executes `npm run test:unit`
- **THEN** only unit tests SHALL run
- **AND** SHALL use Vitest workspace 'unit' project

#### Scenario: Running integration tests only
- **WHEN** developer executes `npm run test:integration`
- **THEN** only integration tests SHALL run
- **AND** SHALL use Vitest workspace 'integration' project

#### Scenario: Running infrastructure tests only
- **WHEN** developer executes `npm run test:infrastructure`
- **THEN** only infrastructure tests SHALL run
- **AND** SHALL use Vitest workspace 'infrastructure' project

#### Scenario: Running E2E tests only
- **WHEN** developer executes `npm run test:e2e`
- **THEN** only Playwright E2E tests SHALL run

#### Scenario: Running all tests
- **WHEN** developer executes `npm run test:all`
- **THEN** unit, integration, infrastructure, and E2E tests SHALL run sequentially

### Requirement: Test Discovery and Naming
The project SHALL use consistent naming conventions that make tests easy to discover.

#### Scenario: Finding all unit tests
- **WHEN** searching for unit tests
- **THEN** glob pattern `src/**/*.test.{ts,tsx}` SHALL match all unit tests
- **AND** SHALL exclude integration tests in actions directory

#### Scenario: Finding infrastructure tests
- **WHEN** searching for infrastructure tests
- **THEN** all files in `tests/database/` SHALL be infrastructure tests
- **AND** SHALL follow pattern `tests/database/*.test.ts`

#### Scenario: Test file naming
- **WHEN** creating a new test file
- **THEN** SHALL use same base name as source file
- **AND** SHALL append `.test.ts` or `.test.tsx` extension
- **AND** SHALL be in same directory as source file (for unit/integration)

### Requirement: Test Database Configuration
The project SHALL use development database for tests requiring database access.

#### Scenario: Database connection in tests
- **WHEN** infrastructure or integration tests run
- **THEN** tests SHALL connect using `.env` file configuration
- **AND** SHALL use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **AND** SHALL never modify production database

#### Scenario: Test data cleanup
- **WHEN** tests create data in database
- **THEN** tests SHALL clean up data in `afterAll` or `afterEach` hooks
- **AND** SHALL use helper functions from `test-db.ts`
- **AND** SHALL ensure no data leaks between test runs

### Requirement: Co-located Test Convention
The project SHALL co-locate tests with source code for unit and integration tests.

#### Scenario: Component test location
- **WHEN** testing a component at `src/components/timer/Timer.tsx`
- **THEN** test SHALL be at `src/components/timer/Timer.test.tsx`

#### Scenario: Utility test location
- **WHEN** testing a utility at `src/lib/utils/time.ts`
- **THEN** test SHALL be at `src/lib/utils/time.test.ts`

#### Scenario: Server action test location
- **WHEN** testing a server action at `src/lib/actions/workout-actions.ts`
- **THEN** test SHALL be at `src/lib/actions/workout-actions.test.ts`

#### Scenario: Benefits of co-location
- **WHEN** developer views a source file
- **THEN** test file SHALL be immediately visible in same directory
- **AND** import paths SHALL be simpler (no `../../../test/`)
- **AND** deleting source file naturally prompts deleting test

### Requirement: Test Documentation
The project SHALL maintain comprehensive testing documentation.

#### Scenario: Testing guide exists
- **WHEN** developer needs testing guidance
- **THEN** documentation SHALL exist at `docs/TESTING.md`
- **AND** SHALL explain test categories and when to use each
- **AND** SHALL show examples of each test type
- **AND** SHALL document helper usage patterns

#### Scenario: Test structure in SCALABLE_TEST_STRUCTURE.md
- **WHEN** developer needs detailed structural guidance
- **THEN** documentation SHALL exist at `docs/SCALABLE_TEST_STRUCTURE.md`
- **AND** SHALL show complete directory structure
- **AND** SHALL include migration plans for existing tests
- **AND** SHALL provide helper implementation examples

### Requirement: Directory Structure Initialization
The project SHALL initialize with test directories and scaffolding.

#### Scenario: Test directories exist
- **WHEN** project is set up
- **THEN** the following directories SHALL exist:
  - `src/test/helpers/` (test utilities)
  - `src/test/mocks/` (mock implementations)
  - `tests/database/` (infrastructure tests)
  - `tests/fixtures/` (shared test data)
  - `e2e/` (end-to-end tests)

#### Scenario: Helper files exist
- **WHEN** project is set up
- **THEN** skeleton helper files SHALL exist:
  - `src/test/helpers/test-db.ts` (with common patterns)
  - `src/test/helpers/test-auth.ts` (with auth utilities)
  - `src/test/helpers/fixtures.ts` (with test data exports)

#### Scenario: Configuration files exist
- **WHEN** project is set up
- **THEN** test configuration SHALL exist:
  - `vitest.workspace.ts` (workspace configuration)
  - `src/test/setup.ts` (test environment setup)
  - `playwright.config.ts` (E2E configuration)

## Design Decisions

### Why Co-located Tests?
- **Discoverability**: Tests are immediately visible next to source code
- **Maintenance**: Easier to keep tests in sync with code changes
- **Deletion safety**: Deleting source naturally prompts test deletion
- **Import simplicity**: No deep relative imports needed
- **Mental model**: Clear 1:1 relationship between code and tests

### Why Separate Infrastructure Tests?
- **Different concern**: Testing database-level guarantees, not application logic
- **Different execution**: Run less frequently, longer duration
- **Different scope**: Broader than single function/component
- **Clear organization**: All database tests in one place

### Why Vitest Workspace?
- **Separate environments**: jsdom for components, Node for server code
- **Different timeouts**: Fast for unit, longer for integration/infrastructure
- **Selective execution**: Run only tests you need during development
- **Parallel execution**: Different test types can run simultaneously

### Why Development Database?
- **Simplicity**: No separate test database setup needed
- **Reality**: Tests use same database as development
- **Speed**: Local Supabase is fast enough for testing
- **Cleanup**: Tests clean up after themselves

## Related Specifications
- `openspec/specs/project-structure/spec.md` - Overall project organization
- `openspec/project.md` - Architecture principles including "Design for 10th Instance"

## Migration Notes
If tests exist in non-standard locations (e.g., `scripts/`), they should be migrated:
1. Identify test category (unit, integration, infrastructure, e2e)
2. Move to appropriate location
3. Convert to proper test framework format (Vitest or Playwright)
4. Extract reusable logic to helper files
5. Update npm scripts
6. Delete old test files

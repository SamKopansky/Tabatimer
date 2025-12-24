# User Authentication Capability

## ADDED Requirements

### Requirement: Email/Password Authentication
The system SHALL support user registration and login using email and password with secure password hashing via Supabase Auth.

#### Scenario: User registration
- **WHEN** user provides email and password (min 8 characters)
- **THEN** create account in Supabase Auth and send verification email

#### Scenario: Email verification
- **WHEN** user clicks verification link in email
- **THEN** activate account and allow login

#### Scenario: Login with credentials
- **WHEN** user provides registered email and correct password
- **THEN** authenticate user and establish session with HTTP-only cookies

#### Scenario: Login with incorrect password
- **WHEN** user provides registered email but incorrect password
- **THEN** reject with error "Invalid email or password" without revealing which is incorrect

### Requirement: OAuth Social Login
The system SHALL support OAuth authentication with Google and Apple sign-in options for frictionless onboarding.

#### Scenario: Google OAuth login
- **WHEN** user selects "Sign in with Google"
- **THEN** redirect to Google OAuth flow and create/login user account upon successful authorization

#### Scenario: Apple OAuth login
- **WHEN** user selects "Sign in with Apple"
- **THEN** redirect to Apple OAuth flow and create/login user account upon successful authorization

#### Scenario: OAuth account linking
- **WHEN** user signs in with Google using email that matches existing password account
- **THEN** link OAuth provider to existing account allowing login via either method

### Requirement: Magic Link Authentication
The system SHALL support passwordless magic link authentication where user receives email with secure login link.

#### Scenario: Request magic link
- **WHEN** user enters email and requests magic link
- **THEN** send email with time-limited (15 minutes) secure login link

#### Scenario: Magic link login
- **WHEN** user clicks valid magic link
- **THEN** authenticate user and establish session without password requirement

#### Scenario: Expired magic link
- **WHEN** user clicks magic link after 15 minutes
- **THEN** reject with error "Link expired" and offer to send new link

### Requirement: Session Management
The system SHALL manage user sessions using HTTP-only cookies with automatic refresh before expiration and secure session storage.

#### Scenario: Session establishment
- **WHEN** user successfully authenticates
- **THEN** create session with HTTP-only cookie preventing XSS attacks

#### Scenario: Session refresh
- **WHEN** user's session token is within 1 hour of expiration
- **THEN** automatically refresh session in background without user interaction

#### Scenario: Session expiration
- **WHEN** session expires (default 7 days of inactivity)
- **THEN** clear session and redirect to login with message "Session expired, please sign in again"

### Requirement: Protected Routes
The system SHALL protect authenticated routes (timer, workouts, history, profile) requiring valid session and redirect unauthenticated users to login page.

#### Scenario: Access protected route when authenticated
- **WHEN** authenticated user navigates to /timer or /workouts or /history
- **THEN** allow access and display protected content

#### Scenario: Access protected route when not authenticated
- **WHEN** non-authenticated user attempts to access protected route
- **THEN** redirect to /login with return URL parameter to redirect back after successful login

#### Scenario: Post-login redirect
- **WHEN** user logs in from redirect
- **THEN** redirect to originally requested protected route or default to /timer

### Requirement: User Profile Management
The system SHALL allow users to update profile information including display name, email, password, and account preferences.

#### Scenario: Update display name
- **WHEN** user updates display name in profile settings
- **THEN** save new name and reflect in UI immediately

#### Scenario: Change password
- **WHEN** authenticated user provides current password and new password (min 8 characters)
- **THEN** verify current password and update to new password with secure hashing

#### Scenario: Change email address
- **WHEN** user changes email address
- **THEN** send verification email to new address and update after verification

### Requirement: Password Reset Flow
The system SHALL provide secure password reset via email for users who forgot their password.

#### Scenario: Request password reset
- **WHEN** user enters email on "Forgot Password" page
- **THEN** send password reset email with time-limited (1 hour) secure link

#### Scenario: Reset password with link
- **WHEN** user clicks valid reset link and provides new password
- **THEN** update password and invalidate all existing sessions requiring re-login

#### Scenario: Invalid reset link
- **WHEN** user clicks expired or invalid reset link
- **THEN** show error "Reset link is invalid or expired" with option to request new link

### Requirement: Account Deletion
The system SHALL allow users to permanently delete their account and all associated data with confirmation step to prevent accidental deletion.

#### Scenario: Request account deletion
- **WHEN** user selects "Delete Account" in settings
- **THEN** show confirmation dialog requiring password re-entry and explaining data will be permanently deleted

#### Scenario: Confirm account deletion
- **WHEN** user confirms deletion with correct password
- **THEN** delete user account and all associated data (workouts, history, preferences) from database
- **AND** invalidate session and redirect to homepage

### Requirement: Server-Side Authentication Checks
The system SHALL verify authentication server-side in Server Components and Server Actions, never trusting client-side auth state for security decisions.

#### Scenario: Server Component auth check
- **WHEN** rendering protected Server Component
- **THEN** verify session server-side and return 401 or redirect if invalid

#### Scenario: Server Action auth check
- **WHEN** executing Server Action (e.g., save workout)
- **THEN** verify user session at start of action and reject if not authenticated

### Requirement: Row Level Security (RLS)
The system SHALL enforce Row Level Security in Supabase database ensuring users can only access their own data at database level regardless of application logic.

#### Scenario: RLS policy for workouts
- **WHEN** database query accesses workouts table
- **THEN** RLS policy automatically filters to only rows where user_id matches authenticated user

#### Scenario: RLS prevents unauthorized access
- **WHEN** malicious actor attempts direct database query for other user's data
- **THEN** RLS blocks query at database level returning empty result or error

### Requirement: Authentication Error Handling
The system SHALL provide clear, user-friendly error messages for authentication failures without revealing sensitive information.

#### Scenario: Generic login error
- **WHEN** login fails due to wrong email or password
- **THEN** show "Invalid email or password" without revealing which field is incorrect

#### Scenario: Account locked error
- **WHEN** account is locked due to too many failed attempts
- **THEN** show "Account temporarily locked. Please try again in 15 minutes or reset your password"

#### Scenario: Network error during auth
- **WHEN** authentication request fails due to network issues
- **THEN** show "Unable to connect. Please check your internet connection and try again"

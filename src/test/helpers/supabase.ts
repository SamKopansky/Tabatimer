import { vi } from 'vitest'
import type { User, Session, AuthError } from '@supabase/supabase-js'

/**
 * Mock Supabase client for testing Server Actions
 */

export interface MockAuthResponse {
  data: {
    user: User | null
    session: Session | null
  }
  error: AuthError | null
}

export interface MockActionResult {
  data: { user: User | null; session: Session | null } | null
  error: AuthError | null
}

/**
 * Create a mock Supabase auth user
 */
export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {
      display_name: 'Test User',
      ...overrides.user_metadata,
    },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    ...overrides,
  } as User
}

/**
 * Create a mock Supabase session
 */
export function createMockSession(user?: User): Session {
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: user || createMockUser(),
  } as Session
}

/**
 * Create a mock auth error
 */
export function createMockAuthError(
  message: string,
  status: number = 400
): AuthError {
  return {
    name: 'AuthError',
    message,
    status,
  } as AuthError
}

/**
 * Mock successful signup response
 */
export function mockSignUpSuccess(user?: User): MockAuthResponse {
  const mockUser = user || createMockUser()
  return {
    data: {
      user: mockUser,
      session: createMockSession(mockUser),
    },
    error: null,
  }
}

/**
 * Mock signup with email confirmation required (no session)
 */
export function mockSignUpWithConfirmation(user?: User): MockAuthResponse {
  return {
    data: {
      user: user || createMockUser(),
      session: null,
    },
    error: null,
  }
}

/**
 * Mock signup error
 */
export function mockSignUpError(message: string): MockAuthResponse {
  return {
    data: {
      user: null,
      session: null,
    },
    error: createMockAuthError(message),
  }
}

/**
 * Mock successful signin response
 */
export function mockSignInSuccess(user?: User): MockAuthResponse {
  const mockUser = user || createMockUser()
  return {
    data: {
      user: mockUser,
      session: createMockSession(mockUser),
    },
    error: null,
  }
}

/**
 * Mock signin error
 */
export function mockSignInError(message: string): MockAuthResponse {
  return {
    data: {
      user: null,
      session: null,
    },
    error: createMockAuthError(message),
  }
}

/**
 * Mock successful password reset request
 */
export function mockPasswordResetSuccess(): { data: object; error: null } {
  return {
    data: {},
    error: null,
  }
}

/**
 * Mock password reset error
 */
export function mockPasswordResetError(
  message: string
): { data: object; error: AuthError } {
  return {
    data: {},
    error: createMockAuthError(message),
  }
}

/**
 * Mock successful OTP (magic link) send
 */
export function mockOtpSuccess(): { data: object; error: null } {
  return {
    data: {},
    error: null,
  }
}

/**
 * Mock OTP send error
 */
export function mockOtpError(message: string): { data: object; error: AuthError } {
  return {
    data: {},
    error: createMockAuthError(message),
  }
}

/**
 * Create a complete mock Supabase client
 */
export function createMockSupabaseClient() {
  return {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOtp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
      resend: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  }
}

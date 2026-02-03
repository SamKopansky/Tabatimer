import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { signUp } from '../auth'
import {
  createMockSupabaseClient,
  createMockUser,
  mockSignUpSuccess,
  mockSignUpWithConfirmation,
  mockSignUpError,
} from '@/test/helpers/supabase'

// Mock the Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock Next.js redirect
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error('NEXT_REDIRECT')
  }),
}))

// Import mocked modules
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

describe('signUp', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase = createMockSupabaseClient()
    ;(createClient as Mock).mockResolvedValue(mockSupabase)
  })

  describe('validation', () => {
    it('should reject invalid email format', async () => {
      const formData = new FormData()
      formData.append('email', 'invalid-email')
      formData.append('password', 'ValidPass123!')

      const result = await signUp(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid email address')
      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled()
    })

    it('should reject password shorter than 8 characters', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'short')

      const result = await signUp(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Password must be at least 8 characters')
      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled()
    })

    it('should reject display name shorter than 2 characters', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'ValidPass123!')
      formData.append('displayName', 'X')

      const result = await signUp(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Display name must be at least 2 characters')
      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled()
    })
  })

  describe('successful signup with auto-confirmation', () => {
    it('should create user and redirect to home', async () => {
      const mockUser = createMockUser({
        email: 'newuser@example.com',
        user_metadata: { display_name: 'New User' },
      })

      mockSupabase.auth.signUp.mockResolvedValue(mockSignUpSuccess(mockUser))

      const formData = new FormData()
      formData.append('email', 'newuser@example.com')
      formData.append('password', 'SecurePass123!')
      formData.append('displayName', 'New User')

      await expect(signUp(formData)).rejects.toThrow('NEXT_REDIRECT')

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        options: {
          data: {
            display_name: 'New User',
          },
        },
      })

      expect(redirect).toHaveBeenCalledWith('/')
    })
  })

  describe('signup with email confirmation required', () => {
    it('should redirect to verify-email page when confirmation needed', async () => {
      const mockUser = createMockUser({
        email: 'needsconfirm@example.com',
      })

      mockSupabase.auth.signUp.mockResolvedValue(mockSignUpWithConfirmation(mockUser))

      const formData = new FormData()
      formData.append('email', 'needsconfirm@example.com')
      formData.append('password', 'SecurePass123!')
      formData.append('displayName', 'Need Confirm')

      await expect(signUp(formData)).rejects.toThrow('NEXT_REDIRECT')

      expect(redirect).toHaveBeenCalledWith(
        '/auth/verify-email?email=needsconfirm%40example.com'
      )
    })
  })

  describe('error handling', () => {
    it('should return error when email already exists', async () => {
      mockSupabase.auth.signUp.mockResolvedValue(
        mockSignUpError('User already registered')
      )

      const formData = new FormData()
      formData.append('email', 'existing@example.com')
      formData.append('password', 'SecurePass123!')
      formData.append('displayName', 'Existing')

      const result = await signUp(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('User already registered')
    })

    it('should return error when user creation fails', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      })

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'SecurePass123!')
      formData.append('displayName', 'Test User')

      const result = await signUp(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create user account')
    })

    it('should handle unexpected errors gracefully', async () => {
      mockSupabase.auth.signUp.mockRejectedValue(new Error('Network error'))

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'SecurePass123!')
      formData.append('displayName', 'Test User')

      const result = await signUp(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })
})

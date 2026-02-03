import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { requestPasswordReset, confirmPasswordReset } from '../auth'
import {
  createMockSupabaseClient,
  mockPasswordResetSuccess,
  mockPasswordResetError,
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

describe('requestPasswordReset', () => {
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

      const result = await requestPasswordReset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid email address')
      expect(mockSupabase.auth.resetPasswordForEmail).not.toHaveBeenCalled()
    })
  })

  describe('successful password reset request', () => {
    it('should send reset email and return success message', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue(
        mockPasswordResetSuccess()
      )

      const formData = new FormData()
      formData.append('email', 'user@example.com')

      const result = await requestPasswordReset(formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Password reset link sent! Please check your email.')

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'user@example.com',
        {
          redirectTo: 'http://localhost:3000/auth/reset-password',
        }
      )
    })
  })

  describe('error handling', () => {
    it('should return error when reset email fails', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue(
        mockPasswordResetError('Email service unavailable')
      )

      const formData = new FormData()
      formData.append('email', 'user@example.com')

      const result = await requestPasswordReset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email service unavailable')
    })

    it('should handle unexpected errors gracefully', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockRejectedValue(
        new Error('Network error')
      )

      const formData = new FormData()
      formData.append('email', 'user@example.com')

      const result = await requestPasswordReset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })
})

describe('confirmPasswordReset', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase = createMockSupabaseClient()
    ;(createClient as Mock).mockResolvedValue(mockSupabase)
  })

  describe('validation', () => {
    it('should reject password shorter than 8 characters', async () => {
      const formData = new FormData()
      formData.append('password', 'short')
      formData.append('confirmPassword', 'short')

      const result = await confirmPasswordReset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Password must be at least 8 characters')
      expect(mockSupabase.auth.updateUser).not.toHaveBeenCalled()
    })

    it('should reject when passwords do not match', async () => {
      const formData = new FormData()
      formData.append('password', 'NewSecurePass123!')
      formData.append('confirmPassword', 'DifferentPass123!')

      const result = await confirmPasswordReset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe("Passwords don't match")
      expect(mockSupabase.auth.updateUser).not.toHaveBeenCalled()
    })

    it('should reject empty confirm password', async () => {
      const formData = new FormData()
      formData.append('password', 'NewSecurePass123!')
      formData.append('confirmPassword', '')

      const result = await confirmPasswordReset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Please confirm your password')
      expect(mockSupabase.auth.updateUser).not.toHaveBeenCalled()
    })
  })

  describe('successful password reset', () => {
    it('should update password and redirect to login', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const formData = new FormData()
      formData.append('password', 'NewSecurePass123!')
      formData.append('confirmPassword', 'NewSecurePass123!')

      await expect(confirmPasswordReset(formData)).rejects.toThrow('NEXT_REDIRECT')

      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'NewSecurePass123!',
      })

      expect(redirect).toHaveBeenCalledWith(
        '/login?message=Password reset successful. Please sign in with your new password.'
      )
    })
  })

  describe('error handling', () => {
    it('should return error when password update fails', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: null },
        error: { name: 'AuthError', message: 'Invalid reset token', status: 400 },
      })

      const formData = new FormData()
      formData.append('password', 'NewSecurePass123!')
      formData.append('confirmPassword', 'NewSecurePass123!')

      const result = await confirmPasswordReset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid reset token')
    })

    it('should handle unexpected errors gracefully', async () => {
      mockSupabase.auth.updateUser.mockRejectedValue(new Error('Database error'))

      const formData = new FormData()
      formData.append('password', 'NewSecurePass123!')
      formData.append('confirmPassword', 'NewSecurePass123!')

      const result = await confirmPasswordReset(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })
  })
})

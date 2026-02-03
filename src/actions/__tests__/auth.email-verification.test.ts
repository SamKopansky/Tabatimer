import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { resendVerificationEmail } from '../auth'
import {
  createMockSupabaseClient,
  mockOtpSuccess,
  mockOtpError,
} from '@/test/helpers/supabase'

// Mock the Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Import mocked modules
import { createClient } from '@/lib/supabase/server'

describe('resendVerificationEmail', () => {
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

      const result = await resendVerificationEmail(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid email address')
      expect(mockSupabase.auth.resend).not.toHaveBeenCalled()
    })
  })

  describe('successful verification email resend', () => {
    it('should resend verification email and return success message', async () => {
      mockSupabase.auth.resend.mockResolvedValue(mockOtpSuccess())

      const formData = new FormData()
      formData.append('email', 'user@example.com')

      const result = await resendVerificationEmail(formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Verification email sent! Please check your inbox.')

      expect(mockSupabase.auth.resend).toHaveBeenCalledWith({
        type: 'signup',
        email: 'user@example.com',
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback',
        },
      })
    })
  })

  describe('error handling', () => {
    it('should return error when resend fails', async () => {
      mockSupabase.auth.resend.mockResolvedValue(
        mockOtpError('Email service unavailable')
      )

      const formData = new FormData()
      formData.append('email', 'user@example.com')

      const result = await resendVerificationEmail(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email service unavailable')
    })

    it('should handle unexpected errors gracefully', async () => {
      mockSupabase.auth.resend.mockRejectedValue(new Error('Network error'))

      const formData = new FormData()
      formData.append('email', 'user@example.com')

      const result = await resendVerificationEmail(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('should handle non-Error exceptions', async () => {
      mockSupabase.auth.resend.mockRejectedValue('Unexpected error')

      const formData = new FormData()
      formData.append('email', 'user@example.com')

      const result = await resendVerificationEmail(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('An unexpected error occurred')
    })
  })
})

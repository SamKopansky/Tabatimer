import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { sendMagicLink } from '../auth'
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

describe('sendMagicLink', () => {
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

      const result = await sendMagicLink(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid email address')
      expect(mockSupabase.auth.signInWithOtp).not.toHaveBeenCalled()
    })
  })

  describe('successful magic link send', () => {
    it('should send magic link and return success message', async () => {
      mockSupabase.auth.signInWithOtp.mockResolvedValue(mockOtpSuccess())

      const formData = new FormData()
      formData.append('email', 'user@example.com')

      const result = await sendMagicLink(formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Magic link sent! Please check your email to sign in.')

      expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
        email: 'user@example.com',
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback',
        },
      })
    })
  })

  describe('error handling', () => {
    it('should return error when magic link send fails', async () => {
      mockSupabase.auth.signInWithOtp.mockResolvedValue(
        mockOtpError('Email service unavailable')
      )

      const formData = new FormData()
      formData.append('email', 'user@example.com')

      const result = await sendMagicLink(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email service unavailable')
    })

    it('should handle unexpected errors gracefully', async () => {
      mockSupabase.auth.signInWithOtp.mockRejectedValue(new Error('Network error'))

      const formData = new FormData()
      formData.append('email', 'user@example.com')

      const result = await sendMagicLink(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('should handle non-Error exceptions', async () => {
      mockSupabase.auth.signInWithOtp.mockRejectedValue('Unexpected error')

      const formData = new FormData()
      formData.append('email', 'user@example.com')

      const result = await sendMagicLink(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('An unexpected error occurred')
    })
  })
})

import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { signIn } from '../auth'
import {
  createMockSupabaseClient,
  createMockUser,
  mockSignInSuccess,
  mockSignInError,
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

describe('signIn', () => {
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
      formData.append('password', 'anypassword')

      const result = await signIn(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid email address')
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })

    it('should reject empty password', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', '')

      const result = await signIn(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Password is required')
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })
  })

  describe('successful signin', () => {
    it('should sign in user and redirect to home', async () => {
      const mockUser = createMockUser({
        email: 'user@example.com',
      })

      mockSupabase.auth.signInWithPassword.mockResolvedValue(mockSignInSuccess(mockUser))

      const formData = new FormData()
      formData.append('email', 'user@example.com')
      formData.append('password', 'correctpassword')

      await expect(signIn(formData)).rejects.toThrow('NEXT_REDIRECT')

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'correctpassword',
      })

      expect(redirect).toHaveBeenCalledWith('/')
    })

    it('should redirect to specified URL when redirect param provided', async () => {
      const mockUser = createMockUser({
        email: 'user@example.com',
      })

      mockSupabase.auth.signInWithPassword.mockResolvedValue(mockSignInSuccess(mockUser))

      const formData = new FormData()
      formData.append('email', 'user@example.com')
      formData.append('password', 'correctpassword')
      formData.append('redirect', '/profile')

      await expect(signIn(formData)).rejects.toThrow('NEXT_REDIRECT')

      expect(redirect).toHaveBeenCalledWith('/profile')
    })
  })

  describe('error handling', () => {
    it('should return error for invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue(
        mockSignInError('Invalid login credentials')
      )

      const formData = new FormData()
      formData.append('email', 'user@example.com')
      formData.append('password', 'wrongpassword')

      const result = await signIn(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid login credentials')
    })

    it('should return error when session creation fails', async () => {
      const mockUser = createMockUser()
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      })

      const formData = new FormData()
      formData.append('email', 'user@example.com')
      formData.append('password', 'password')

      const result = await signIn(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create session')
    })

    it('should handle unexpected errors gracefully', async () => {
      mockSupabase.auth.signInWithPassword.mockRejectedValue(new Error('Database error'))

      const formData = new FormData()
      formData.append('email', 'user@example.com')
      formData.append('password', 'password')

      const result = await signIn(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })

    it('should handle non-Error exceptions', async () => {
      mockSupabase.auth.signInWithPassword.mockRejectedValue('Unexpected error')

      const formData = new FormData()
      formData.append('email', 'user@example.com')
      formData.append('password', 'password')

      const result = await signIn(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('An unexpected error occurred')
    })
  })
})

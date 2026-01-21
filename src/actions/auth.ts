'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').optional(),
})

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type ActionResult = {
  success: boolean
  error?: string
  message?: string
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(formData: FormData): Promise<ActionResult> {
  try {
    // Parse and validate form data
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      displayName: formData.get('displayName') as string | undefined,
    }

    const validation = signUpSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      }
    }

    const { email, password, displayName } = validation.data

    const supabase = await createClient()

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        },
      },
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    if (!data.user) {
      return {
        success: false,
        error: 'Failed to create user account',
      }
    }

    // If email confirmation is required, redirect to confirmation page
    if (data.user && !data.session) {
      redirect(`/auth/verify-email?email=${encodeURIComponent(email)}`)
    }

    // If auto-confirmed, redirect to home
    redirect('/')
  } catch (error) {
    // Handle redirect errors (Next.js throws for redirects)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(formData: FormData): Promise<ActionResult> {
  try {
    // Parse and validate form data
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const validation = signInSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      }
    }

    const { email, password } = validation.data

    const supabase = await createClient()

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    if (!data.session) {
      return {
        success: false,
        error: 'Failed to create session',
      }
    }

    // Check if there's a redirect URL
    const redirectTo = formData.get('redirect') as string | null
    redirect(redirectTo || '/')
  } catch (error) {
    // Handle redirect errors (Next.js throws for redirects)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Resend email verification link
 */
export async function resendVerificationEmail(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      email: formData.get('email') as string,
    }

    const validation = emailSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      }
    }

    const { email } = validation.data
    const supabase = await createClient()

    // Get the app URL for the email redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback`,
      },
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Verification email sent! Please check your inbox.',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Send a magic link for passwordless authentication
 */
export async function sendMagicLink(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      email: formData.get('email') as string,
    }

    const validation = emailSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      }
    }

    const { email } = validation.data
    const supabase = await createClient()

    // Get the app URL for the email redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback`,
      },
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Magic link sent! Please check your email to sign in.',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Request a password reset email
 */
export async function requestPasswordReset(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      email: formData.get('email') as string,
    }

    const validation = emailSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      }
    }

    const { email } = validation.data
    const supabase = await createClient()

    // Get the app URL for the email redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/auth/reset-password`,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      message: 'Password reset link sent! Please check your email.',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Confirm password reset and update the password
 */
export async function confirmPasswordReset(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    const validation = resetPasswordSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      }
    }

    const { password } = validation.data
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    // Redirect to login after successful password reset
    redirect('/login?message=Password reset successful. Please sign in with your new password.')
  } catch (error) {
    // Handle redirect errors (Next.js throws for redirects)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Update user profile (display name)
 */
export async function updateProfile(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      displayName: formData.get('displayName') as string,
    }

    // Validate display name
    const displayNameSchema = z.object({
      displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name must be less than 50 characters'),
    })

    const validation = displayNameSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      }
    }

    const { displayName } = validation.data
    const supabase = await createClient()

    // Update user metadata
    const { data: userData, error: userError } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
      },
    })

    if (userError) {
      return {
        success: false,
        error: userError.message,
      }
    }

    if (!userData.user) {
      return {
        success: false,
        error: 'Failed to update profile',
      }
    }

    // Also update the users table
    const { error: dbError } = await supabase
      .from('users')
      .update({
        display_name: displayName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userData.user.id)

    if (dbError) {
      return {
        success: false,
        error: dbError.message,
      }
    }

    return {
      success: true,
      message: 'Profile updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

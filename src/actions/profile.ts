'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

type ActionResult = {
  success: boolean
  error?: string
  message?: string
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

/**
 * Delete user account and all associated data
 * This action is irreversible
 */
export async function deleteAccount(confirmationText: string): Promise<ActionResult> {
  try {
    // Validate confirmation text
    if (confirmationText !== 'DELETE') {
      return {
        success: false,
        error: 'Confirmation text must be exactly "DELETE"',
      }
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Delete user data from database
    // RLS policies ensure users can only delete their own data
    // CASCADE constraints will handle related records (workouts, history, preferences)
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id)

    if (dbError) {
      return {
        success: false,
        error: `Failed to delete user data: ${dbError.message}`,
      }
    }

    // Sign out the user
    // Note: This doesn't delete the auth.users record, which would require admin API
    // The user's data is deleted, and they are signed out
    // If needed, admin can manually delete auth records via Supabase dashboard
    await supabase.auth.signOut()

    return {
      success: true,
      message: 'Account deleted successfully',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

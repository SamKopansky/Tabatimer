import { ProfileForm } from '@/components/auth/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requireAuth } from '@/lib/auth/utils'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Profile | Tabatimer',
  description: 'Manage your profile settings',
}

export default async function ProfilePage() {
  // Require authentication - will redirect to login if not authenticated
  const user = await requireAuth('/profile')

  // Get user data from database
  const supabase = await createClient()
  const { data: userData } = await supabase
    .from('users')
    .select('display_name')
    .eq('id', user.id)
    .single()

  // Fallback to user metadata if database record doesn't exist
  const displayName = userData?.display_name ||
    (user.user_metadata?.display_name as string) ||
    user.email?.split('@')[0] ||
    ''

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initialDisplayName={displayName}
            email={user.email || ''}
          />
        </CardContent>
      </Card>
    </div>
  )
}

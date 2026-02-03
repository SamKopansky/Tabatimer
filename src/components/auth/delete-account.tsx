'use client'

import { deleteAccount } from '@/actions/profile'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteAccount() {
  const [confirmText, setConfirmText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const result = await deleteAccount(confirmText)

      if (result.success) {
        // Close dialog and redirect to home page
        setOpen(false)
        router.push('/')
      } else {
        setError(result.error || 'Failed to delete account')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset state when dialog closes
      setConfirmText('')
      setError(null)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p className="font-semibold text-red-600">
              This action cannot be undone.
            </p>
            <p>
              This will permanently delete your account and remove all your data from our servers, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Your profile information</li>
              <li>All saved workouts</li>
              <li>Workout history and progress</li>
              <li>User preferences and settings</li>
            </ul>
            <div className="pt-4">
              <Label htmlFor="confirm" className="text-foreground">
                Type <span className="font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="mt-2"
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={loading || confirmText !== 'DELETE'}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

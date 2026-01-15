# Session Management with HTTP-only Cookies

This document explains how session management is implemented in the Personal Trainer App using HTTP-only cookies for maximum security.

## Overview

The app uses Supabase Auth with the `@supabase/ssr` package to manage user sessions securely. Sessions are stored in HTTP-only cookies, which prevents client-side JavaScript from accessing authentication tokens, protecting against XSS attacks.

## Architecture

### Components

1. **Server-side Supabase Client** (`src/lib/supabase/server.ts`)
   - Used in Server Components and Server Actions
   - Reads and writes HTTP-only cookies via Next.js `cookies()` API
   - Automatically handles session tokens

2. **Client-side Supabase Client** (`src/lib/supabase/client.ts`)
   - Used in Client Components
   - Reads cookies but cannot write to HTTP-only cookies
   - Session state synced from server

3. **Middleware** (`middleware.ts`)
   - Intercepts every request
   - Refreshes user sessions automatically
   - Extends session expiration on activity
   - Uses `src/lib/supabase/middleware.ts` helper

4. **Auth Actions** (`src/actions/auth.ts`)
   - Server Actions for authentication operations
   - Handle sign up, sign in, sign out
   - Manage password reset flows
   - Automatically set HTTP-only cookies

## Security Features

### HTTP-only Cookies

Supabase SSR sets cookies with these security flags:

- **`httpOnly: true`** - Prevents client-side JavaScript access
- **`secure: true`** - Requires HTTPS in production
- **`sameSite: 'lax'`** - CSRF protection
- **`path: '/'`** - Available site-wide
- **`maxAge`** - Set to session expiration time

### Cookie Names

Supabase uses these cookies (where `<project-ref>` is your Supabase project reference):

- `sb-<project-ref>-auth-token` - Main session token
- `sb-<project-ref>-auth-token-code-verifier` - PKCE code verifier

### Session Refresh

The middleware automatically:
1. Validates the current session on every request
2. Refreshes the session if it's close to expiration
3. Updates the HTTP-only cookies with new tokens
4. Extends the user's logged-in state

## Flow Diagrams

### Sign In Flow

```
1. User submits login form (Client Component)
   ↓
2. Form calls signIn() Server Action
   ↓
3. Server Action:
   - Validates credentials with Supabase
   - Supabase returns session tokens
   - Server sets HTTP-only cookies
   ↓
4. User redirected to home page
   ↓
5. Middleware intercepts request
   - Validates session from cookies
   - User data available to Server Components
```

### Session Refresh Flow

```
1. User visits any page
   ↓
2. Middleware intercepts request
   ↓
3. Middleware:
   - Reads session from HTTP-only cookies
   - Calls supabase.auth.getUser()
   - Checks if session needs refresh
   ↓
4. If refresh needed:
   - Gets new tokens from Supabase
   - Sets new HTTP-only cookies
   ↓
5. Request continues to page with fresh session
```

### Sign Out Flow

```
1. User clicks sign out (Client Component)
   ↓
2. Form calls signOut() Server Action
   ↓
3. Server Action:
   - Calls supabase.auth.signOut()
   - Clears HTTP-only cookies
   ↓
4. User redirected to login page
   ↓
5. Future requests have no session
```

## Implementation Details

### Creating Server Client

```typescript
import { createClient } from '@/lib/supabase/server'

export async function someServerAction() {
  const supabase = await createClient()

  // Get current user (validated from HTTP-only cookies)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // No valid session
    redirect('/login')
  }

  // User is authenticated, proceed with action
}
```

### Creating Client Component

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function UserProfile() {
  const supabase = createClient()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user from session (synced from server)
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return <div>{user?.email}</div>
}
```

### Middleware Configuration

The middleware runs on all routes except static files:

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

This ensures:
- Session is validated on every page
- Sessions are kept fresh automatically
- No extra API calls needed from components

## Testing

### Manual Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open DevTools → Application → Cookies

3. Log in to the app

4. Verify cookies:
   - Look for `sb-*-auth-token` cookies
   - Check the `HttpOnly` column shows ✓
   - Check the `Secure` column shows ✓ (in production)
   - Check the `SameSite` column shows `Lax`

5. Try to access cookies from console:
   ```javascript
   document.cookie // Should NOT show auth tokens
   ```

### Automated Testing

Run the session management test:

```bash
npm run test:session
```

This verifies:
- Middleware is properly configured
- Session refresh helper exists
- HTTP-only cookies are enabled

## Security Best Practices

### ✅ DO

- Use `createClient()` from `@/lib/supabase/server` in Server Components and Actions
- Use `createClient()` from `@/lib/supabase/client` in Client Components
- Always validate user sessions server-side before sensitive operations
- Use the middleware to keep sessions fresh
- Redirect unauthenticated users from protected pages

### ❌ DON'T

- Don't try to manually set or read auth cookies
- Don't trust client-side session state for authorization
- Don't expose session tokens in URLs or logs
- Don't skip server-side session validation
- Don't disable the middleware

## Troubleshooting

### Sessions Not Persisting

**Problem:** User gets logged out on page navigation

**Solution:**
1. Verify middleware is running (check `middleware.ts` exists at root)
2. Check middleware matcher includes the route
3. Verify environment variables are set correctly

### Cookies Not Being Set

**Problem:** No auth cookies in browser

**Solution:**
1. Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
2. Verify Supabase project is active
3. Check browser allows cookies (not in private/incognito mode)

### Session Expired Errors

**Problem:** Users get "session expired" errors frequently

**Solution:**
1. Verify middleware is running and refreshing sessions
2. Check Supabase project settings for session timeout configuration
3. Ensure middleware is not being skipped on certain routes

## References

- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [HTTP-only Cookies Security](https://owasp.org/www-community/HttpOnly)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

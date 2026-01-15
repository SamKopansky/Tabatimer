import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Update session and get response with updated cookies and user
  const { response, user } = await updateSession(request)

  // Protect (auth) route group: redirect authenticated users to home
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/magic-link') ||
    request.nextUrl.pathname.startsWith('/forgot-password')

  if (isAuthPage && user) {
    // User is authenticated, redirect to home
    const redirectUrl = new URL('/', request.url)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    // Copy over session cookies from updateSession
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

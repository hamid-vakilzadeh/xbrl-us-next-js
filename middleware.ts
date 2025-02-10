import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_STORAGE_KEY } from '@/lib/constants'

// Paths that require authentication
const protectedPaths = ['/dashboard']
// Paths that should not be accessible when authenticated
const authPaths = ['/signin']
// Paths that are always accessible
const publicPaths = ['/', '/api']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authState = request.cookies.get(AUTH_STORAGE_KEY)

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))
  
  // If there's valid auth state
  if (authState) {
    try {
      const authData = JSON.parse(authState.value)
      const isValidAuth = authData.tokenExpiry > Date.now()

      // Redirect away from auth pages if already authenticated
      if (isAuthPath && isValidAuth) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // Allow access to protected routes if auth is valid
      if (isProtectedPath && !isValidAuth) {
        return NextResponse.redirect(new URL('/signin', request.url))
      }
    } catch {
      // If auth state is invalid, clear it
      const response = NextResponse.redirect(new URL('/signin', request.url))
      response.cookies.delete(AUTH_STORAGE_KEY)
      return response
    }
  } else if (isProtectedPath) {
    // No auth state, redirect to signin
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}
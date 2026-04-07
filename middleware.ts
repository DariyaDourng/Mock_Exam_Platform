// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt_token')?.value  //fixed: was 'token', should match 'jwt_token'
  const { pathname } = request.nextUrl

  // Not logged in and trying to access protected routes
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Not logged in and trying to access admin routes
  if (!token && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Logged in and trying to access /login again
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
}
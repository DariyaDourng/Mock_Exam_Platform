// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const isAuthPage = pathname === '/login'

  // Not logged in and trying to access protected routes
//   if (!token && pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   // Logged in and trying to access /login again
//   if (token && isAuthPage) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   return NextResponse.next()
// }


// export const config = {
//   matcher: ['/dashboard/:path*', '/login'],
}

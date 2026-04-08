import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/login'

  if (isAdminRoute || isLoginPage) {
    const response = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()

    if (isAdminRoute && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (isLoginPage && user) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return response
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\..*).*)', '/'],
}

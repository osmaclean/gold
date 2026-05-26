import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request)

  const pathname = request.nextUrl.pathname

  const isAuthRoute = pathname.startsWith("/entrar") || pathname.startsWith("/auth/callback")
  const isPublicRoute = pathname === "/" || pathname.startsWith("/regras") || pathname.startsWith("/sobre")
  const isApiRoute = pathname.startsWith("/api")

  if (!user && !isAuthRoute && !isPublicRoute && !isApiRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/entrar"
    url.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(url)
  }

  if (user && pathname.startsWith("/entrar")) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)",
  ],
}

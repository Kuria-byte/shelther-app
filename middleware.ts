import { type NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { checkProfileStatus } from "@/lib/utils/profile"

// Define routes that should be accessible without authentication
const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/auth/callback", "/auth/confirm"]

// Define routes that are part of the onboarding flow
const onboardingRoutes = ["/onboarding", "/onboarding/profile", "/onboarding/safety-circle", "/onboarding/location"]

// Update the middleware function to include more detailed logging
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Get user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the current path
  const path = request.nextUrl.pathname

  // Allow public routes without authentication
  if (publicRoutes.some((route) => path.startsWith(route))) {
    // If authenticated user tries to access login/register, redirect to home
    if (session && (path === "/login" || path === "/register")) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return response
  }

  // Check if user is authenticated
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Skip onboarding check for API routes and static assets
  if (path.startsWith("/api") || path.includes("/_next")) {
    return response
  }

  // Check if the user is on an onboarding route
  const isOnboardingRoute = onboardingRoutes.some((route) => path.startsWith(route))

  // If not on an onboarding route, check if onboarding is completed
  if (!isOnboardingRoute) {
    try {
      // Check if profile exists and onboarding is completed
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      // TEMPORARY DIRECT CHECK: If onboarding_completed is explicitly false, redirect to onboarding
      if (profile?.onboarding_completed === false) {
        console.log("[MIDDLEWARE] DIRECT CHECK: onboarding_completed is explicitly false", {
          userId: session.user.id,
          path: request.nextUrl.pathname,
          onboardingCompleted: profile.onboarding_completed,
          typeOfOnboardingCompleted: typeof profile.onboarding_completed,
          timestamp: new Date().toISOString(),
        })
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }

      // Use the centralized profile check function
      const profileStatus = checkProfileStatus(profile)

      console.log("[MIDDLEWARE] Profile check result:", {
        exists: profileStatus.exists,
        isComplete: profileStatus.isComplete,
        path: request.nextUrl.pathname,
        userId: session.user.id,
        onboardingCompleted: profile?.onboarding_completed,
        typeOfOnboardingCompleted: typeof profile?.onboarding_completed,
        timestamp: new Date().toISOString(),
      })

      if (!profileStatus.isComplete) {
        console.log("[MIDDLEWARE] Onboarding not completed, redirecting to onboarding", {
          from: request.nextUrl.pathname,
          to: "/onboarding",
          timestamp: new Date().toISOString(),
        })
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }
    } catch (error) {
      console.error("[MIDDLEWARE] Error checking profile:", error)
      // If there's an error checking the profile, proceed anyway to avoid blocking the user
      return response
    }
  }

  return response
}

export const config = {
  // Skip middleware for static files and API routes that don't need auth checks
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}


import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { checkProfileStatus, createOrUpdateProfile } from "@/lib/utils/profile"
import { authUrls } from "@/lib/auth-urls"

// Update the GET function to include more detailed logging
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      console.log("[AUTH-CALLBACK] Session established for user:", session.user.id)

      try {
        // Check if profile exists and is complete
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        // Use the updated profile check function
        const profileStatus = checkProfileStatus(profile)

        console.log("[AUTH-CALLBACK] Profile check result:", {
          exists: profileStatus.exists,
          isComplete: profileStatus.isComplete,
          userId: session.user.id,
          onboardingCompleted: profile?.onboarding_completed,
          typeOfOnboardingCompleted: typeof profile?.onboarding_completed,
          strictComparison: profile ? profile.onboarding_completed === true : null,
          timestamp: new Date().toISOString(),
        })

        // If profile doesn't exist, create it
        if (!profileStatus.exists) {
          console.log("[AUTH-CALLBACK] Profile doesn't exist, creating...")

          await createOrUpdateProfile(session.user.id, {
            full_name: session.user.user_metadata?.full_name || "",
            email: session.user.email || "",
            phone: session.user.user_metadata?.phone || "",
          })

          // Redirect to onboarding
          console.log("[AUTH-CALLBACK] Redirecting to onboarding after profile creation")
          return NextResponse.redirect(new URL(authUrls.getOnboardingUrl(), requestUrl.origin))
        }

        // TEMPORARY DIRECT CHECK: If onboarding_completed is explicitly false, redirect to onboarding
        if (profile?.onboarding_completed === false) {
          console.log("[AUTH-CALLBACK] DIRECT CHECK: onboarding_completed is explicitly false", {
            userId: session.user.id,
            onboardingCompleted: profile.onboarding_completed,
            typeOfOnboardingCompleted: typeof profile.onboarding_completed,
            timestamp: new Date().toISOString(),
          })
          return NextResponse.redirect(new URL(authUrls.getOnboardingUrl(), requestUrl.origin))
        }

        // If profile exists but is incomplete, redirect to onboarding
        if (!profileStatus.isComplete) {
          console.log("[AUTH-CALLBACK] Profile incomplete, redirecting to onboarding")
          return NextResponse.redirect(new URL(authUrls.getOnboardingUrl(), requestUrl.origin))
        }

        // If profile exists and is complete, redirect to home
        console.log("[AUTH-CALLBACK] Profile complete, redirecting to home")
        return NextResponse.redirect(new URL(authUrls.getHomeUrl(), requestUrl.origin))
      } catch (error) {
        console.error("[AUTH-CALLBACK] Error checking profile:", error)
        // If there's an error, redirect to home as a fallback
        return NextResponse.redirect(new URL(authUrls.getHomeUrl(), requestUrl.origin))
      }
    }
  }

  // Default fallback - redirect to home
  return NextResponse.redirect(new URL(authUrls.getHomeUrl(), requestUrl.origin))
}


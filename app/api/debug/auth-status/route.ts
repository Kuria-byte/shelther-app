import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Error fetching session",
          error: sessionError,
        },
        { status: 500 },
      )
    }

    // If no session, return unauthenticated status
    if (!session) {
      // Check cookies for debugging
      const allCookies = cookieStore.getAll()
      const cookieNames = allCookies.map((cookie) => cookie.name)

      return NextResponse.json(
        {
          status: "unauthenticated",
          message: "No active session found",
          cookies: {
            count: allCookies.length,
            names: cookieNames,
          },
        },
        { status: 200 },
      )
    }

    // Get user details
    const user = session.user
    const isEmailVerified = !!user.email_confirmed_at

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Return detailed debug information
    return NextResponse.json(
      {
        status: "authenticated",
        user: {
          id: user.id,
          email: user.email,
          emailVerified: isEmailVerified,
          emailConfirmedAt: user.email_confirmed_at,
          lastSignInAt: user.last_sign_in_at,
          userMetadata: user.user_metadata,
          appMetadata: user.app_metadata,
        },
        session: {
          expires_at: session.expires_at,
          token_type: session.token_type,
        },
        profile: profile || null,
        profileError: profileError || null,
        cookies: {
          count: cookieStore.getAll().length,
          names: cookieStore.getAll().map((cookie) => cookie.name),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in auth status endpoint:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Unexpected error checking auth status",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}


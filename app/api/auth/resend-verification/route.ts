import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { authUrls } from "@/lib/auth-urls"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Use our centralized auth URL utility
    const redirectTo = authUrls.getVerificationConfirmationUrl()

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      console.error("Error resending verification email:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Verification email sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error resending verification email:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}


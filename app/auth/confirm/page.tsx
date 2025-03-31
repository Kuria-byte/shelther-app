"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { isProfileComplete } from "@/lib/utils/profile"

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your email...")
  const [hasRedirected, setHasRedirected] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        console.log("[AUTH-FLOW] Starting verification confirmation process")

        // Get token and type from URL
        const token = searchParams.get("token_hash")
        const type = searchParams.get("type")

        if (!token || (type !== "email_change" && type !== "signup")) {
          setVerificationStatus("error")
          setMessage("Missing verification parameters. Please check your email link and try again.")
          return
        }

        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any,
        })

        if (error) {
          console.error("[AUTH-FLOW] Verification error:", error)
          setVerificationStatus("error")
          setMessage(error.message || "Failed to verify email. Please try again.")
          return
        }

        console.log("[AUTH-FLOW] Email verification status: Verified")
        setVerificationStatus("success")
        setMessage("Email verified successfully!")

        // Get the user session
        const {
          data: { session },
        } = await supabase.auth.getSession()
        console.log("[AUTH-FLOW] Session established after", session ? "1" : "0", "attempts")

        if (session && !hasRedirected) {
          console.log("[AUTH-FLOW] Session established for user:", session.user.id)

          // Check if profile exists and is complete
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          // Use the centralized profile check function
          //const profileStatus = checkProfileStatus(profile)
          const isComplete = isProfileComplete(profile)
          console.log("[DEBUG] Email confirmation: Profile completeness check", { isComplete })

          //console.log("[AUTH-FLOW] Profile check result in confirm page:", profileStatus)

          // Determine where to redirect based on onboarding status
          let redirectUrl = "/"

          if (!isComplete) {
            redirectUrl = "/onboarding"
            console.log("[AUTH-FLOW] Onboarding not completed, will redirect to:", redirectUrl)
          } else {
            console.log("[AUTH-FLOW] Onboarding completed, will redirect to home")
          }

          // Set flag to prevent double redirects
          setHasRedirected(true)

          // Redirect after a short delay
          setTimeout(() => {
            console.log("[AUTH-FLOW] Redirecting to:", redirectUrl)
            router.push(redirectUrl)
          }, 2000)
        }
      } catch (error) {
        console.error("[AUTH-FLOW] Verification error:", error)
        setVerificationStatus("error")
        setMessage("An unexpected error occurred. Please try again.")
      }
    }

    confirmEmail()
  }, [supabase, router, searchParams, hasRedirected])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-blue-50">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {verificationStatus === "loading" && <Loader2 className="h-12 w-12 text-primary animate-spin" />}
            {verificationStatus === "success" && <CheckCircle className="h-12 w-12 text-green-600" />}
            {verificationStatus === "error" && <XCircle className="h-12 w-12 text-destructive" />}
          </div>
          <CardTitle className="text-2xl">
            {verificationStatus === "loading" && "Verifying Email"}
            {verificationStatus === "success" && "Email Verified!"}
            {verificationStatus === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>

        <CardContent>
          {verificationStatus === "success" && (
            <p className="text-center text-sm">You're being redirected to set up your profile...</p>
          )}
          {verificationStatus === "error" && (
            <p className="text-center text-sm">
              Please check your email for the verification link or try signing up again.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          {verificationStatus === "error" && <Button onClick={() => router.push("/login")}>Return to Login</Button>}
        </CardFooter>
      </Card>
    </div>
  )
}


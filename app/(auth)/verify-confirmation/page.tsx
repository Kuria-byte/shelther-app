"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { checkProfileStatus } from "@/lib/utils/profile"
import { logWithTimestamp, DEBUG_CONFIG, addRedirectTracking } from "@/lib/utils/debug-utils"
import { supabase as globalSupabase } from "@/lib/supabase/client"

// Maximum time to wait for auth state change (ms)
const AUTH_STATE_TIMEOUT = 15000

export default function VerifyConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [status, setStatus] = useState<"detecting" | "processing" | "verified" | "error" | "redirecting">("detecting")
  const [redirectTarget, setRedirectTarget] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [verificationAttempted, setVerificationAttempted] = useState(false)

  // Helper function to parse tokens from URL hash
  const parseHashTokens = (hash: string) => {
    if (!hash || hash.length < 2) return null

    try {
      const hashParams = new URLSearchParams(hash.substring(1))
      const accessToken = hashParams.get("access_token")
      const refreshToken = hashParams.get("refresh_token")
      const expiresIn = hashParams.get("expires_in")
      const tokenType = hashParams.get("token_type") || "bearer"

      // Simple validation of access token format
      if (!accessToken || !accessToken.includes(".")) {
        logWithTimestamp("VERIFY-CONFIRMATION", "Invalid access token format")
        return null
      }

      return {
        access_token: accessToken,
        refresh_token: refreshToken || "",
        expires_in: expiresIn ? Number.parseInt(expiresIn) : undefined,
        token_type: tokenType,
      }
    } catch (error) {
      logWithTimestamp("VERIFY-CONFIRMATION", "Error parsing hash tokens:", error)
      return null
    }
  }

  // Process verification once we have a session
  const processVerification = useCallback(
    async (session) => {
      try {
        logWithTimestamp("VERIFY-CONFIRMATION", "Processing verification with session", {
          userId: session.user.id,
          hasAccessToken: !!session.access_token,
          expiresAt: session.expires_at,
        })

        // Clear any pending timeout
        if (timeoutId) {
          clearTimeout(timeoutId)
          setTimeoutId(null)
        }

        // Wait for session to be fully established
        // Add a small delay to ensure Supabase has time to persist the session
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Double-check that session is still valid
        const { data } = await supabase.auth.getSession()
        const isEstablished = !!data.session

        logWithTimestamp("VERIFY-CONFIRMATION", "Session check after delay:", {
          isEstablished,
          userId: data.session?.user?.id,
          hasAccessToken: data.session?.access_token ? true : false,
        })

        if (!isEstablished) {
          logWithTimestamp("VERIFY-CONFIRMATION", "Session not fully established yet, waiting longer")
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Check again
          const { data: secondData } = await supabase.auth.getSession()
          const secondCheck = !!secondData.session

          logWithTimestamp("VERIFY-CONFIRMATION", "Second session check:", {
            isEstablished: secondCheck,
            userId: secondData.session?.user?.id,
            hasAccessToken: secondData.session?.access_token ? true : false,
          })

          if (!secondCheck) {
            throw new Error("Failed to establish session after verification")
          }
        }

        // Fetch profile data
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        logWithTimestamp("VERIFY-CONFIRMATION", "Fetched profile", {
          profileId: profile?.id,
          onboardingCompleted: profile?.onboarding_completed,
          typeOfOnboardingCompleted: typeof profile?.onboarding_completed,
        })

        // Check if profile exists and is complete
        const profileStatus = checkProfileStatus(profile)

        // Perform a direct check as well
        const directCheck = profile?.onboarding_completed === false

        logWithTimestamp("VERIFY-CONFIRMATION", "Profile check result:", {
          exists: profileStatus.exists,
          isComplete: profileStatus.isComplete,
          directCheck,
          onboardingCompleted: profile?.onboarding_completed,
          typeOfOnboardingCompleted: typeof profile?.onboarding_completed,
        })

        // Set status to verified
        setStatus("verified")

        // Determine where to redirect
        let redirectDestination = "/"
        const shouldRedirectToOnboarding = !profileStatus.isComplete || directCheck

        if (shouldRedirectToOnboarding) {
          redirectDestination = "/onboarding"
        }

        // Add tracking parameters if enabled
        redirectDestination = addRedirectTracking(redirectDestination, "verify-confirmation")

        logWithTimestamp("VERIFY-CONFIRMATION", "Redirect decision:", {
          shouldRedirectToOnboarding,
          redirectDestination,
          directCheck,
          profileIsComplete: profileStatus.isComplete,
          onboardingCompleted: profile?.onboarding_completed,
        })

        setRedirectTarget(redirectDestination)
        setStatus("redirecting")

        // Perform the redirect
        setTimeout(() => {
          performRedirect(redirectDestination)
        }, DEBUG_CONFIG.redirectDelay || 2000)
      } catch (error) {
        logWithTimestamp("VERIFY-CONFIRMATION", "Error processing verification:", error)
        setStatus("error")
        setError("An error occurred while verifying your email. Please try again.")
      }
    },
    [supabase, timeoutId],
  )

  // New function to handle explicit token exchange
  const handleExplicitTokenExchange = useCallback(async () => {
    try {
      // Check for code parameter (used in code flow)
      const code = searchParams.get("code")
      if (code) {
        logWithTimestamp("VERIFY-CONFIRMATION", "Found code parameter, attempting explicit exchange", {
          codeLength: code.length,
          codePrefix: code.substring(0, 8) + "...", // Log prefix for debugging without exposing full code
        })

        setStatus("processing")

        // Explicitly exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          logWithTimestamp("VERIFY-CONFIRMATION", "Code exchange error:", error)
          return false
        }

        if (data?.session) {
          logWithTimestamp("VERIFY-CONFIRMATION", "Session established via explicit code exchange", {
            hasSession: true,
            userId: data.session.user.id,
            expiresAt: data.session.expires_at,
          })

          // Wait for session to be fully established
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Process the verification with the new session
          await processVerification(data.session)
          return true
        }
      }

      // Check for access_token in URL hash (implicit flow)
      const hash = window.location.hash
      if (hash && hash.includes("access_token=")) {
        logWithTimestamp(
          "VERIFY-CONFIRMATION",
          "Found access_token in URL hash, attempting to parse and establish session",
          {
            hashLength: hash.length,
            containsAccessToken: hash.includes("access_token="),
            containsRefreshToken: hash.includes("refresh_token="),
            containsExpiresIn: hash.includes("expires_in="),
          },
        )

        // Parse the hash to extract tokens
        const tokens = parseHashTokens(hash)

        if (!tokens) {
          logWithTimestamp("VERIFY-CONFIRMATION", "Failed to parse valid tokens from hash")
          return false
        }

        setStatus("processing")

        logWithTimestamp("VERIFY-CONFIRMATION", "Successfully extracted tokens from hash", {
          hasAccessToken: !!tokens.access_token,
          hasRefreshToken: !!tokens.refresh_token,
          hasExpiresIn: !!tokens.expires_in,
        })

        // Calculate expires_at from expires_in
        const expiresAt = tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : undefined

        // Use setSession to explicitly establish the session
        const { data, error } = await supabase.auth.setSession({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: expiresAt,
        })

        if (error) {
          logWithTimestamp("VERIFY-CONFIRMATION", "Error setting session from hash tokens:", error)
          return false
        }

        if (data?.session) {
          logWithTimestamp("VERIFY-CONFIRMATION", "Session established via explicit hash token handling", {
            hasSession: true,
            userId: data.session.user.id,
            expiresAt: data.session.expires_at,
          })

          // Wait for session to be fully established
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Process the verification with the new session
          await processVerification(data.session)
          return true
        }
      }

      // Check for token parameter (used in some flows)
      const token = searchParams.get("token")
      if (token) {
        logWithTimestamp("VERIFY-CONFIRMATION", "Found token parameter, examining token structure", {
          tokenLength: token.length,
          tokenPrefix: token.substring(0, 8) + "...", // Log prefix for debugging without exposing full token
        })

        // For token parameters, we'll continue with OTP verification
        return false
      }

      return false
    } catch (err) {
      logWithTimestamp("VERIFY-CONFIRMATION", "Error in explicit token exchange:", err)
      return false
    }
  }, [searchParams, supabase, processVerification])

  // Handle OTP verification
  const handleOtpVerification = useCallback(async () => {
    try {
      // Check if we have OTP parameters in the URL
      const token = searchParams.get("token")
      const type = searchParams.get("type")

      if (!token || !type) {
        logWithTimestamp("VERIFY-CONFIRMATION", "No OTP parameters found in URL")
        return false
      }

      logWithTimestamp("VERIFY-CONFIRMATION", "Found OTP parameters, verifying token", {
        type,
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 8) + "...", // Log prefix for debugging without exposing full token
      })

      setStatus("processing")

      // Use the global supabase instance for consistency
      const { data, error } = await globalSupabase.auth.verifyOtp({
        token_hash: token,
        type: type as any,
      })

      if (error) {
        logWithTimestamp("VERIFY-CONFIRMATION", "OTP verification error:", error)
        setStatus("error")
        setError(`Verification error: ${error.message}`)
        return false
      }

      logWithTimestamp("VERIFY-CONFIRMATION", "OTP verification successful", {
        hasSession: !!data.session,
        userId: data.user?.id,
      })

      if (data.session && data.user) {
        // Wait for session to be fully established
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Process the verification with the new session
        await processVerification(data.session)
        return true
      }

      return false
    } catch (err) {
      logWithTimestamp("VERIFY-CONFIRMATION", "Error in OTP verification:", err)
      return false
    }
  }, [searchParams, processVerification])

  // Check if there's a token in the URL
  const hasTokenInUrl = useCallback(() => {
    // Common token parameter names used by Supabase
    const tokenParams = ["access_token", "refresh_token", "token", "code"]
    const hash = window.location.hash
    const query = window.location.search

    // Check hash fragment first (implicit flow)
    if (hash) {
      for (const param of tokenParams) {
        if (hash.includes(`${param}=`)) {
          return true
        }
      }
    }

    // Check query parameters (code flow)
    if (query) {
      for (const param of tokenParams) {
        if (searchParams.has(param)) {
          return true
        }
      }
    }

    return false
  }, [searchParams])

  // Use window.location for redirects to preserve hash fragments
  const performRedirect = (destination: string) => {
    logWithTimestamp("VERIFY-CONFIRMATION", `NOW REDIRECTING TO: ${destination}`)

    // Always use window.location for redirects to preserve hash fragments
    window.location.href = destination
  }

  // Set up auth state change listener and handle verification
  useEffect(() => {
    if (verificationAttempted) {
      return // Prevent multiple verification attempts
    }

    setVerificationAttempted(true)
    logWithTimestamp("VERIFY-CONFIRMATION", "Page loaded, checking for verification methods")

    // First try explicit token exchange (new approach)
    handleExplicitTokenExchange().then((success) => {
      if (success) {
        logWithTimestamp("VERIFY-CONFIRMATION", "Explicit token exchange handled successfully")
        return // Stop here if explicit exchange was successful
      }

      // If explicit exchange fails, try OTP verification
      handleOtpVerification().then((success) => {
        if (success) {
          logWithTimestamp("VERIFY-CONFIRMATION", "OTP verification handled successfully")
          return // Stop here if OTP verification was successful
        }

        // Fall back to token detection if other methods failed
        const tokenPresent = hasTokenInUrl()

        if (tokenPresent) {
          logWithTimestamp("VERIFY-CONFIRMATION", "Token detected in URL, waiting for Supabase to process it")
          setStatus("processing")

          // Set a timeout in case the auth state change never fires
          const timeout = setTimeout(() => {
            logWithTimestamp("VERIFY-CONFIRMATION", "Auth state change timeout reached")

            // Check if we have a session anyway
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session) {
                logWithTimestamp("VERIFY-CONFIRMATION", "Found session after timeout")
                processVerification(session)
              } else {
                setStatus("error")
                setError("Verification timed out. Please try again or contact support.")
              }
            })
          }, AUTH_STATE_TIMEOUT)

          setTimeoutId(timeout)
        } else {
          // No token in URL, check for existing session
          logWithTimestamp("VERIFY-CONFIRMATION", "No token in URL, checking for existing session")

          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              logWithTimestamp("VERIFY-CONFIRMATION", "Found existing session")
              processVerification(session)
            } else {
              setStatus("error")
              setError("No active session found. Please log in again.")
            }
          })
        }
      })
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      logWithTimestamp("VERIFY-CONFIRMATION", `Auth state changed: ${event}`, {
        hasSession: !!session,
        userId: session?.user?.id,
        eventType: event,
      })

      // Only process on SIGNED_IN event, not INITIAL_SESSION
      if (event === "SIGNED_IN" && session) {
        logWithTimestamp("VERIFY-CONFIRMATION", "User signed in via auth state change")
        processVerification(session)
      }
    })

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [
    supabase,
    hasTokenInUrl,
    processVerification,
    handleOtpVerification,
    handleExplicitTokenExchange,
    timeoutId,
    verificationAttempted,
  ])

  const manualRedirect = () => {
    if (redirectTarget) {
      logWithTimestamp("VERIFY-CONFIRMATION", `Manual redirect to: ${redirectTarget}`)
      window.location.href = redirectTarget
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center">
          {(status === "detecting" || status === "processing") && (
            <div className="flex justify-center mb-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          )}
          {(status === "verified" || status === "redirecting") && (
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
          )}
          {status === "error" && (
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>
          )}
          <CardTitle className="text-2xl">
            {status === "detecting" && "Checking verification..."}
            {status === "processing" && "Processing verification..."}
            {status === "verified" && "Email Verified!"}
            {status === "redirecting" && "Email Verified! Redirecting..."}
            {status === "error" && "Verification Error"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          {status === "detecting" && <p>Checking your verification status...</p>}
          {status === "processing" && <p>Processing your verification. This may take a moment...</p>}
          {status === "verified" && <p>Your email has been successfully verified. You will be redirected shortly.</p>}
          {status === "redirecting" && (
            <>
              <p>Your email has been successfully verified.</p>
              <p className="mt-2 text-sm text-muted-foreground">Redirecting to: {redirectTarget.split("?")[0]}</p>
              <div className="mt-4">
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              </div>
            </>
          )}
          {status === "error" && <p className="text-red-600">{error}</p>}

          {DEBUG_CONFIG.showDebugUI && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-left text-xs">
              <p className="font-semibold">Debug Info:</p>
              <p>Status: {status}</p>
              {redirectTarget && <p>Target: {redirectTarget}</p>}
              <p>Token in URL: {hasTokenInUrl() ? "Yes" : "No"}</p>
              <p>OTP Params: {searchParams.has("token") && searchParams.has("type") ? "Yes" : "No"}</p>
              <p>Code Param: {searchParams.has("code") ? "Yes" : "No"}</p>
              <p>Hash Params: {window.location.hash ? "Yes" : "No"}</p>
              <p>Timeout: {AUTH_STATE_TIMEOUT}ms</p>
              {DEBUG_CONFIG.redirectDelay && <p>Redirect Delay: {DEBUG_CONFIG.redirectDelay}ms</p>}
            </div>
          )}
        </CardContent>

        {((DEBUG_CONFIG.showDebugUI && redirectTarget) || status === "error") && (
          <CardFooter>
            {status === "error" && (
              <Button onClick={() => router.push("/login")} className="w-full">
                Back to Login
              </Button>
            )}
            {DEBUG_CONFIG.showDebugUI && redirectTarget && status === "redirecting" && (
              <Button onClick={manualRedirect} className="w-full">
                Manual Redirect
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}


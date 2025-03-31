"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShieldCheck } from "lucide-react"
import { checkProfileStatus } from "@/lib/utils/profile"
import { logWithTimestamp } from "@/lib/utils/debug-utils"
import {
  recoverSessionFromStorage,
  aggressiveSessionRecovery,
  inspectAuthStorage,
  verifySessionBeforeRedirect,
} from "@/lib/supabase/client"

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [sessionStatus, setSessionStatus] = useState<"checking" | "found" | "not_found">("checking")
  const [recoveryAttempts, setRecoveryAttempts] = useState(0)
  const MAX_RECOVERY_ATTEMPTS = 3

  // Log page load with query parameters
  useEffect(() => {
    const source = searchParams.get("source")
    const t = searchParams.get("t")

    logWithTimestamp("ONBOARDING-PAGE", "Onboarding page loaded", {
      source,
      t,
      url: window.location.href,
      referrer: document.referrer,
    })

    // Check if there was a redirection that brought us here
    if (source) {
      logWithTimestamp("ONBOARDING-PAGE", `Arrived via redirection from: ${source}`)
    }
  }, [searchParams])

  // Enhanced session recovery function with retries
  const attemptSessionRecovery = async () => {
    if (recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) {
      logWithTimestamp("ONBOARDING", `Max recovery attempts (${MAX_RECOVERY_ATTEMPTS}) reached, giving up`)
      return null
    }

    setRecoveryAttempts((prev) => prev + 1)

    try {
      logWithTimestamp(
        "ONBOARDING",
        `Attempting session recovery (attempt ${recoveryAttempts + 1}/${MAX_RECOVERY_ATTEMPTS})`,
      )

      // First try refreshing the session
      const { data: refreshData } = await supabase.auth.refreshSession()
      if (refreshData.session) {
        logWithTimestamp("ONBOARDING", "Recovered session via refresh", {
          userId: refreshData.session.user.id,
        })
        return refreshData.session
      }

      // If that fails, try the recovery helper
      const recoveredSession = await recoverSessionFromStorage()
      if (recoveredSession) {
        logWithTimestamp("ONBOARDING", "Recovered session from storage", {
          userId: recoveredSession.user.id,
        })
        return recoveredSession
      }

      // If standard recovery fails, try aggressive recovery
      const aggressiveSession = await aggressiveSessionRecovery()
      if (aggressiveSession) {
        logWithTimestamp("ONBOARDING", "Recovered session via aggressive recovery", {
          userId: aggressiveSession.user.id,
        })
        return aggressiveSession
      }

      // Inspect localStorage for debugging
      inspectAuthStorage()

      // Add a delay before the next attempt with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, recoveryAttempts), 5000)
      await new Promise((resolve) => setTimeout(resolve, delay))

      return null
    } catch (error) {
      logWithTimestamp("ONBOARDING", "Error during session recovery:", error)
      return null
    }
  }

  // Set up auth state change listener
  useEffect(() => {
    logWithTimestamp("ONBOARDING", "Setting up auth state listener")
    let mounted = true

    // Check for existing session first
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (session) {
          logWithTimestamp("ONBOARDING", "Found existing session", {
            userId: session.user.id,
          })

          // Verify session is properly established
          const { success } = await verifySessionBeforeRedirect(2, 500)
          if (success) {
            setSessionStatus("found")
            fetchProfile(session)
          } else {
            logWithTimestamp("ONBOARDING", "Session found but verification failed, attempting recovery")
            const recoveredSession = await attemptSessionRecovery()

            if (!mounted) return

            if (recoveredSession) {
              setSessionStatus("found")
              fetchProfile(recoveredSession)
            } else {
              setSessionStatus("checking") // Still checking via auth state change
            }
          }
        } else {
          logWithTimestamp("ONBOARDING", "No existing session found, attempting recovery")

          // Try to recover the session
          const recoveredSession = await attemptSessionRecovery()

          if (!mounted) return

          if (recoveredSession) {
            logWithTimestamp("ONBOARDING", "Session recovered successfully", {
              userId: recoveredSession.user.id,
            })
            setSessionStatus("found")
            fetchProfile(recoveredSession)
          } else {
            setSessionStatus("checking") // Still checking via auth state change
          }
        }
      } catch (error) {
        if (!mounted) return
        logWithTimestamp("ONBOARDING", "Error checking session:", error)
      }
    }

    checkSession()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      logWithTimestamp("ONBOARDING", `Auth state changed: ${event}`, {
        hasSession: !!session,
        userId: session?.user?.id,
      })

      if (event === "SIGNED_IN" && session) {
        logWithTimestamp("ONBOARDING", "User signed in via auth state change")
        setSessionStatus("found")
        fetchProfile(session)
      } else if (event === "SIGNED_OUT") {
        logWithTimestamp("ONBOARDING", "User signed out")
        setSessionStatus("not_found")
        router.push("/login")
      }
    })

    // Set a timeout for session check with recovery attempts
    const timeout = setTimeout(async () => {
      if (!mounted) return

      if (sessionStatus === "checking") {
        logWithTimestamp("ONBOARDING", "Session check initial timeout, trying final recovery")

        // One last attempt at recovery before giving up
        const lastChanceSession = await attemptSessionRecovery()

        if (!mounted) return

        if (lastChanceSession) {
          logWithTimestamp("ONBOARDING", "Last chance recovery successful")
          setSessionStatus("found")
          fetchProfile(lastChanceSession)
        } else {
          logWithTimestamp("ONBOARDING", "All recovery attempts failed, redirecting to login")
          setSessionStatus("not_found")
          router.push("/login")
        }
      }
    }, 5000)

    // Clean up
    return () => {
      mounted = false
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [supabase, router, sessionStatus, recoveryAttempts])

  const fetchProfile = async (session) => {
    try {
      // Fetch profile data
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      logWithTimestamp("ONBOARDING", "Fetched profile:", {
        profileId: profile?.id,
        onboardingCompleted: profile?.onboarding_completed,
        typeOfOnboardingCompleted: typeof profile?.onboarding_completed,
      })

      setProfile(profile)

      // Use the consolidated function to check if onboarding is completed
      const profileStatus = checkProfileStatus(profile)

      logWithTimestamp("ONBOARDING", "Profile status check:", {
        exists: profileStatus.exists,
        isComplete: profileStatus.isComplete,
      })

      // If onboarding is already completed, redirect to home
      if (profileStatus.isComplete) {
        logWithTimestamp("ONBOARDING", "Already completed, redirecting to home")
        router.push("/")
      }
    } catch (error) {
      logWithTimestamp("ONBOARDING", "Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const startOnboarding = () => {
    router.push("/onboarding/profile")
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">
          {sessionStatus === "checking" ? "Checking your session..." : "Loading your profile..."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Shelther</CardTitle>
          <CardDescription>Let's set up your personal safety profile</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What you'll need:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Basic profile information</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>At least one emergency contact</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Location permissions (optional but recommended)</span>
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={startOnboarding} className="w-full">
            Start Setup
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


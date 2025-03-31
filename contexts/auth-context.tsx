"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, logAuthEvent } from "@/lib/supabase/client"
import { authUrls } from "@/lib/auth-urls"
import { waitForSession, refreshSession } from "@/lib/session-manager"
import type { User, Session } from "@supabase/supabase-js"
import { handleAuthError } from "@/lib/error-handler"
import { checkProfileById } from "@/lib/utils/profile"

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "verification_pending"

interface AuthState {
  status: AuthStatus
  user: User | null
  session: Session | null
  error: Error | null
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, userData: { full_name: string; phone: string }) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  isAuthenticated: () => boolean
  resendVerificationEmail: (email: string) => Promise<void>
  refreshAuthState: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
    session: null,
    error: null,
  })

  // Function to refresh the auth state
  const refreshAuthState = async () => {
    try {
      logAuthEvent("Refreshing auth state")

      // Refresh the session
      const sessionResult = await refreshSession()

      if (sessionResult.valid && sessionResult.user) {
        logAuthEvent("Session refreshed successfully", { userId: sessionResult.user.id })

        setState({
          status: "authenticated",
          user: sessionResult.user,
          session: await supabase.auth.getSession().then((res) => res.data.session),
          error: null,
        })

        return true
      } else {
        logAuthEvent("No valid session after refresh")

        setState({
          status: "unauthenticated",
          user: null,
          session: null,
          error: null,
        })

        return false
      }
    } catch (error) {
      logAuthEvent("Error refreshing auth state", {}, error)

      setState((prev) => ({
        ...prev,
        error: handleAuthError(error),
      }))

      return false
    }
  }

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logAuthEvent("Auth state change", { event, userId: session?.user?.id })

      if (session) {
        const isEmailVerified = !!session.user.email_confirmed_at
        logAuthEvent("Session found", {
          userId: session.user.id,
          emailVerified: isEmailVerified,
          emailConfirmedAt: session.user.email_confirmed_at,
        })

        setState({
          status: "authenticated",
          user: session.user,
          session,
          error: null,
        })

        // If signed in and email is verified, check if profile exists
        if (event === "SIGNED_IN" && isEmailVerified) {
          try {
            // Use the consolidated function
            const profileResult = await checkProfileById(session.user.id)

            // If no profile exists or profile is incomplete, redirect to onboarding
            if (!profileResult.exists || !profileResult.isComplete) {
              logAuthEvent("Profile incomplete or missing, redirecting to onboarding", {
                userId: session.user.id,
                profileExists: profileResult.exists,
                profileComplete: profileResult.isComplete,
                onboardingCompleted: profileResult.profile?.onboarding_completed,
                typeOfOnboardingCompleted: typeof profileResult.profile?.onboarding_completed,
              })
              router.push(authUrls.getOnboardingUrl())
            }
          } catch (error) {
            console.error("Error checking profile:", error)
          }
        }
      } else {
        setState({
          status: "unauthenticated",
          user: null,
          session: null,
          error: null,
        })
      }

      // Handle specific auth events
      if (event === "SIGNED_IN") {
        logAuthEvent("User signed in", { userId: session?.user?.id })
        router.refresh()
      } else if (event === "SIGNED_OUT") {
        logAuthEvent("User signed out")
        router.push(authUrls.getLoginUrl())
      } else if (event === "PASSWORD_RECOVERY") {
        router.push("/new-password")
      } else if (event === "USER_UPDATED") {
        setState((prev) => ({
          ...prev,
          user: session?.user || null,
        }))
      }
    })

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Wait for session to stabilize
        const sessionResult = await waitForSession(3)

        if (sessionResult.valid && sessionResult.user) {
          logAuthEvent("Initial session found", { userId: sessionResult.user.id })

          const session = await supabase.auth.getSession().then((res) => res.data.session)

          setState({
            status: "authenticated",
            user: sessionResult.user,
            session,
            error: null,
          })
        } else {
          logAuthEvent("No initial session found")

          setState({
            status: "unauthenticated",
            user: null,
            session: null,
            error: null,
          })
        }
      } catch (error) {
        logAuthEvent("Error initializing auth", {}, error)

        setState({
          status: "unauthenticated",
          user: null,
          session: null,
          error: handleAuthError(error),
        })
      }
    }

    initializeAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Auth methods
  const signUp = async (email: string, password: string, userData: { full_name: string; phone: string }) => {
    try {
      setState((prev) => ({ ...prev, error: null }))

      logAuthEvent("Signing up user", { email })

      // Use our centralized auth URL utility
      const redirectTo = authUrls.getVerificationConfirmationUrl()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || "",
            phone: userData.phone || "",
          },
          emailRedirectTo: redirectTo, // Consistent redirect URL
        },
      })

      if (error) throw error

      logAuthEvent("Sign up response received", {
        userId: data.user?.id,
        hasSession: !!data.session,
      })

      // If email confirmation is required
      if (data.user && !data.session) {
        setState({
          status: "verification_pending",
          user: data.user,
          session: null,
          error: null,
        })
        router.push(`/verify?email=${encodeURIComponent(email)}`)
      } else if (data.session) {
        // If we have a session immediately (e.g., email confirmation disabled)
        setState({
          status: "authenticated",
          user: data.user,
          session: data.session,
          error: null,
        })
        // The callback will handle redirection and profile creation
      }
    } catch (error) {
      logAuthEvent("Sign up error", {}, error)
      setState((prev) => ({
        ...prev,
        error: handleAuthError(error),
      }))
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }))

      logAuthEvent("Signing in user", { email })

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      logAuthEvent("Sign in successful", { userId: data.user.id })

      const isEmailVerified = !!data.user.email_confirmed_at
      logAuthEvent("Email verification status", {
        userId: data.user.id,
        emailVerified: isEmailVerified,
        emailConfirmedAt: data.user.email_confirmed_at,
      })

      setState({
        status: "authenticated",
        user: data.user,
        session: data.session,
        error: null,
      })

      // If email not verified, redirect to verification page
      if (!isEmailVerified) {
        logAuthEvent("Email not verified, redirecting", { userId: data.user.id })
        router.push(`/verify?email=${encodeURIComponent(email)}`)
        return
      }

      // Check if profile exists and is complete using consolidated function
      const profileResult = await checkProfileById(data.user.id)

      // If no profile or profile is incomplete, redirect to onboarding
      if (!profileResult.exists || !profileResult.isComplete) {
        logAuthEvent("Profile incomplete or missing, redirecting to onboarding", {
          userId: data.user.id,
          profileExists: profileResult.exists,
          profileComplete: profileResult.isComplete,
          onboardingCompleted: profileResult.profile?.onboarding_completed,
          typeOfOnboardingCompleted: typeof profileResult.profile?.onboarding_completed,
        })
        router.push(authUrls.getOnboardingUrl())
      } else {
        router.push(authUrls.getHomeUrl())
      }
    } catch (error) {
      console.error("Sign in error:", error)
      logAuthEvent("Sign in error", {}, error)
      setState((prev) => ({
        ...prev,
        error: handleAuthError(error),
      }))
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      setState((prev) => ({ ...prev, error: null }))

      logAuthEvent("Initiating Google sign-in")

      // Use our centralized auth URL utility
      const redirectTo = authUrls.getAuthCallbackUrl()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo, // Consistent redirect URL
        },
      })

      if (error) throw error
    } catch (error) {
      logAuthEvent("Google sign-in error", {}, error)
      setState((prev) => ({
        ...prev,
        error: handleAuthError(error),
      }))
      throw error
    }
  }

  const signOut = async () => {
    try {
      logAuthEvent("Signing out user", { userId: state.user?.id })
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setState({
        status: "unauthenticated",
        user: null,
        session: null,
        error: null,
      })
    } catch (error) {
      logAuthEvent("Sign out error", {}, error)
      setState((prev) => ({
        ...prev,
        error: handleAuthError(error),
      }))
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }))
      logAuthEvent("Requesting password reset", { email })

      // Use our centralized auth URL utility
      const redirectTo = authUrls.getAuthCallbackUrl()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) throw error
    } catch (error) {
      logAuthEvent("Password reset error", {}, error)
      setState((prev) => ({
        ...prev,
        error: handleAuthError(error),
      }))
      throw error
    }
  }

  const updatePassword = async (password: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }))
      logAuthEvent("Updating password", { userId: state.user?.id })

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      router.push(authUrls.getLoginUrl())
    } catch (error) {
      logAuthEvent("Update password error", {}, error)
      setState((prev) => ({
        ...prev,
        error: handleAuthError(error),
      }))
      throw error
    }
  }

  const resendVerificationEmail = async (email: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }))
      logAuthEvent("Resending verification email", { email })

      // Use our centralized auth URL utility
      const redirectTo = authUrls.getVerificationConfirmationUrl()

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: redirectTo, // Consistent redirect URL
        },
      })

      if (error) throw error

      logAuthEvent("Verification email resent successfully", { email })
    } catch (error) {
      logAuthEvent("Resend verification error", {}, error)
      setState((prev) => ({
        ...prev,
        error: handleAuthError(error),
      }))
      throw error
    }
  }

  const isAuthenticated = () => {
    return state.status === "authenticated" && !!state.session
  }

  const value = {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated,
    resendVerificationEmail,
    refreshAuthState,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


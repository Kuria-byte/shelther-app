import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { authUrls } from "@/lib/auth-urls"

// Create a single supabase client for the entire app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Use our centralized auth URLs utility for consistent redirects
const redirectUrl = authUrls.getVerificationConfirmationUrl()

// Enhanced storage implementation with error handling, logging, and sync support
const enhancedStorage = {
  getItem: (key: string) => {
    try {
      if (typeof window === "undefined") {
        return null
      }
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error("Error retrieving from storage:", error)
      return null
    }
  },
  setItem: (key: string, value: any) => {
    try {
      if (typeof window === "undefined") {
        return
      }
      // Use a synchronous approach for better persistence
      localStorage.setItem(key, JSON.stringify(value))

      // Log storage operations in development
      if (process.env.NODE_ENV === "development") {
        console.log(`[STORAGE] Stored ${key} at ${new Date().toISOString()}`)
      }
    } catch (error) {
      console.error("Error setting storage:", error)
    }
  },
  removeItem: (key: string) => {
    try {
      if (typeof window === "undefined") {
        return
      }
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from storage:", error)
    }
  },
}

// Strengthen the singleton pattern to prevent multiple instances
// Use a global variable to track initialization status
let isInitializing = false
let initializationPromise: Promise<any> | null = null
let initializationResolve: Function | null = null

// Create a singleton Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const supabase = (() => {
  // If we already have an instance, return it immediately
  if (supabaseInstance) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[SUPABASE] Reusing existing client instance at ${new Date().toISOString()}`)
    }
    return supabaseInstance
  }

  // If initialization is in progress, wait for it to complete
  if (isInitializing) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[SUPABASE] Initialization in progress, waiting...`)
    }

    // If there's no promise yet, create one
    if (!initializationPromise) {
      initializationPromise = new Promise((resolve) => {
        initializationResolve = resolve
      })
    }

    // This will block until initialization completes
    initializationPromise.then(() => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[SUPABASE] Initialization completed, returning instance`)
      }
    })

    return supabaseInstance!
  }

  // Mark as initializing to prevent multiple initializations
  isInitializing = true

  // Log client creation to help debug multiple instance issues
  if (process.env.NODE_ENV === "development") {
    console.log(`[SUPABASE] Creating new client instance at ${new Date().toISOString()}`)
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "implicit",
      redirectTo: redirectUrl,
      // Add debug logging for auth events in development
      debug: process.env.NODE_ENV === "development",
      // Increase storage options for better persistence
      storageKey: "shelther-auth-token",
      storage: enhancedStorage,
      // Increase cookie options for better persistence
      cookieOptions: {
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    },
  })

  // Mark initialization as complete
  isInitializing = false

  // Resolve the initialization promise if it exists
  if (initializationResolve) {
    initializationResolve(supabaseInstance)
    initializationPromise = null
    initializationResolve = null
  }

  return supabaseInstance
})()

// Add a helper function to log auth events consistently
export const logAuthEvent = (event: string, details: any = {}, error: any = null) => {
  if (process.env.NODE_ENV === "development") {
    console.log({
      event,
      timestamp: new Date().toISOString(),
      details,
      error: error ? { message: error.message, ...error } : null,
    })
  }
}

// Add a helper function to get the current session
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error)
      return null
    }

    return data.session
  } catch (error) {
    console.error("Unexpected error getting session:", error)
    return null
  }
}

// Add a helper function to get the current user
export const getUser = async () => {
  const session = await getSession()
  return session?.user || null
}

// Add a helper function to explicitly refresh the session
// This can help solve persistence issues across redirects
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      console.error("Error refreshing session:", error)
      return null
    }

    return data.session
  } catch (error) {
    console.error("Unexpected error refreshing session:", error)
    return null
  }
}

// Add a helper function to extract token from URL hash
export const extractTokenFromUrl = () => {
  if (typeof window === "undefined") return null

  const hash = window.location.hash
  if (!hash || hash.length < 2) return null

  // Remove the leading # and parse the parameters
  const params = new URLSearchParams(hash.substring(1))

  // Check for access_token
  const accessToken = params.get("access_token")
  if (accessToken) return { access_token: accessToken }

  return null
}

// Add a helper function to check if session is fully established
export const isSessionEstablished = async () => {
  try {
    const session = await getSession()
    if (!session) return false

    // Check if the session has the necessary properties
    return !!session.access_token && !!session.user
  } catch (error) {
    console.error("Error checking session establishment:", error)
    return false
  }
}

// Add a helper function to verify OTP tokens
export const verifyOtpToken = async (token: string, type: "signup" | "recovery" | "invite" | "magiclink" | "email") => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type,
    })

    if (error) {
      console.error("Error verifying OTP token:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error verifying OTP token:", error)
    return { success: false, error }
  }
}

// Add a helper function to recover session from localStorage
export const recoverSessionFromStorage = async () => {
  try {
    if (typeof window === "undefined") return null

    // Try to refresh the session first
    const refreshResult = await refreshSession()
    if (refreshResult) return refreshResult

    // If refresh failed, try to get the session directly
    const session = await getSession()
    if (session) return session

    return null
  } catch (error) {
    console.error("Error recovering session from storage:", error)
    return null
  }
}

// New helper function to exchange code for session
export const exchangeCodeForSession = async (code: string) => {
  try {
    // This is a wrapper around Supabase's exchangeCodeForSession
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[AUTH] Error exchanging code for session:", error)
      return { success: false, error, data: null }
    }

    return { success: true, error: null, data }
  } catch (error) {
    console.error("[AUTH] Unexpected error exchanging code for session:", error)
    return { success: false, error, data: null }
  }
}

// New helper function to verify session is established before redirect
export const verifySessionBeforeRedirect = async (maxAttempts = 3, delayMs = 1000) => {
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`[AUTH] Verifying session before redirect (attempt ${i + 1}/${maxAttempts})`)

    const session = await getSession()
    if (session && session.user && session.access_token) {
      console.log("[AUTH] Session verified successfully before redirect")
      return { success: true, session }
    }

    // Wait before trying again
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  console.error("[AUTH] Failed to verify session after multiple attempts")
  return { success: false, session: null }
}

// New helper function to inspect localStorage for debugging
export const inspectAuthStorage = () => {
  if (typeof window === "undefined") return null

  try {
    // Get the Supabase auth storage
    const authStorage = localStorage.getItem("supabase.auth.token")
    if (!authStorage) return null

    // Parse the storage
    const parsed = JSON.parse(authStorage)

    // Log the storage contents for debugging
    console.log("[AUTH-DEBUG] Auth storage contents:", {
      hasCurrentSession: !!parsed?.currentSession,
      hasAccessToken: !!parsed?.currentSession?.access_token,
      hasRefreshToken: !!parsed?.currentSession?.refresh_token,
      expiresAt: parsed?.currentSession?.expires_at,
      userId: parsed?.currentSession?.user?.id,
    })

    return parsed
  } catch (error) {
    console.error("[AUTH-DEBUG] Error inspecting auth storage:", error)
    return null
  }
}

// New helper function for aggressive session recovery
export const aggressiveSessionRecovery = async () => {
  try {
    // First try normal refresh
    const refreshed = await refreshSession()
    if (refreshed) return refreshed

    // If that fails, inspect localStorage
    const storage = inspectAuthStorage()
    if (!storage?.currentSession?.access_token) {
      return null
    }

    // If we found a token in storage, try to use it
    console.log("[AUTH] Found token in storage, attempting recovery")

    // Try refreshing again after confirming token exists
    const secondRefresh = await refreshSession()
    if (secondRefresh) return secondRefresh

    // If all else fails, return null
    return null
  } catch (error) {
    console.error("[AUTH] Error in aggressive session recovery:", error)
    return null
  }
}


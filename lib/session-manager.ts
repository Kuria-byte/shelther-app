import { supabase } from "@/lib/supabase/client"

/**
 * Maximum number of attempts to check for a valid session
 */
const MAX_SESSION_CHECK_ATTEMPTS = 5

/**
 * Delay between session check attempts (in milliseconds)
 */
const SESSION_CHECK_DELAY = 500

/**
 * Interface for session check result
 */
interface SessionCheckResult {
  valid: boolean
  user: any | null
  error?: any
}

/**
 * Check if there is a valid session
 * @returns Promise with session check result
 */
export const checkSession = async (): Promise<SessionCheckResult> => {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error checking session:", error)
      return { valid: false, user: null, error }
    }

    if (!data.session) {
      return { valid: false, user: null }
    }

    return { valid: true, user: data.session.user }
  } catch (error) {
    console.error("Unexpected error checking session:", error)
    return { valid: false, user: null, error }
  }
}

/**
 * Wait for a valid session to be established
 * @param maxAttempts Maximum number of attempts to check for a valid session
 * @param delayMs Delay between attempts in milliseconds
 * @returns Promise with session check result
 */
export const waitForSession = async (
  maxAttempts = MAX_SESSION_CHECK_ATTEMPTS,
  delayMs = SESSION_CHECK_DELAY,
): Promise<SessionCheckResult> => {
  let attempts = 0

  while (attempts < maxAttempts) {
    const result = await checkSession()

    if (result.valid) {
      return result
    }

    attempts++

    if (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  return { valid: false, user: null, error: new Error("Session not established after maximum attempts") }
}

/**
 * Force a session refresh
 * @returns Promise with session check result
 */
export const refreshSession = async (): Promise<SessionCheckResult> => {
  try {
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      console.error("Error refreshing session:", error)
      return { valid: false, user: null, error }
    }

    if (!data.session) {
      return { valid: false, user: null }
    }

    return { valid: true, user: data.session.user }
  } catch (error) {
    console.error("Unexpected error refreshing session:", error)
    return { valid: false, user: null, error }
  }
}

/**
 * Get the current user from the session
 * @returns The current user or null if not authenticated
 */
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}


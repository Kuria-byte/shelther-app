/**
 * Debug utilities for tracking and diagnosing issues
 */

import { checkProfileStatus } from "./profile"

/**
 * Logs detailed profile information for debugging
 *
 * @param profile The user profile object from Supabase
 * @param source The source of the debug call (component/function name)
 */
export const debugProfileStatus = (profile: any, source: string) => {
  const status = checkProfileStatus(profile)

  console.log(`[DEBUG-PROFILE] Source: ${source}`, {
    exists: status.exists,
    isComplete: status.isComplete,
    onboardingCompleted: status.exists ? profile.onboarding_completed : null,
    onboardingCompletedType: status.exists ? typeof profile.onboarding_completed : null,
    userId: status.exists ? profile.id : null,
    profileFields: status.exists ? Object.keys(profile) : [],
    timestamp: new Date().toISOString(),
  })

  // Check for potential issues
  if (status.exists) {
    if (profile.onboarding_completed !== true && profile.onboarding_completed !== false) {
      console.warn(
        `[DEBUG-PROFILE] Warning: onboarding_completed is neither true nor false: ${profile.onboarding_completed}`,
      )
    }

    if (typeof profile.onboarding_completed === "string") {
      console.warn(
        `[DEBUG-PROFILE] Warning: onboarding_completed is a string ('${profile.onboarding_completed}') instead of a boolean`,
      )
    }
  }

  return status
}


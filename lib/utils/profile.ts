import type { Profile } from "@/types/database"
import { supabase } from "@/lib/supabase/client"
import { logWithTimestamp } from "./debug-utils"

/**
 * CONSOLIDATED PROFILE UTILITY FUNCTIONS
 * This file serves as the single source of truth for all profile-related checks and operations
 * Version 2.0 - Simplified profile check logic with strict equality
 */

// Version identification to confirm which code is being loaded
console.log("[PROFILE-UTILS] Loading v2.0 of profile utilities with strict equality checks")

/**
 * Interface for profile check result
 */
export interface ProfileCheckResult {
  exists: boolean
  isComplete: boolean
  profile: any | null
  error?: any
}

/**
 * Fetch a user profile from Supabase
 * @param userId The user ID to fetch
 * @returns Promise with the profile data and any error
 */
export const fetchProfile = async (userId: string) => {
  console.log(`[PROFILE-FETCH] Fetching profile for user: ${userId}`)

  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error(`[PROFILE-FETCH] Error fetching profile:`, error)
      return { data: null, error }
    }

    console.log(`[PROFILE-FETCH] Successfully fetched profile:`, {
      userId,
      profileId: data?.id,
      onboardingCompleted: data?.onboarding_completed,
      typeOfOnboardingCompleted: typeof data?.onboarding_completed,
      timestamp: new Date().toISOString(),
    })

    return { data, error: null }
  } catch (error) {
    console.error(`[PROFILE-FETCH] Unexpected error:`, error)
    return { data: null, error }
  }
}

/**
 * CENTRALIZED PROFILE CHECK FUNCTION - SIMPLIFIED VERSION
 * This is the single source of truth for profile completeness checks
 * Uses strict equality to ensure onboarding_completed is exactly true
 *
 * @param profile The user profile object from Supabase
 * @returns Object with exists flag, isComplete flag, and the profile
 */
export const checkProfileStatus = (profile: any): ProfileCheckResult => {
  const exists = !!profile

  // Most direct check possible - ONLY true if exactly === true
  const isComplete = exists && profile.onboarding_completed === true

  // Get the raw value and type for debugging
  const rawValue = exists ? profile.onboarding_completed : null
  const valueType = exists ? typeof profile.onboarding_completed : null
  const strictComparison = exists ? profile.onboarding_completed === true : null

  logWithTimestamp("PROFILE-CHECK", "SIMPLIFIED checkProfileStatus:", {
    exists,
    isComplete,
    rawValue,
    valueType,
    strictComparison,
    userId: exists ? profile.id : null,
  })

  return { exists, isComplete, profile }
}

/**
 * Check if a profile exists and is complete by user ID
 * @param userId The user ID to check
 * @returns Promise with profile check result
 */
export const checkProfileById = async (userId: string): Promise<ProfileCheckResult> => {
  console.log(`[PROFILE-CHECK] checkProfileById for user: ${userId}`)

  try {
    if (!userId) {
      console.log(`[PROFILE-CHECK] No userId provided`)
      return { exists: false, isComplete: false, profile: null }
    }

    const { data: profile, error } = await fetchProfile(userId)

    if (error) {
      // If the error is "No rows found", the profile doesn't exist
      if (error.message && error.message.includes("No rows found")) {
        console.log(`[PROFILE-CHECK] No profile found for user: ${userId}`)
        return { exists: false, isComplete: false, profile: null }
      }

      // Otherwise, there was an error fetching the profile
      console.error(`[PROFILE-CHECK] Error checking profile:`, error)
      return { exists: false, isComplete: false, profile: null, error }
    }

    // Use the centralized function to check if the profile is complete
    const result = checkProfileStatus(profile)

    console.log(`[PROFILE-CHECK] checkProfileById result for ${userId}:`, {
      exists: result.exists,
      isComplete: result.isComplete,
      timestamp: new Date().toISOString(),
      source: "lib/utils/profile.ts:checkProfileById",
    })

    return result
  } catch (error) {
    console.error(`[PROFILE-CHECK] Unexpected error checking profile:`, error)
    return { exists: false, isComplete: false, profile: null, error }
  }
}

/**
 * Checks if a user profile is complete based on the onboarding_completed flag
 * Uses strict equality to ensure onboarding_completed is exactly true
 *
 * @param profile The user profile object from the database
 * @returns boolean indicating if the profile is complete
 */
export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) {
    console.log(`[PROFILE-CHECK] isProfileComplete: No profile found`)
    return false
  }

  // Strict equality check - only true if onboarding_completed is exactly true
  const isComplete = profile.onboarding_completed === true

  console.log(`[PROFILE-CHECK] isProfileComplete strict check:`, {
    isComplete,
    rawValue: profile.onboarding_completed,
    valueType: typeof profile.onboarding_completed,
    strictComparison: profile.onboarding_completed === true,
    profileId: profile.id,
    timestamp: new Date().toISOString(),
    source: "lib/utils/profile.ts:isProfileComplete",
  })

  return isComplete
}

/**
 * Create or update a user profile
 * @param userId The user ID
 * @param userData The user data to save
 * @returns Promise with the created/updated profile
 */
export const createOrUpdateProfile = async (userId: string, userData: any) => {
  console.log(`[PROFILE-CREATE] Creating/updating profile for user: ${userId}`, userData)

  try {
    const profileData = {
      id: userId,
      full_name: userData.full_name || "",
      email: userData.email || "",
      phone_number: userData.phone || "",
      location_sharing_enabled: true,
      onboarding_completed: false, // Explicitly set to boolean false
      notification_preferences: {
        emergency: true,
        check_in: true,
        journey: true,
      },
      safety_settings: {
        auto_check_in: false,
        location_accuracy: "high",
      },
    }

    console.log(`[PROFILE-CREATE] Profile data to insert:`, {
      ...profileData,
      timestamp: new Date().toISOString(),
    })

    const { data, error } = await supabase.from("profiles").upsert(profileData, { onConflict: "id" }).select().single()

    if (error) {
      console.error(`[PROFILE-CREATE] Error creating/updating profile:`, error)
      throw error
    }

    console.log(`[PROFILE-CREATE] Profile created/updated successfully:`, {
      profileId: data.id,
      onboardingCompleted: data.onboarding_completed,
      typeOfOnboardingCompleted: typeof data.onboarding_completed,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    console.error(`[PROFILE-CREATE] Unexpected error creating/updating profile:`, error)
    throw error
  }
}

/**
 * Determines which onboarding step a user should be on based on their profile
 *
 * @param profile The user profile object from Supabase
 * @returns number indicating the current onboarding step (1-based index)
 */
export const getOnboardingStep = (profile: any): number => {
  if (!profile) return 1

  // Strict equality check for onboarding_completed
  const isCompleted = profile.onboarding_completed === true

  // If onboarding is already completed, return the final step
  if (isCompleted) return 4

  // Check which step they've completed based on profile data
  if (profile.location_sharing_enabled !== undefined) return 3

  if (profile.emergency_contact_name && profile.emergency_contact_phone) return 2

  if (profile.full_name && profile.phone_number) return 2

  return 1
}

/**
 * Checks if a user needs to complete onboarding
 * This is a convenience function that is the inverse of isProfileComplete
 *
 * @param profile The user profile object from Supabase
 * @returns boolean indicating if the user needs to complete onboarding
 */
export const needsOnboarding = (profile: any): boolean => {
  const result = !checkProfileStatus(profile).isComplete

  console.log(`[PROFILE-CHECK] needsOnboarding result:`, {
    needsOnboarding: result,
    profileId: profile?.id,
    onboardingCompleted: profile?.onboarding_completed,
    typeOfOnboardingCompleted: typeof profile?.onboarding_completed,
    timestamp: new Date().toISOString(),
    source: "lib/utils/profile.ts:needsOnboarding",
  })

  return result
}


import {
  isProfileComplete as newIsProfileComplete,
  createOrUpdateProfile as newCreateOrUpdateProfile,
  checkProfileById,
} from "@/lib/utils/profile"

console.warn(
  "[DEPRECATED] lib/profile-status.ts is deprecated. " + "Please use the functions in lib/utils/profile.ts instead.",
)

/**
 * Interface for profile check result
 */
interface ProfileCheckResult {
  exists: boolean
  isComplete: boolean
  profile: any | null
  error?: any
}

/**
 * @deprecated Use checkProfileById from lib/utils/profile.ts instead
 */
export const checkProfile = async (userId: string): Promise<ProfileCheckResult> => {
  console.warn("[DEPRECATED] checkProfile is deprecated. Use checkProfileById from lib/utils/profile.ts instead.")
  return checkProfileById(userId)
}

/**
 * @deprecated Use isProfileComplete from lib/utils/profile.ts instead
 */
export const isProfileComplete = (profile: any): boolean => {
  console.warn("[DEPRECATED] isProfileComplete is deprecated. Use isProfileComplete from lib/utils/profile.ts instead.")
  return newIsProfileComplete(profile)
}

/**
 * @deprecated Use createOrUpdateProfile from lib/utils/profile.ts instead
 */
export const createOrUpdateProfile = async (userId: string, userData: any) => {
  console.warn(
    "[DEPRECATED] createOrUpdateProfile is deprecated. Use createOrUpdateProfile from lib/utils/profile.ts instead.",
  )
  return newCreateOrUpdateProfile(userId, userData)
}


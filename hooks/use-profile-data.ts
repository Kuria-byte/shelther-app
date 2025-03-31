"use client"

import { useState, useEffect } from "react"
import { useUserData } from "@/contexts/user-data-context"
import { logWithTimestamp } from "@/lib/utils/debug-utils"
import type { Profile } from "@/types/profile"
import type { SafetyStats } from "@/types/safety-stats"
import type { SafetyCourse } from "@/types/safety-course"
import type { UserActivity } from "@/types/user-activity"

export interface ProfileData {
  profile: Profile
  safetyStats: SafetyStats
  safetyCourses: SafetyCourse[]
  recentActivities: UserActivity[]
}

interface UseProfileDataOptions {
  includeCourses?: boolean
  includeActivities?: boolean
}

export function useProfileData(options?: UseProfileDataOptions) {
  const { userData, refreshUserData, isAuthenticated, isInitialized } = useUserData()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  // Default options
  const includeCourses = options?.includeCourses !== false // Default to true
  const includeActivities = options?.includeActivities !== false // Default to true

  useEffect(() => {
    logWithTimestamp("USE-PROFILE-DATA", "Fetching profile data for user", {
      includeCourses,
      includeActivities,
      isAuthenticated,
      isInitialized,
    })

    // Wait for auth to initialize
    if (!isInitialized) {
      return
    }

    // If not authenticated, set error
    if (!isAuthenticated) {
      setError(new Error("User not authenticated"))
      setIsLoading(false)
      return
    }

    // Start loading
    setIsLoading(true)
    setError(null)

    // Refresh user data with options
    refreshUserData({
      includeCourses,
      includeActivities,
    }).catch((err) => {
      logWithTimestamp("USE-PROFILE-DATA", "Error refreshing user data", { err })
      setError(err)
    })
  }, [refreshUserData, isAuthenticated, isInitialized, includeCourses, includeActivities])

  // Transform and combine data when it changes
  useEffect(() => {
    // Skip if not initialized or not authenticated
    if (!isInitialized || !isAuthenticated) {
      return
    }

    // Check if we have the minimum required data
    const hasMinimumData = userData.profile && userData.safetyStats

    // Check if we're still loading any required data
    const stillLoading =
      userData.isLoading.profile ||
      userData.isLoading.safetyStats ||
      (includeCourses && userData.isLoading.safetyCourses) ||
      (includeActivities && userData.isLoading.recentActivities)

    // Check for errors in required data
    const hasErrors =
      userData.error.profile ||
      userData.error.safetyStats ||
      (includeCourses && userData.error.safetyCourses) ||
      (includeActivities && userData.error.recentActivities)

    // Update loading state
    setIsLoading(stillLoading)

    // Set error if any
    if (hasErrors) {
      const firstError =
        userData.error.profile ||
        userData.error.safetyStats ||
        userData.error.safetyCourses ||
        userData.error.recentActivities

      if (firstError) {
        setError(firstError)
      }
    } else {
      setError(null)
    }

    // If we have minimum data, create profile data object
    if (hasMinimumData) {
      const transformedData: ProfileData = {
        profile: userData.profile!,
        safetyStats: userData.safetyStats!,
        safetyCourses: userData.safetyCourses || [],
        recentActivities: userData.recentActivities || [],
      }

      logWithTimestamp("USE-PROFILE-DATA", "Profile data fetched successfully", { transformedData })
      setProfileData(transformedData)
    }
  }, [userData, isAuthenticated, isInitialized, includeCourses, includeActivities])

  return { profileData, isLoading, error }
}


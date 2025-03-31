"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { logWithTimestamp } from "@/lib/utils/debug-utils"
import type { Profile } from "@/types/profile"
import type { SafetyStats } from "@/types/safety-stats"
import type { SafetyCourse } from "@/types/safety-course"
import type { UserActivity } from "@/types/user-activity"
import { supabase } from "@/lib/supabase/client"

// Define the shape of our context data
export interface UserDataState {
  profile: Profile | null
  safetyStats: SafetyStats | null
  safetyCourses: SafetyCourse[] | null
  recentActivities: UserActivity[] | null
  lastFetched: {
    profile: number | null
    safetyStats: number | null
    safetyCourses: number | null
    recentActivities: number | null
  }
  isLoading: {
    profile: boolean
    safetyStats: boolean
    safetyCourses: boolean
    recentActivities: boolean
  }
  error: {
    profile: Error | null
    safetyStats: Error | null
    safetyCourses: Error | null
    recentActivities: Error | null
  }
}

// Define the context API
interface UserDataContextType {
  userData: UserDataState
  refreshUserData: (options?: {
    force?: boolean
    includeCourses?: boolean
    includeActivities?: boolean
  }) => Promise<void>
  clearUserData: () => void
  isAuthenticated: boolean
  isInitialized: boolean
}

// Create the context with a default value
const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000

// Initial state
const initialState: UserDataState = {
  profile: null,
  safetyStats: null,
  safetyCourses: null,
  recentActivities: null,
  lastFetched: {
    profile: null,
    safetyStats: null,
    safetyCourses: null,
    recentActivities: null,
  },
  isLoading: {
    profile: false,
    safetyStats: false,
    safetyCourses: false,
    recentActivities: false,
  },
  error: {
    profile: null,
    safetyStats: null,
    safetyCourses: null,
    recentActivities: null,
  },
}

// Provider props
interface UserDataProviderProps {
  children: ReactNode
}

export function UserDataProvider({ children }: UserDataProviderProps) {
  const [userData, setUserData] = useState<UserDataState>(initialState)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Check authentication status on mount
  useEffect(() => {
    logWithTimestamp("USER-DATA-CONTEXT", "Initializing UserDataProvider")

    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const isAuthed = !!session?.user
        setIsAuthenticated(isAuthed)
        setUserId(session?.user?.id || null)
        setIsInitialized(true)

        logWithTimestamp("USER-DATA-CONTEXT", "Auth check complete", {
          isAuthenticated: isAuthed,
          userId: session?.user?.id || null,
        })
      } catch (error) {
        logWithTimestamp("USER-DATA-CONTEXT", "Error checking auth", { error })
        setIsAuthenticated(false)
        setUserId(null)
        setIsInitialized(true)
      }
    }

    checkAuth()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      logWithTimestamp("USER-DATA-CONTEXT", "Auth state changed", { event })

      const isAuthed = !!session?.user
      setIsAuthenticated(isAuthed)
      setUserId(session?.user?.id || null)

      if (event === "SIGNED_OUT") {
        clearUserData()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Clear user data (used on logout)
  const clearUserData = useCallback(() => {
    logWithTimestamp("USER-DATA-CONTEXT", "Clearing user data")
    setUserData(initialState)
  }, [])

  // Function to check if cache is valid
  const isCacheValid = useCallback((lastFetched: number | null): boolean => {
    if (!lastFetched) return false
    return Date.now() - lastFetched < CACHE_EXPIRATION
  }, [])

  // Refresh user data with options for selective fetching
  const refreshUserData = useCallback(
    async (options?: {
      force?: boolean
      includeCourses?: boolean
      includeActivities?: boolean
    }) => {
      if (!isAuthenticated || !userId) {
        logWithTimestamp("USER-DATA-CONTEXT", "Cannot refresh data - not authenticated")
        return
      }

      const force = options?.force || false
      const includeCourses = options?.includeCourses !== false // Default to true
      const includeActivities = options?.includeActivities !== false // Default to true

      logWithTimestamp("USER-DATA-CONTEXT", "Refreshing user data", {
        force,
        includeCourses,
        includeActivities,
        userId,
      })

      // Fetch profile if needed
      if (force || !isCacheValid(userData.lastFetched.profile)) {
        logWithTimestamp("USER-DATA-CONTEXT", "Fetching profile data")

        setUserData((prev) => ({
          ...prev,
          isLoading: { ...prev.isLoading, profile: true },
          error: { ...prev.error, profile: null },
        }))

        try {
          const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

          if (error) throw error

          logWithTimestamp("USER-DATA-CONTEXT", "Profile data fetched successfully")

          setUserData((prev) => ({
            ...prev,
            profile,
            lastFetched: { ...prev.lastFetched, profile: Date.now() },
            isLoading: { ...prev.isLoading, profile: false },
          }))
        } catch (error) {
          logWithTimestamp("USER-DATA-CONTEXT", "Error fetching profile", { error })

          setUserData((prev) => ({
            ...prev,
            error: { ...prev.error, profile: error as Error },
            isLoading: { ...prev.isLoading, profile: false },
          }))
        }
      }

      // Fetch safety stats if needed
      if (force || !isCacheValid(userData.lastFetched.safetyStats)) {
        logWithTimestamp("USER-DATA-CONTEXT", "Calculating safety stats")

        setUserData((prev) => ({
          ...prev,
          isLoading: { ...prev.isLoading, safetyStats: true },
          error: { ...prev.error, safetyStats: null },
        }))

        try {
          // Calculate days since last incident
          const { data: incidents, error: incidentsError } = await supabase
            .from("safety_incidents")
            .select("created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)

          if (incidentsError) throw incidentsError

          let daysSafe = 0

          if (incidents && incidents.length > 0) {
            const lastIncidentDate = new Date(incidents[0].created_at)
            const today = new Date()
            const diffTime = Math.abs(today.getTime() - lastIncidentDate.getTime())
            daysSafe = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            logWithTimestamp("USER-DATA-CONTEXT", `Days since last incident: ${daysSafe}`)
          } else {
            // If no incidents, get user creation date
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("created_at")
              .eq("id", userId)
              .single()

            if (profileError) throw profileError

            if (profile) {
              const creationDate = new Date(profile.created_at)
              const today = new Date()
              const diffTime = Math.abs(today.getTime() - creationDate.getTime())
              daysSafe = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

              logWithTimestamp("USER-DATA-CONTEXT", `No incidents found. Days since account creation: ${daysSafe}`)
            } else {
              daysSafe = 1
              logWithTimestamp("USER-DATA-CONTEXT", "Could not determine days safe, defaulting to 1")
            }
          }

          // Count completed courses
          const { data: courses, error: coursesError } = await supabase
            .from("safety_courses")
            .select("id, status")
            .eq("user_id", userId)

          if (coursesError) throw coursesError

          const completedCoursesCount = courses?.filter((c) => c.status === "completed").length || 0

          // Get check-ins count
          const { count: checkInsCount, error: checkInsError } = await supabase
            .from("user_activities")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("activity_type", "check_in")

          if (checkInsError) throw checkInsError

          // Get trusted contacts count
          const { count: contactsCount, error: contactsError } = await supabase
            .from("trusted_contacts")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId)

          if (contactsError) throw contactsError

          // Calculate safety level (1-10 based on various factors)
          const safetyLevel = Math.min(
            10,
            Math.max(
              1,
              Math.floor(
                daysSafe / 30 + // 1 level per month of safety
                  completedCoursesCount / 2 + // 0.5 levels per completed course
                  checkInsCount / 10 + // 0.1 levels per check-in
                  1, // Base level
              ),
            ),
          )

          const safetyStats: SafetyStats = {
            daysSafe,
            safetyLevel,
            completedCoursesCount,
            checkInsCount: checkInsCount || 0,
            contactsCount: contactsCount || 0,
          }

          logWithTimestamp("USER-DATA-CONTEXT", "Safety stats calculated", { stats: safetyStats })

          setUserData((prev) => ({
            ...prev,
            safetyStats,
            lastFetched: { ...prev.lastFetched, safetyStats: Date.now() },
            isLoading: { ...prev.isLoading, safetyStats: false },
          }))
        } catch (error) {
          logWithTimestamp("USER-DATA-CONTEXT", "Error calculating safety stats", { error })

          setUserData((prev) => ({
            ...prev,
            error: { ...prev.error, safetyStats: error as Error },
            isLoading: { ...prev.isLoading, safetyStats: false },
          }))
        }
      }

      // Fetch safety courses if needed and requested
      if (includeCourses && (force || !isCacheValid(userData.lastFetched.safetyCourses))) {
        logWithTimestamp("USER-DATA-CONTEXT", "Fetching safety courses")

        setUserData((prev) => ({
          ...prev,
          isLoading: { ...prev.isLoading, safetyCourses: true },
          error: { ...prev.error, safetyCourses: null },
        }))

        try {
          const { data: courses, error } = await supabase.from("safety_courses").select("*").eq("user_id", userId)

          if (error) throw error

          logWithTimestamp("USER-DATA-CONTEXT", `Fetched ${courses?.length || 0} courses`)

          setUserData((prev) => ({
            ...prev,
            safetyCourses: courses || [],
            lastFetched: { ...prev.lastFetched, safetyCourses: Date.now() },
            isLoading: { ...prev.isLoading, safetyCourses: false },
          }))
        } catch (error) {
          logWithTimestamp("USER-DATA-CONTEXT", "Error fetching safety courses", { error })

          setUserData((prev) => ({
            ...prev,
            error: { ...prev.error, safetyCourses: error as Error },
            isLoading: { ...prev.isLoading, safetyCourses: false },
          }))
        }
      } else if (!includeCourses) {
        logWithTimestamp("USER-DATA-CONTEXT", "Skipping safety courses fetch (not requested)")
      }

      // Fetch recent activities if needed and requested
      if (includeActivities && (force || !isCacheValid(userData.lastFetched.recentActivities))) {
        logWithTimestamp("USER-DATA-CONTEXT", "Fetching recent activities")

        setUserData((prev) => ({
          ...prev,
          isLoading: { ...prev.isLoading, recentActivities: true },
          error: { ...prev.error, recentActivities: null },
        }))

        try {
          const { data: activities, error } = await supabase
            .from("user_activities")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(5)

          if (error) throw error

          logWithTimestamp("USER-DATA-CONTEXT", `Fetched ${activities?.length || 0} activities`)

          setUserData((prev) => ({
            ...prev,
            recentActivities: activities || [],
            lastFetched: { ...prev.lastFetched, recentActivities: Date.now() },
            isLoading: { ...prev.isLoading, recentActivities: false },
          }))
        } catch (error) {
          logWithTimestamp("USER-DATA-CONTEXT", "Error fetching recent activities", { error })

          setUserData((prev) => ({
            ...prev,
            error: { ...prev.error, recentActivities: error as Error },
            isLoading: { ...prev.isLoading, recentActivities: false },
          }))
        }
      } else if (!includeActivities) {
        logWithTimestamp("USER-DATA-CONTEXT", "Skipping recent activities fetch (not requested)")
      }
    },
    [isAuthenticated, userId, userData.lastFetched, isCacheValid],
  )

  // Fetch initial data when authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      refreshUserData()
    }
  }, [isAuthenticated, userId, refreshUserData])

  // Provide the context value
  const contextValue: UserDataContextType = {
    userData,
    refreshUserData,
    clearUserData,
    isAuthenticated,
    isInitialized,
  }

  return <UserDataContext.Provider value={contextValue}>{children}</UserDataContext.Provider>
}

// Custom hook to use the context
export function useUserData() {
  const context = useContext(UserDataContext)

  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider")
  }

  return context
}


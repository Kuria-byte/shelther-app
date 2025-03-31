import { supabase } from "@/lib/supabase/client"
import type { UserActivity } from "@/types/user-activity"
import { logWithTimestamp } from "@/lib/utils/debug-utils"

/**
 * Logs a new user activity
 *
 * @param activity - The activity to log
 * @returns The created activity or null if creation failed
 */
export async function logUserActivity(activity: Omit<UserActivity, "id" | "created_at">): Promise<UserActivity | null> {
  logWithTimestamp("USER-ACTIVITY-REPO", "Logging new activity", { activity })

  try {
    const { data, error } = await supabase.from("user_activity_log").insert(activity).select().single()

    if (error) {
      logWithTimestamp("USER-ACTIVITY-REPO", "Error logging activity", { error })
      throw error
    }

    logWithTimestamp("USER-ACTIVITY-REPO", "Activity logged successfully", { data })
    return data
  } catch (error) {
    logWithTimestamp("USER-ACTIVITY-REPO", "Exception in logUserActivity", { error })
    console.error("Error logging user activity:", error)
    return null
  }
}

/**
 * Fetches recent user activities
 *
 * @param userId - The user ID to fetch activities for
 * @param limit - Maximum number of activities to return
 * @returns Array of user activities or empty array if none found
 */
export async function getRecentUserActivities(userId: string, limit = 5): Promise<UserActivity[]> {
  logWithTimestamp("USER-ACTIVITY-REPO", `Fetching recent activities for user: ${userId}, limit: ${limit}`)

  try {
    const { data, error } = await supabase
      .from("user_activity_log")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      logWithTimestamp("USER-ACTIVITY-REPO", "Error fetching activities", { error })
      throw error
    }

    logWithTimestamp("USER-ACTIVITY-REPO", `Fetched ${data?.length || 0} activities`)
    return data || []
  } catch (error) {
    logWithTimestamp("USER-ACTIVITY-REPO", "Exception in getRecentUserActivities", { error })
    console.error("Error fetching recent user activities:", error)
    return []
  }
}


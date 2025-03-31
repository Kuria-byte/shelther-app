import { getUserSafetyCourses } from "@/lib/repositories/safety-course-repository"
import { getDaysSinceSafetyIncident } from "@/lib/repositories/safety-incident-repository"
import { getEmergencyContacts } from "@/lib/repositories/emergency-contact-repository"
import { getCheckIns } from "@/lib/repositories/check-in-repository"
import type { SafetyStats } from "@/types/safety-stats"
import { logWithTimestamp } from "@/lib/utils/debug-utils"

/**
 * Calculates comprehensive safety stats for a user
 *
 * @param userId - The user ID to calculate stats for
 * @returns Safety stats object
 */
export async function calculateUserSafetyStats(userId: string): Promise<SafetyStats> {
  logWithTimestamp("SAFETY-STATS", `Calculating safety stats for user: ${userId}`)

  try {
    // Fetch all required data in parallel
    const [courses, daysSafe, contacts, checkIns] = await Promise.all([
      getUserSafetyCourses(userId),
      getDaysSinceSafetyIncident(userId),
      getEmergencyContacts(userId),
      getCheckIns(userId),
    ])

    // Calculate stats
    const completedCoursesCount = courses.filter((course) => course.status === "completed").length
    const safetyLevel = calculateSafetyLevel(completedCoursesCount, contacts.length, checkIns.length)

    const stats = {
      daysSafe,
      checkInsCount: checkIns.length,
      coursesCount: courses.length,
      completedCoursesCount,
      contactsCount: contacts.length,
      safetyLevel,
    }

    logWithTimestamp("SAFETY-STATS", "Safety stats calculated", { stats })
    return stats
  } catch (error) {
    logWithTimestamp("SAFETY-STATS", "Error calculating safety stats", { error })
    console.error("Error calculating user safety stats:", error)

    // Return default stats if calculation fails
    return {
      daysSafe: 0,
      checkInsCount: 0,
      coursesCount: 0,
      completedCoursesCount: 0,
      contactsCount: 0,
      safetyLevel: 1,
    }
  }
}

/**
 * Calculates a user's safety level based on various factors
 *
 * @param completedCourses - Number of completed safety courses
 * @param contactsCount - Number of emergency contacts
 * @param checkInsCount - Number of check-ins
 * @returns Safety level (1-5)
 */
function calculateSafetyLevel(completedCourses: number, contactsCount: number, checkInsCount: number): number {
  // Simple algorithm - can be refined later
  let points = 0

  // Points for completed courses (0-3 points)
  points += Math.min(completedCourses, 3)

  // Points for emergency contacts (0-1 points)
  points += contactsCount > 0 ? 1 : 0

  // Points for check-ins (0-1 points)
  points += checkInsCount > 5 ? 1 : 0

  // Convert points to level (1-5)
  return Math.max(1, Math.min(5, points))
}


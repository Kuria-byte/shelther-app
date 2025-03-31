import { supabase } from "@/lib/supabase/client"
import type { SafetyCourse, CourseStatus } from "@/types/safety-course"
import { logWithTimestamp } from "@/lib/utils/debug-utils"

/**
 * Fetches all safety courses for a user
 *
 * @param userId - The user ID to fetch courses for
 * @returns Array of safety courses or empty array if none found
 */
export async function getUserSafetyCourses(userId: string): Promise<SafetyCourse[]> {
  logWithTimestamp("SAFETY-COURSE-REPO", `Fetching courses for user: ${userId}`)

  try {
    const { data, error } = await supabase
      .from("safety_courses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    if (error) {
      logWithTimestamp("SAFETY-COURSE-REPO", "Error fetching courses", { error })
      throw error
    }

    logWithTimestamp("SAFETY-COURSE-REPO", `Fetched ${data?.length || 0} courses`)
    return data || []
  } catch (error) {
    logWithTimestamp("SAFETY-COURSE-REPO", "Exception in getUserSafetyCourses", { error })
    console.error("Error fetching user safety courses:", error)
    return []
  }
}

/**
 * Updates the status and progress of a safety course
 *
 * @param courseId - The ID of the course to update
 * @param status - The new status
 * @param progress - The new progress percentage (0-100)
 * @returns The updated course or null if update failed
 */
export async function updateCourseProgress(
  courseId: string,
  status: CourseStatus,
  progress: number,
): Promise<SafetyCourse | null> {
  logWithTimestamp("SAFETY-COURSE-REPO", `Updating course ${courseId}`, { status, progress })

  try {
    const updates: Partial<SafetyCourse> = {
      status,
      progress,
      updated_at: new Date().toISOString(),
    }

    // If course is completed, set completed_at
    if (status === "completed") {
      updates.completed_at = new Date().toISOString()
    }

    // If course is started for the first time, set started_at
    if (status === "in_progress") {
      const { data: existingCourse } = await supabase
        .from("safety_courses")
        .select("started_at")
        .eq("id", courseId)
        .single()

      if (!existingCourse?.started_at) {
        updates.started_at = new Date().toISOString()
      }
    }

    const { data, error } = await supabase.from("safety_courses").update(updates).eq("id", courseId).select().single()

    if (error) {
      logWithTimestamp("SAFETY-COURSE-REPO", "Error updating course", { error })
      throw error
    }

    logWithTimestamp("SAFETY-COURSE-REPO", "Course updated successfully", { data })
    return data
  } catch (error) {
    logWithTimestamp("SAFETY-COURSE-REPO", "Exception in updateCourseProgress", { error })
    console.error("Error updating course progress:", error)
    return null
  }
}

/**
 * Creates default safety courses for a new user
 *
 * @param userId - The user ID to create courses for
 * @returns Array of created courses or empty array if creation failed
 */
export async function createDefaultCoursesForUser(userId: string): Promise<SafetyCourse[]> {
  logWithTimestamp("SAFETY-COURSE-REPO", `Creating default courses for user: ${userId}`)

  try {
    const defaultCourses = [
      {
        user_id: userId,
        course_id: "personal-safety-fundamentals",
        course_name: "Personal Safety Fundamentals",
        status: "not_started" as CourseStatus,
        progress: 0,
      },
      {
        user_id: userId,
        course_id: "urban-navigation-awareness",
        course_name: "Urban Navigation & Awareness",
        status: "not_started" as CourseStatus,
        progress: 0,
      },
      {
        user_id: userId,
        course_id: "travel-safety-essentials",
        course_name: "Travel Safety Essentials",
        status: "not_started" as CourseStatus,
        progress: 0,
      },
    ]

    const { data, error } = await supabase.from("safety_courses").insert(defaultCourses).select()

    if (error) {
      logWithTimestamp("SAFETY-COURSE-REPO", "Error creating default courses", { error })
      throw error
    }

    logWithTimestamp("SAFETY-COURSE-REPO", `Created ${data?.length || 0} default courses`)
    return data || []
  } catch (error) {
    logWithTimestamp("SAFETY-COURSE-REPO", "Exception in createDefaultCoursesForUser", { error })
    console.error("Error creating default courses for user:", error)
    return []
  }
}


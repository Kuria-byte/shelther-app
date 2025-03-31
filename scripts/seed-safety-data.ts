import { supabase } from "@/lib/supabase/client"
import { logWithTimestamp } from "@/lib/utils/debug-utils"

async function seedSafetyData() {
  logWithTimestamp("SEED-SCRIPT", "Starting safety data seeding")

  try {
    // Get all users
    const { data: users, error: usersError } = await supabase.from("profiles").select("id")

    if (usersError) throw usersError
    if (!users || users.length === 0) {
      logWithTimestamp("SEED-SCRIPT", "No users found to seed data for")
      return
    }

    logWithTimestamp("SEED-SCRIPT", `Found ${users.length} users to seed data for`)

    // For each user, seed safety courses with random progress
    for (const user of users) {
      logWithTimestamp("SEED-SCRIPT", `Seeding data for user: ${user.id}`)

      // Update course progress randomly
      await updateRandomCourseProgress(user.id)

      // Add some random activities
      await addRandomActivities(user.id)

      // Maybe add a safety incident
      if (Math.random() > 0.7) {
        await addRandomSafetyIncident(user.id)
      }
    }

    logWithTimestamp("SEED-SCRIPT", "Safety data seeded successfully")
  } catch (error) {
    logWithTimestamp("SEED-SCRIPT", "Error seeding safety data", { error })
    console.error("Error seeding safety data:", error)
  }
}

async function updateRandomCourseProgress(userId: string) {
  try {
    // Get courses for user
    const { data: courses, error } = await supabase.from("safety_courses").select("id, course_id").eq("user_id", userId)

    if (error) throw error
    if (!courses || courses.length === 0) {
      logWithTimestamp("SEED-SCRIPT", `No courses found for user: ${userId}`)
      return
    }

    logWithTimestamp("SEED-SCRIPT", `Updating ${courses.length} courses for user: ${userId}`)

    // Update each course with random progress
    for (const course of courses) {
      const rand = Math.random()
      let status, progress

      if (rand < 0.3) {
        // Not started
        status = "not_started"
        progress = 0
      } else if (rand < 0.7) {
        // In progress
        status = "in_progress"
        progress = Math.floor(Math.random() * 100)
      } else {
        // Completed
        status = "completed"
        progress = 100
      }

      await supabase
        .from("safety_courses")
        .update({
          status,
          progress,
          started_at: status !== "not_started" ? new Date().toISOString() : null,
          completed_at: status === "completed" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", course.id)
    }
  } catch (error) {
    logWithTimestamp("SEED-SCRIPT", "Error updating random course progress", { error })
    console.error("Error updating random course progress:", error)
  }
}

async function addRandomActivities(userId: string) {
  try {
    const activities = [
      {
        activity_type: "check_in",
        title: "Checked in as safe",
        location: "Home",
        color: "green",
      },
      {
        activity_type: "journey",
        title: "Completed journey safely",
        description: "From Work to Home",
        color: "purple",
      },
      {
        activity_type: "contact",
        title: "Added new emergency contact",
        description: "Michael Chen",
        color: "blue",
      },
      {
        activity_type: "mode",
        title: "Activated cautious mode",
        location: "Downtown",
        color: "amber",
      },
      {
        activity_type: "course",
        title: "Completed safety course module",
        description: "Situational Awareness",
        color: "teal",
      },
    ]

    // Add 3-5 random activities
    const count = 3 + Math.floor(Math.random() * 3)
    const activityPromises = []

    logWithTimestamp("SEED-SCRIPT", `Adding ${count} random activities for user: ${userId}`)

    for (let i = 0; i < count; i++) {
      const activity = activities[Math.floor(Math.random() * activities.length)]
      const daysAgo = Math.floor(Math.random() * 14) // Random day in the last 2 weeks
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)

      activityPromises.push(
        supabase.from("user_activity_log").insert({
          user_id: userId,
          ...activity,
          created_at: date.toISOString(),
        }),
      )
    }

    await Promise.all(activityPromises)
  } catch (error) {
    logWithTimestamp("SEED-SCRIPT", "Error adding random activities", { error })
    console.error("Error adding random activities:", error)
  }
}

async function addRandomSafetyIncident(userId: string) {
  try {
    const incidentTypes = ["emergency", "cautious", "timer_expired", "journey_delayed"]
    const type = incidentTypes[Math.floor(Math.random() * incidentTypes.length)]

    const daysAgo = Math.floor(Math.random() * 30) // Random day in the last month
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    logWithTimestamp("SEED-SCRIPT", `Adding random safety incident for user: ${userId}`, { type, daysAgo })

    await supabase.from("safety_incidents").insert({
      user_id: userId,
      incident_type: type,
      description: `Random ${type} incident for testing`,
      location: "Test Location",
      resolved: Math.random() > 0.3, // 70% chance of being resolved
      resolved_at: Math.random() > 0.3 ? new Date().toISOString() : null,
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
    })
  } catch (error) {
    logWithTimestamp("SEED-SCRIPT", "Error adding random safety incident", { error })
    console.error("Error adding random safety incident:", error)
  }
}

// Export the seed function so it can be run from a command
export { seedSafetyData }


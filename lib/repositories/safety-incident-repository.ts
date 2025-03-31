import { supabase } from "@/lib/supabase/client"
import type { SafetyIncident } from "@/types/safety-incident"
import { logWithTimestamp } from "@/lib/utils/debug-utils"

/**
 * Records a new safety incident
 *
 * @param incident - The incident to record
 * @returns The created incident or null if creation failed
 */
export async function recordSafetyIncident(
  incident: Omit<SafetyIncident, "id" | "created_at" | "updated_at">,
): Promise<SafetyIncident | null> {
  logWithTimestamp("SAFETY-INCIDENT-REPO", "Recording new incident", { incident })

  try {
    const { data, error } = await supabase.from("safety_incidents").insert(incident).select().single()

    if (error) {
      logWithTimestamp("SAFETY-INCIDENT-REPO", "Error recording incident", { error })
      throw error
    }

    logWithTimestamp("SAFETY-INCIDENT-REPO", "Incident recorded successfully", { data })
    return data
  } catch (error) {
    logWithTimestamp("SAFETY-INCIDENT-REPO", "Exception in recordSafetyIncident", { error })
    console.error("Error recording safety incident:", error)
    return null
  }
}

/**
 * Resolves a safety incident
 *
 * @param incidentId - The ID of the incident to resolve
 * @returns The updated incident or null if update failed
 */
export async function resolveSafetyIncident(incidentId: string): Promise<SafetyIncident | null> {
  logWithTimestamp("SAFETY-INCIDENT-REPO", `Resolving incident: ${incidentId}`)

  try {
    const { data, error } = await supabase
      .from("safety_incidents")
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", incidentId)
      .select()
      .single()

    if (error) {
      logWithTimestamp("SAFETY-INCIDENT-REPO", "Error resolving incident", { error })
      throw error
    }

    logWithTimestamp("SAFETY-INCIDENT-REPO", "Incident resolved successfully", { data })
    return data
  } catch (error) {
    logWithTimestamp("SAFETY-INCIDENT-REPO", "Exception in resolveSafetyIncident", { error })
    console.error("Error resolving safety incident:", error)
    return null
  }
}

/**
 * Calculates the number of days since the last safety incident
 *
 * @param userId - The user ID to calculate for
 * @returns Number of days since last incident, or days since account creation if no incidents
 */
export async function getDaysSinceSafetyIncident(userId: string): Promise<number> {
  logWithTimestamp("SAFETY-INCIDENT-REPO", `Calculating days since incident for user: ${userId}`)

  try {
    // Get the most recent incident
    const { data: incidents, error } = await supabase
      .from("safety_incidents")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      logWithTimestamp("SAFETY-INCIDENT-REPO", "Error fetching incidents", { error })
      throw error
    }

    if (incidents && incidents.length > 0) {
      // Calculate days since last incident
      const lastIncidentDate = new Date(incidents[0].created_at)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - lastIncidentDate.getTime())
      const daysSince = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      logWithTimestamp("SAFETY-INCIDENT-REPO", `Days since last incident: ${daysSince}`)
      return daysSince
    } else {
      // If no incidents, get user creation date
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("id", userId)
        .single()

      if (profileError) {
        logWithTimestamp("SAFETY-INCIDENT-REPO", "Error fetching profile", { error: profileError })
        throw profileError
      }

      if (profile) {
        const creationDate = new Date(profile.created_at)
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - creationDate.getTime())
        const daysSince = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        logWithTimestamp("SAFETY-INCIDENT-REPO", `No incidents found. Days since account creation: ${daysSince}`)
        return daysSince
      }

      // Default to 1 if we can't determine
      logWithTimestamp("SAFETY-INCIDENT-REPO", "Could not determine days safe, defaulting to 1")
      return 1
    }
  } catch (error) {
    logWithTimestamp("SAFETY-INCIDENT-REPO", "Exception in getDaysSinceSafetyIncident", { error })
    console.error("Error calculating days since safety incident:", error)
    return 0
  }
}


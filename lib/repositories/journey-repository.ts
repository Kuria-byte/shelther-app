import { supabase } from "@/lib/supabase/client"
import type { Journey, JourneyLocation } from "@/types/safety"

export async function createJourney(
  journey: Omit<Journey, "id" | "created_at" | "updated_at">,
): Promise<Journey | null> {
  try {
    const { data, error } = await supabase.from("journeys").insert(journey).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating journey:", error)
    return null
  }
}

export async function getJourney(journeyId: string): Promise<Journey | null> {
  try {
    const { data, error } = await supabase.from("journeys").select("*").eq("id", journeyId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching journey:", error)
    return null
  }
}

export async function getUserJourneys(userId: string, limit = 10): Promise<Journey[]> {
  try {
    const { data, error } = await supabase
      .from("journeys")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching user journeys:", error)
    return []
  }
}

export async function updateJourneyStatus(
  journeyId: string,
  status: Journey["status"],
  completedAt?: string,
): Promise<Journey | null> {
  try {
    const updateData: Partial<Journey> = { status }

    if (completedAt) {
      updateData.completed_at = completedAt
    }

    const { data, error } = await supabase.from("journeys").update(updateData).eq("id", journeyId).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating journey status:", error)
    return null
  }
}

export async function addJourneyLocation(
  journeyLocation: Omit<JourneyLocation, "id" | "created_at">,
): Promise<JourneyLocation | null> {
  try {
    const { data, error } = await supabase.from("journey_locations").insert(journeyLocation).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error adding journey location:", error)
    return null
  }
}

export async function getJourneyLocations(journeyId: string): Promise<JourneyLocation[]> {
  try {
    const { data, error } = await supabase
      .from("journey_locations")
      .select("*")
      .eq("journey_id", journeyId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching journey locations:", error)
    return []
  }
}

export async function deleteJourney(journeyId: string): Promise<boolean> {
  try {
    // First delete all associated locations
    const { error: locationsError } = await supabase.from("journey_locations").delete().eq("journey_id", journeyId)

    if (locationsError) throw locationsError

    // Then delete the journey
    const { error } = await supabase.from("journeys").delete().eq("id", journeyId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting journey:", error)
    return false
  }
}


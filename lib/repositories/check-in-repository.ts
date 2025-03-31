import { supabase } from "@/lib/supabase/client"
import type { CheckIn } from "@/types/safety"

export async function createCheckIn(checkIn: Omit<CheckIn, "id" | "created_at">): Promise<CheckIn | null> {
  try {
    const { data, error } = await supabase.from("check_ins").insert(checkIn).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating check-in:", error)
    return null
  }
}

export async function getCheckIns(userId: string, limit = 10): Promise<CheckIn[]> {
  try {
    const { data, error } = await supabase
      .from("check_ins")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching user check-ins:", error)
    return []
  }
}

export async function getCheckIn(checkInId: string): Promise<CheckIn | null> {
  try {
    const { data, error } = await supabase.from("check_ins").select("*").eq("id", checkInId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching check-in:", error)
    return null
  }
}

export async function deleteCheckIn(checkInId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("check_ins").delete().eq("id", checkInId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting check-in:", error)
    return false
  }
}


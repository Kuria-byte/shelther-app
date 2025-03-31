import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

type ProfileUpdateData = {
  full_name?: string
  avatar_url?: string
  onboarding_completed?: boolean
  phone?: string
  address?: string
  emergency_contacts_added?: boolean
  location_services_enabled?: boolean
}

export async function updateProfile(data: ProfileUpdateData) {
  const supabase = createClientComponentClient<Database>()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { error } = await supabase.from("profiles").update(data).eq("id", user.id)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error }
  }
}

export async function getProfile() {
  const supabase = createClientComponentClient<Database>()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}


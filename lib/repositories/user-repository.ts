import { supabase } from "@/lib/supabase/client"
import type { UserProfile, EmergencyContact } from "@/types/user"

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>,
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase.from("profiles").update(profileData).eq("id", userId).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating user profile:", error)
    return null
  }
}

export async function getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
  try {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", userId)
      .order("priority", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching emergency contacts:", error)
    return []
  }
}

export async function addEmergencyContact(
  userId: string,
  contact: Omit<EmergencyContact, "id" | "created_at" | "updated_at">,
): Promise<EmergencyContact | null> {
  try {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .insert({ ...contact, user_id: userId })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error adding emergency contact:", error)
    return null
  }
}

export async function updateEmergencyContact(
  contactId: string,
  contact: Partial<EmergencyContact>,
): Promise<EmergencyContact | null> {
  try {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .update(contact)
      .eq("id", contactId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating emergency contact:", error)
    return null
  }
}

export async function deleteEmergencyContact(contactId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", contactId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting emergency contact:", error)
    return false
  }
}


import { supabase } from "@/lib/supabase/client"
import type { EmergencyContact } from "@/types/user"

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

export async function getEmergencyContact(contactId: string): Promise<EmergencyContact | null> {
  try {
    const { data, error } = await supabase.from("emergency_contacts").select("*").eq("id", contactId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching emergency contact:", error)
    return null
  }
}

export async function createEmergencyContact(
  userId: string,
  contact: Omit<EmergencyContact, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<EmergencyContact | null> {
  try {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .insert({
        user_id: userId,
        name: contact.name,
        relationship: contact.relationship,
        phone_number: contact.phone_number,
        email: contact.email,
        priority: contact.priority,
        notify_on_emergency: contact.notify_on_emergency,
        notify_on_check_in: contact.notify_on_check_in,
        notify_on_journey: contact.notify_on_journey,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating emergency contact:", error)
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


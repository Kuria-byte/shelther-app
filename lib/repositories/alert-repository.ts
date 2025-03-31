import { supabase } from "@/lib/supabase/client"
import type { Alert, AlertNotification } from "@/types/safety"
import { uploadFile } from "@/lib/storage/storage-utils"

const ALERT_MEDIA_BUCKET = "alert-media"

export async function createAlert(alert: Omit<Alert, "id" | "created_at" | "updated_at">): Promise<Alert | null> {
  try {
    const { data, error } = await supabase.from("alerts").insert(alert).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating alert:", error)
    return null
  }
}

export async function getAlert(alertId: string): Promise<Alert | null> {
  try {
    const { data, error } = await supabase.from("alerts").select("*").eq("id", alertId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching alert:", error)
    return null
  }
}

export async function getUserAlerts(userId: string, limit = 10): Promise<Alert[]> {
  try {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching user alerts:", error)
    return []
  }
}

export async function updateAlertStatus(
  alertId: string,
  status: Alert["status"],
  resolvedAt?: string,
): Promise<Alert | null> {
  try {
    const updateData: Partial<Alert> = { status }

    if (resolvedAt) {
      updateData.resolved_at = resolvedAt
    }

    const { data, error } = await supabase.from("alerts").update(updateData).eq("id", alertId).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating alert status:", error)
    return null
  }
}

export async function uploadAlertMedia(
  alertId: string,
  mediaFile: File,
  mediaType: "audio" | "image" | "video",
): Promise<string | null> {
  try {
    // Upload the media file to storage
    const mediaUrl = await uploadFile(mediaFile, ALERT_MEDIA_BUCKET, `${alertId}/${mediaType}`)

    if (!mediaUrl) throw new Error("Failed to upload media")

    // Update the alert with the new media URL
    const { data, error } = await supabase
      .from("alerts")
      .update({
        [`${mediaType}_url`]: mediaUrl,
      })
      .eq("id", alertId)
      .select()
      .single()

    if (error) throw error

    return mediaUrl
  } catch (error) {
    console.error(`Error uploading alert ${mediaType}:`, error)
    return null
  }
}

export async function createAlertNotification(
  notification: Omit<AlertNotification, "id" | "created_at">,
): Promise<AlertNotification | null> {
  try {
    const { data, error } = await supabase.from("alert_notifications").insert(notification).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating alert notification:", error)
    return null
  }
}

export async function getAlertNotifications(alertId: string): Promise<AlertNotification[]> {
  try {
    const { data, error } = await supabase
      .from("alert_notifications")
      .select("*")
      .eq("alert_id", alertId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching alert notifications:", error)
    return []
  }
}


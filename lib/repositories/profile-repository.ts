import { supabase } from "@/lib/supabase/client"
import type { UserProfile } from "@/types/user"
import { uploadFile, deleteFile } from "@/lib/storage/storage-utils"

const PROFILE_IMAGES_BUCKET = "profile-images"

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

export async function uploadProfileImage(userId: string, imageFile: File): Promise<string | null> {
  try {
    // Upload the image to storage
    const imageUrl = await uploadFile(imageFile, PROFILE_IMAGES_BUCKET, userId)

    if (!imageUrl) throw new Error("Failed to upload image")

    // Update the user profile with the new image URL
    const { data, error } = await supabase
      .from("profiles")
      .update({ profile_image_url: imageUrl })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error

    return imageUrl
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return null
  }
}

export async function deleteProfileImage(userId: string): Promise<boolean> {
  try {
    // Get the current profile to find the image URL
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("profile_image_url")
      .eq("id", userId)
      .single()

    if (fetchError) throw fetchError

    if (!profile?.profile_image_url) return true // No image to delete

    // Delete the image from storage
    const deleted = await deleteFile(profile.profile_image_url, PROFILE_IMAGES_BUCKET)

    if (!deleted) throw new Error("Failed to delete image from storage")

    // Update the profile to remove the image URL
    const { error: updateError } = await supabase.from("profiles").update({ profile_image_url: null }).eq("id", userId)

    if (updateError) throw updateError

    return true
  } catch (error) {
    console.error("Error deleting profile image:", error)
    return false
  }
}


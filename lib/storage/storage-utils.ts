import { supabase } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param path Optional path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File, bucket: string, path = ""): Promise<string | null> {
  try {
    // Create a unique file name to prevent collisions
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = path ? `${path}/${fileName}` : fileName

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get the public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (error) {
    console.error("Error uploading file:", error)
    return null
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param filePath The full path of the file to delete
 * @param bucket The storage bucket name
 * @returns Whether the deletion was successful
 */
export async function deleteFile(filePath: string, bucket: string): Promise<boolean> {
  try {
    // Extract the file path from the URL if it's a full URL
    const path = filePath.includes("storage/v1/object/public") ? filePath.split(`${bucket}/`)[1] : filePath

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting file:", error)
    return false
  }
}

/**
 * Gets a signed URL for a private file
 * @param filePath The path of the file
 * @param bucket The storage bucket name
 * @param expiresIn Expiration time in seconds (default: 60 minutes)
 * @returns The signed URL
 */
export async function getSignedUrl(filePath: string, bucket: string, expiresIn = 3600): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filePath, expiresIn)

    if (error) throw error
    return data.signedUrl
  } catch (error) {
    console.error("Error getting signed URL:", error)
    return null
  }
}

/**
 * Lists all files in a bucket or folder
 * @param bucket The storage bucket name
 * @param path Optional path within the bucket
 * @returns Array of file objects
 */
export async function listFiles(bucket: string, path = ""): Promise<any[] | null> {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(path)

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error listing files:", error)
    return null
  }
}


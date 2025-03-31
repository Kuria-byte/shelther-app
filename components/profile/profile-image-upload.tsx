"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Camera, Loader2, X } from "lucide-react"
import { uploadProfileImage, deleteProfileImage } from "@/lib/repositories/profile-repository"
import { useAuth } from "@/contexts/auth-context"

interface ProfileImageUploadProps {
  currentImageUrl?: string | null
  onImageUploaded?: (url: string) => void
  onImageDeleted?: () => void
  size?: "sm" | "md" | "lg"
}

export function ProfileImageUpload({
  currentImageUrl,
  onImageUploaded,
  onImageDeleted,
  size = "md",
}: ProfileImageUploadProps) {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)

  // Determine size classes
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Create a preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    setIsUploading(true)
    try {
      const imageUrl = await uploadProfileImage(user.id, file)
      if (imageUrl && onImageUploaded) {
        onImageUploaded(imageUrl)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      // Revert to previous image on error
      setPreviewUrl(currentImageUrl)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!user) return

    setIsDeleting(true)
    try {
      const success = await deleteProfileImage(user.id)
      if (success) {
        setPreviewUrl(null)
        if (onImageDeleted) {
          onImageDeleted()
        }
      }
    } catch (error) {
      console.error("Error deleting image:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 relative`}>
        {previewUrl ? (
          <img src={previewUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {user?.user_metadata?.full_name ? (
              <span className="text-xl font-bold">{user.user_metadata.full_name.charAt(0).toUpperCase()}</span>
            ) : (
              <span className="text-xl font-bold">U</span>
            )}
          </div>
        )}

        {(isUploading || isDeleting) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="absolute -bottom-1 -right-1 flex space-x-1">
        <label
          htmlFor="profile-image-upload"
          className="p-1.5 bg-purple-500 rounded-full cursor-pointer text-white hover:bg-purple-600 transition-colors"
        >
          <Camera className="h-4 w-4" />
          <input
            type="file"
            id="profile-image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading || isDeleting}
          />
        </label>

        {previewUrl && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            onClick={handleDeleteImage}
            disabled={isUploading || isDeleting}
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </div>
  )
}


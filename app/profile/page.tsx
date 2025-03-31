"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Bell, Lock, MapPin, Phone, Edit2, Camera, Save, X } from "lucide-react"
import { toast } from "sonner"

import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useProfileData } from "@/hooks/use-profile-data"
import { logWithTimestamp } from "@/lib/utils/debug-utils"
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton"

export default function ProfilePage() {
  const { profileData, isLoading, error } = useProfileData()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=200&width=200")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    emergencyContact: "",
    address: "",
    birthdate: "",
    bio: "",
  })

  // Log component lifecycle
  useEffect(() => {
    logWithTimestamp("PROFILE-PAGE", "Profile page mounted")
    return () => logWithTimestamp("PROFILE-PAGE", "Profile page unmounted")
  }, [])

  // Initialize form data when profile data is loaded
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.profile.name,
        phone: profileData.profile.phone,
        email: profileData.profile.email,
        emergencyContact: profileData.profile.emergencyContact,
        address: profileData.profile.address,
        birthdate: profileData.profile.birthdate,
        bio: profileData.profile.bio,
      })
      setProfileImage(profileData.profile.profileImage)

      logWithTimestamp("PROFILE-PAGE", "Profile data loaded into form", { formData: profileData.profile })
    }
  }, [profileData])

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      logWithTimestamp("PROFILE-PAGE", "Error in profile page", { error })
      toast.error("Failed to load profile data. Please try again.")
    }
  }, [error])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // In a real app, we would save to the backend here
    logWithTimestamp("PROFILE-PAGE", "Saving profile data", { formData })

    // Show success notification
    toast.success("Profile updated successfully")
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset any unsaved changes
    if (profileData) {
      setFormData({
        name: profileData.profile.name,
        phone: profileData.profile.phone,
        email: profileData.profile.email,
        emergencyContact: profileData.profile.emergencyContact,
        address: profileData.profile.address,
        birthdate: profileData.profile.birthdate,
        bio: profileData.profile.bio,
      })
    }
    setIsEditing(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, we would upload to storage
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Show loading skeleton while data is loading
  if (isLoading) {
    return <ProfileSkeleton />
  }

  // Show error state if there's an error and no data
  if (error && !profileData) {
    return (
      <PageContainer title="My Profile">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Failed to Load Profile</h2>
          <p className="text-gray-500 mb-4">We couldn't load your profile information. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="My Profile">
      {/* Profile Header */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-teal-400 text-white shadow-lg p-6"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-8 border-white opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center">
          <div className="relative mb-4 sm:mb-0 sm:mr-6">
            <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 overflow-hidden">
              <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            {isEditing && (
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 p-1.5 bg-purple-500 rounded-full cursor-pointer"
              >
                <Camera className="h-4 w-4 text-white" />
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{formData.name}</h2>
            <p className="text-white text-opacity-90">Safety Enthusiast</p>
            <div className="flex items-center justify-center sm:justify-start mt-2">
              <div className="flex items-center mr-4">
                <Shield className="h-4 w-4 mr-1" />
                <span className="text-sm">Level {profileData?.safetyStats.safetyLevel || 1}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{formData.address.split(",").pop()?.trim() || "Location"}</span>
              </div>
            </div>
          </div>

          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-white bg-opacity-20 border-none text-white hover:bg-white hover:bg-opacity-30"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white bg-opacity-20 border-none text-white hover:bg-white hover:bg-opacity-30"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-green-500 border-none text-white hover:bg-green-600"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Profile Content */}
      <Tabs defaultValue="personal" className="mt-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="safety">Safety Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Personal Information" />

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="birthdate">Date of Birth</Label>
                    <Input
                      id="birthdate"
                      name="birthdate"
                      type="date"
                      value={formData.birthdate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Home Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="emergencyContact">Primary Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={3} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Full Name</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formData.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Phone Number</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formData.phone}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Email Address</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formData.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.birthdate ? new Date(formData.birthdate).toLocaleDateString() : "Not provided"}
                    </span>
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Home Address</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.address || "Not provided"}
                    </span>
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Primary Emergency Contact</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.emergencyContact || "Not provided"}
                    </span>
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bio</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formData.bio || "Not provided"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Account Security" />
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Password</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enabled via SMS</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Safety Preferences" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Emergency Alerts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts in emergency situations</p>
                  </div>
                </div>
                <Switch
                  id="emergency-alerts"
                  defaultChecked={profileData?.profile?.notification_preferences?.emergency}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Location Sharing</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Share location with trusted contacts</p>
                  </div>
                </div>
                <Switch id="location-sharing" defaultChecked={profileData?.profile?.location_sharing_enabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Safety Check-ins</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Periodic safety verification</p>
                  </div>
                </div>
                <Switch
                  id="safety-checkins"
                  defaultChecked={profileData?.profile?.notification_preferences?.check_in}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Safety Certifications" />
            <div className="space-y-3">
              {profileData?.safetyCourses && profileData.safetyCourses.length > 0 ? (
                profileData.safetyCourses.map((course) => {
                  let bgColor = "bg-gray-50 dark:bg-gray-700"
                  let textColor = "text-gray-800 dark:text-gray-300"
                  let statusText = "Not Started"
                  let statusColor = "text-gray-500 dark:text-gray-400"

                  if (course.status === "completed") {
                    bgColor = "bg-green-50 dark:bg-green-900/20"
                    textColor = "text-green-800 dark:text-green-300"
                    statusText = "Completed"
                    statusColor = "text-green-600 dark:text-green-400"
                  } else if (course.status === "in_progress") {
                    bgColor = "bg-yellow-50 dark:bg-yellow-900/20"
                    textColor = "text-yellow-800 dark:text-yellow-300"
                    statusText = `In Progress (${course.progress}%)`
                    statusColor = "text-yellow-600 dark:text-yellow-400"
                  }

                  return (
                    <div
                      key={course.id}
                      className={`p-3 ${bgColor} border border-${bgColor.split("-")[1]}-200 dark:border-${bgColor.split("-")[1]}-800 rounded-lg`}
                    >
                      <div className="flex items-center">
                        <Shield className={`h-5 w-5 ${statusColor} mr-2`} />
                        <p className={`font-medium ${textColor}`}>{course.course_name}</p>
                        <span className={`ml-auto text-sm ${statusColor}`}>{statusText}</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <p className="text-center text-gray-500 dark:text-gray-400">No safety certifications found</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Recent Activity" />
            <div className="space-y-4">
              {profileData?.recentActivities && profileData.recentActivities.length > 0 ? (
                profileData.recentActivities.map((activity) => (
                  <div key={activity.id} className={`border-l-2 border-${activity.color || "gray"}-500 pl-4 py-2`}>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(activity.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {activity.location ? ` • ${activity.location}` : ""}
                      {activity.description ? ` • ${activity.description}` : ""}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">No recent activity found</div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <SectionHeader title="Safety Stats" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {profileData?.safetyStats.daysSafe || 0}
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">Days Safe</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {profileData?.safetyStats.checkInsCount || 0}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">Check-ins</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {profileData?.safetyStats.completedCoursesCount || 0}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">Courses</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {profileData?.safetyStats.contactsCount || 0}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Trusted Contacts</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}


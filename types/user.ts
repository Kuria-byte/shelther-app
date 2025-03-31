export interface UserProfile {
  id: string
  full_name: string
  phone_number: string
  email: string
  email_verified: boolean
  profile_image_url?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  location_sharing_enabled: boolean
  notification_preferences: {
    emergency: boolean
    check_in: boolean
    journey: boolean
  }
  safety_settings: {
    auto_check_in: boolean
    location_accuracy: "high" | "medium" | "low"
  }
  onboarding_completed?: boolean
  created_at: string
  updated_at: string
}

export interface EmergencyContact {
  id: string
  user_id: string
  name: string
  relationship?: string
  phone_number: string
  email?: string
  priority: number
  notify_on_emergency: boolean
  notify_on_check_in: boolean
  notify_on_journey: boolean
  created_at: string
  updated_at: string
}


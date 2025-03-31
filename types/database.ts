export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone_number: string
          email: string
          email_verified: boolean
          profile_image_url: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          location_sharing_enabled: boolean
          notification_preferences: Json
          safety_settings: Json
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone_number: string
          email: string
          email_verified?: boolean
          profile_image_url?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          location_sharing_enabled?: boolean
          notification_preferences?: Json
          safety_settings?: Json
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone_number?: string
          email?: string
          email_verified?: boolean
          profile_image_url?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          location_sharing_enabled?: boolean
          notification_preferences?: Json
          safety_settings?: Json
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          relationship: string | null
          phone_number: string
          email: string | null
          priority: number
          notify_on_emergency: boolean
          notify_on_check_in: boolean
          notify_on_journey: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          relationship?: string | null
          phone_number: string
          email?: string | null
          priority?: number
          notify_on_emergency?: boolean
          notify_on_check_in?: boolean
          notify_on_journey?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          relationship?: string | null
          phone_number?: string
          email?: string | null
          priority?: number
          notify_on_emergency?: boolean
          notify_on_check_in?: boolean
          notify_on_journey?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]


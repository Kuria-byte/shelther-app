export interface CheckIn {
  id: string
  user_id: string
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  note?: string
  created_at: string
}

export interface Journey {
  id: string
  user_id: string
  start_location: {
    latitude: number
    longitude: number
    address?: string
  }
  destination: {
    latitude: number
    longitude: number
    address?: string
  }
  status: "active" | "completed" | "cancelled" | "delayed"
  estimated_arrival: string
  actual_arrival?: string
  completed_at?: string
  shared_with: string[] // Array of contact IDs
  created_at: string
  updated_at: string
}

export interface JourneyLocation {
  id: string
  journey_id: string
  location: {
    latitude: number
    longitude: number
    accuracy?: number
    address?: string
  }
  created_at: string
}

export interface Alert {
  id: string
  user_id: string
  type: "emergency" | "cautious" | "timer_expired" | "journey_delayed"
  status: "active" | "acknowledged" | "resolved" | "false_alarm"
  location: {
    latitude: number
    longitude: number
    accuracy?: number
    address?: string
  }
  description?: string
  audio_url?: string
  image_url?: string
  video_url?: string
  resolved_at?: string
  created_at: string
  updated_at: string
}

export interface AlertNotification {
  id: string
  alert_id: string
  contact_id: string
  status: "sent" | "delivered" | "read" | "responded"
  response?: "acknowledged" | "on_way" | "contacted_emergency" | "unavailable"
  created_at: string
}

export interface SafetyTimer {
  id: string
  user_id: string
  duration_minutes: number
  expiry_time: string
  status: "active" | "completed" | "expired" | "cancelled"
  shared_with: string[] // Array of contact IDs
  check_in_message?: string
  created_at: string
  updated_at: string
}


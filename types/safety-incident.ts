export interface SafetyIncident {
  id: string
  user_id: string
  incident_type: string
  description?: string
  location?: string
  location_coordinates?: {
    latitude: number
    longitude: number
    accuracy?: number
  }
  resolved: boolean
  resolved_at?: string
  created_at: string
  updated_at: string
}


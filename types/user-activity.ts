export interface UserActivity {
  id: string
  user_id: string
  activity_type: string
  title: string
  description?: string
  metadata?: Record<string, any>
  location?: string
  color?: string
  created_at: string
}


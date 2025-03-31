export type CourseStatus = "not_started" | "in_progress" | "completed"

export interface SafetyCourse {
  id: string
  user_id: string
  course_id: string
  course_name: string
  status: CourseStatus
  progress: number
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}


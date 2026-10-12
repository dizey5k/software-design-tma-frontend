import { TaskCategory, TaskPriority, TaskStatus } from '@/constants/task'

export type TaskPriorityType = (typeof TaskPriority)[keyof typeof TaskPriority]
export type TaskCategoryType = (typeof TaskCategory)[keyof typeof TaskCategory]
export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus]

export interface Task {
  id: string
  user_id?: string
  calendar_event_id?: string | null
  title: string
  description?: string
  deadline?: string // ISO 8601
  priority: TaskPriorityType
  category: TaskCategoryType
  status: TaskStatusType
  source_msg_id?: number
  source_chat_id?: number
  created_at?: string
  completed_at?: string
}

export interface TaskCreatePayload {
  title: string
  description?: string
  deadline?: string
  priority?: TaskPriorityType
  category?: TaskCategoryType
}

export interface TaskUpdatePayload {
  title?: string
  description?: string
  deadline?: string
  priority?: TaskPriorityType
  category?: TaskCategoryType
  status?: TaskStatusType
}

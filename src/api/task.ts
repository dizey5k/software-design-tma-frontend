import { Task, TaskCreatePayload } from '@/types/task'
import axiosClient from './axiosClient'

export const taskApi = {
  async getTasks(): Promise<Task[]> {
    const { data } = await axiosClient.get<Task[]>('/tasks/')
    return data
  },

  // 1. Метод для ручного создания
  async createTaskManual(payload: TaskCreatePayload): Promise<Task> {
    const { data } = await axiosClient.post<Task>('/tasks/', payload)
    return data
  },

  // 2. Метод для создания через ИИ
  async createTaskAI(payload: { message: string }): Promise<Task> {
    const { data } = await axiosClient.post<Task>('/tasks/parse', payload)
    return data
  },

  async updateTask(id: string, payload: Partial<Task>): Promise<Task> {
    const { data } = await axiosClient.patch<Task>(`/tasks/${id}`, payload)
    return data
  },

  async deleteTask(id: string): Promise<void> {
    await axiosClient.delete(`/tasks/${id}`)
  },
}

import axiosClient from './axiosClient'

export interface BurndownPoint {
  date: string
  created_count: number
  completed_count: number
  remaining_count: number
}

export interface MonthlyAnalytics {
  year: number
  month: number
  completed_count: number
  completed_with_deadline_count: number
  on_time_completed_count: number
  on_time_rate_percent: number
  overdue_count: number
  category_workload: { category: string; task_count: number }[]
  burndown: BurndownPoint[]
  team_burndown: {
    chat_id: string
    chat_title: string | null
    points: BurndownPoint[]
  }[]
}

export const analyticsApi = {
  async getMonthly(): Promise<MonthlyAnalytics> {
    const { data } = await axiosClient.get<MonthlyAnalytics>(
      '/analytics/monthly',
    )
    return data
  },
}

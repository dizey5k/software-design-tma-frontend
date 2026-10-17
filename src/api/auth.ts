import axiosClient from './axiosClient'

export const authApi = {
  async getGoogleAuthUrl(): Promise<string> {
    const { data } = await axiosClient.get<{ url: string }>(
      '/auth/google/login',
    )
    return data.url
  },
}

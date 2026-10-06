export const healthApi = {
  check: async (): Promise<{
    status: string
    services: Record<string, string>
  }> => {
    const response = await fetch('/api/health')
    if (!response.ok) {
      throw new Error('Health check failed')
    }
    return response.json()
  },
}

import axios from 'axios'
import { retrieveLaunchParams } from '@telegram-apps/sdk'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://tma-dizzzy.space/api',
})

const getTmaToken = (): string | null => {
  let token = sessionStorage.getItem('tma_token')
  if (token) return token

  const tgGlobal = (window as any).Telegram?.WebApp?.initData
  if (tgGlobal) {
    sessionStorage.setItem('tma_token', tgGlobal)
    return tgGlobal
  }

  try {
    const launchParams = retrieveLaunchParams()
    if (launchParams.initDataRaw) {
      const rawToken = String(launchParams.initDataRaw)
      sessionStorage.setItem('tma_token', rawToken)
      return rawToken
    }
  } catch (e) {
    console.warn('SDK не нашел токен в URL')
  }

  try {
    const searchParams = new URLSearchParams(window.location.hash.slice(1))
    const rawData = searchParams.get('tgWebAppData')
    if (rawData) {
      sessionStorage.setItem('tma_token', rawData)
      return rawData
    }
  } catch (e) {}

  return null
}

axiosClient.interceptors.request.use((config) => {
  const token = getTmaToken()

  if (config.headers.has('x-telegram-id')) {
    config.headers.delete('x-telegram-id')
  }

  if (token) {
    config.headers.set('Authorization', `tma ${token}`)
  }

  return config
})

export default axiosClient

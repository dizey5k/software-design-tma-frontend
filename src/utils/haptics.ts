import { hapticFeedback } from '@telegram-apps/sdk'

export const haptics = {
  impact: (
    style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light',
  ) => {
    try {
      if (hapticFeedback.isSupported()) {
        hapticFeedback.impactOccurred(style)
      }
    } catch (e) {
      console.log('Haptic feedback не поддерживается (мы не в Telegram)')
    }
  },

  success: () => {
    try {
      if (hapticFeedback.isSupported()) {
        hapticFeedback.notificationOccurred('success')
      }
    } catch (e) {}
  },

  warning: () => {
    try {
      if (hapticFeedback.isSupported()) {
        hapticFeedback.notificationOccurred('warning')
      }
    } catch (e) {}
  },

  error: () => {
    try {
      if (hapticFeedback.isSupported()) {
        hapticFeedback.notificationOccurred('error')
      }
    } catch (e) {}
  },
}

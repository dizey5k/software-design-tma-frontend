import { Component, createSignal, onMount, onCleanup } from 'solid-js'
import styles from './HealthIndicator.module.scss'
import { haptics } from '@/utils/haptics'
import { healthApi } from '@/api/health'

export const HealthIndicator: Component = () => {
  const [status, setStatus] = createSignal<'healthy' | 'error' | 'checking'>(
    'checking',
  )

  const checkHealth = async () => {
    try {
      const data = await healthApi.check()
      setStatus(data.status === 'healthy' ? 'healthy' : 'error')
    } catch (e) {
      setStatus('error')
    }
  }

  onMount(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 60000)
    onCleanup(() => clearInterval(interval))
  })

  return (
    <div
      class={`${styles.indicator} ${styles[status()]}`}
      onClick={() => {
        haptics.impact('light')
        checkHealth()
      }}
      title={`Статус сервера: ${status()}`}
    >
      <span class={styles.dot} />
    </div>
  )
}

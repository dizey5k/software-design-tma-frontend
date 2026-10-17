import { Component } from 'solid-js'
import styles from './AppHeader.module.scss'
import { authApi } from '@/api/auth'
import { Calendar, Check, List, Plus, RotateCcw } from 'lucide-solid'
import { haptics } from '@/utils/haptics'
import { toast } from 'solid-sonner'
import { HealthIndicator } from '../HealthIndicator/HealthIndicator'

export type TabType = 'ACTIVE' | 'CREATE' | 'DONE'

interface AppHeaderProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  onRefresh: () => void
  activeCount: number
  completedCount: number
}

export const AppHeader: Component<AppHeaderProps> = (props) => {
  const handleConnectCalendar = async () => {
    haptics.impact('medium')
    try {
      const url = await authApi.getGoogleAuthUrl()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Ошибка подключения календаря', error)
      toast.error('Не удалось подключить Google Календарь')
      haptics.error()
    }
  }

  return (
    <header class={styles.header}>
      <div class={styles.headerTitle}>
        <div style={{ color: '#000000' }}></div>
        <div style={{ color: '#000000' }}></div>
        <h1>Smart Tasks</h1>
        <HealthIndicator />
        <div class={styles.actions}>
          <button
            onClick={handleConnectCalendar}
            class={styles.calendarBtn}
            title="Подключить Google Календарь"
          >
            <Calendar size={16} />
            Календарь
          </button>
          <button
            onClick={() => {
              haptics.impact('light')
              props.onRefresh
            }}
            class={styles.refreshBtn}
            title="Обновить"
          >
            <RotateCcw color="#2481cc" size={16} />
          </button>
        </div>
      </div>

      <nav class={styles.tabNav}>
        <button
          class={`${styles.tabBtn} ${props.activeTab === 'ACTIVE' ? styles.activeTab : ''}`}
          onClick={() => {
            haptics.impact('light')
            props.setActiveTab('ACTIVE')
          }}
        >
          <List size={16} />
          Задачи ({props.activeCount})
        </button>
        <button
          class={`${styles.tabBtn} ${props.activeTab === 'CREATE' ? styles.activeTab : ''}`}
          onClick={() => {
            haptics.impact('light')
            props.setActiveTab('CREATE')
          }}
        >
          <Plus size={16} /> Новая
        </button>
        <button
          class={`${styles.tabBtn} ${props.activeTab === 'DONE' ? styles.activeTab : ''}`}
          onClick={() => {
            haptics.impact('light')
            props.setActiveTab('DONE')
          }}
        >
          <Check size={16} /> Готово ({props.completedCount})
        </button>
      </nav>
    </header>
  )
}

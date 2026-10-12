import { Component, createSignal, Show } from 'solid-js'
import { AITaskForm } from './AITaskForm'
import { ManualTaskForm } from './ManualTaskForm'
import styles from './TaskCreateForm.module.scss'
import { haptics } from '@/utils/haptics'

interface TaskCreateFormProps {
  onCreate: (payload: any) => Promise<void>
}

export const TaskCreateForm: Component<TaskCreateFormProps> = (props) => {
  const [mode, setMode] = createSignal<'free' | 'manual'>('free')

  return (
    <div class={styles.container}>
      <div class={styles.tabs}>
        <button
          type="button"
          class={`${styles.tabBtn} ${mode() === 'free' ? styles.activeTab : ''}`}
          onClick={() => {
            haptics.impact('light')
            setMode('free')
          }}
        >
          ИИ-помощник
        </button>
        <button
          type="button"
          class={`${styles.tabBtn} ${mode() === 'manual' ? styles.activeTab : ''}`}
          onClick={() => {
            haptics.impact('light')
            setMode('manual')
          }}
        >
          Вручную
        </button>
      </div>

      <Show when={mode() === 'free'}>
        <AITaskForm onSubmit={props.onCreate} />
      </Show>

      <Show when={mode() === 'manual'}>
        <ManualTaskForm onSubmit={props.onCreate} />
      </Show>
    </div>
  )
}

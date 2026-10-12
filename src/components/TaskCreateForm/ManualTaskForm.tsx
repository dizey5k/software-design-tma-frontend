import {
  Component,
  createSignal,
  For,
  createEffect,
  onCleanup,
  Show,
} from 'solid-js'
import { mainButton, retrieveLaunchParams } from '@telegram-apps/sdk'
import { TaskCategory, TaskPriority } from '@/constants/task'
import {
  TaskCategoryType,
  TaskPriorityType,
  TaskCreatePayload,
} from '@/types/task'
import { useTranslations } from '@/hooks/useTranslations'
import styles from './TaskCreateForm.module.scss'
import { LoaderCircle } from 'lucide-solid'
import { DatePicker } from '../DatePicker/DatePicker'

interface ManualTaskFormProps {
  onSubmit: (payload: TaskCreatePayload) => Promise<void>
}

export const ManualTaskForm: Component<ManualTaskFormProps> = (props) => {
  const { tCategory, tPriority } = useTranslations()

  const [title, setTitle] = createSignal('')
  const [description, setDescription] = createSignal('')
  const [category, setCategory] = createSignal<TaskCategoryType>(
    TaskCategory.WORK,
  )
  const [priority, setPriority] = createSignal<TaskPriorityType>(
    TaskPriority.MEDIUM,
  )
  const [deadline, setDeadline] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  const isTgNative = () => {
    try {
      retrieveLaunchParams()
      return true
    } catch (e) {
      return false
    }
  }

  const isValid = () => title().trim().length > 0

  const handleSubmit = async (e?: Event) => {
    e?.preventDefault()
    if (!isValid() || loading()) return

    setLoading(true)
    try {
      if (isTgNative()) mainButton.setParams({ isLoaderVisible: true })
      await props.onSubmit({
        title: title().trim(),
        description: description().trim() || undefined,
        category: category(),
        priority: priority(),
        deadline: deadline() ? new Date(deadline()).toISOString() : undefined,
      })

      setTitle('')
      setDescription('')
      setDeadline('')
    } finally {
      setLoading(false)
      if (isTgNative()) mainButton.setParams({ isLoaderVisible: false })
    }
  }

  createEffect(() => {
    if (!isTgNative()) return

    mainButton.setParams({
      text: 'ДОБАВИТЬ ЗАДАЧУ',
      isVisible: true,
      isEnabled: isValid() && !loading(),
      backgroundColor: isValid() ? '#2481cc' : '#a1a1a6',
      textColor: '#ffffff',
    })

    mainButton.onClick(handleSubmit)

    onCleanup(() => {
      mainButton.offClick(handleSubmit)
      mainButton.setParams({ isVisible: false })
    })
  })

  return (
    <form class={styles.form} onSubmit={handleSubmit}>
      <div class={styles.field}>
        <input
          type="text"
          placeholder="Что нужно сделать?"
          value={title()}
          onInput={(e) => setTitle(e.currentTarget.value)}
          disabled={loading()}
          class={styles.input}
        />
      </div>

      <div class={styles.field}>
        <textarea
          placeholder="Описание (необязательно)"
          value={description()}
          onInput={(e) => setDescription(e.currentTarget.value)}
          disabled={loading()}
          class={styles.textarea}
          rows={2}
        />
      </div>

      <div class={styles.row}>
        <div class={styles.field}>
          <label>Категория</label>
          <select
            value={category()}
            onChange={(e) =>
              setCategory(e.currentTarget.value as TaskCategoryType)
            }
            disabled={loading()}
            class={styles.select}
          >
            <For each={Object.values(TaskCategory)}>
              {(cat) => <option value={cat}>{tCategory(cat)}</option>}
            </For>
          </select>
        </div>

        <div class={styles.field}>
          <label>Приоритет</label>
          <select
            value={priority()}
            onChange={(e) =>
              setPriority(e.currentTarget.value as TaskPriorityType)
            }
            disabled={loading()}
            class={styles.select}
          >
            <For each={Object.values(TaskPriority)}>
              {(prio) => <option value={prio}>{tPriority(prio)}</option>}
            </For>
          </select>
        </div>
      </div>

      <div class={styles.field}>
        <label>Дедлайн</label>
        <DatePicker
          value={deadline()}
          onChange={(newIsoDate) => setDeadline(newIsoDate)}
          placeholder="Когда это нужно сделать?"
        />
      </div>

      <Show when={!isTgNative()}>
        <button
          type="submit"
          disabled={!isValid() || loading()}
          class={styles.submitBtn}
        >
          {loading() ? (
            <LoaderCircle class="animate-spin" size={18} />
          ) : (
            'Добавить задачу'
          )}
        </button>
      </Show>
    </form>
  )
}

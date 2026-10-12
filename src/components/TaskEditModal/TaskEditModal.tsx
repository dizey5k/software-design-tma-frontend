import { Component, createSignal, For } from 'solid-js'
import { Task, TaskCategoryType, TaskPriorityType } from '@/types/task'
import { DatePicker } from '@/components/DatePicker/DatePicker'
import { Modal } from '@/components/Modal/Modal'
import { useTranslations } from '@/hooks/useTranslations'
import { TaskCategory, TaskPriority } from '@/constants/task'
import { haptics } from '@/utils/haptics'
import styles from './TaskEditModal.module.scss'

interface Props {
  task: Task
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, updates: Partial<Task>) => Promise<void>
}

export const TaskEditModal: Component<Props> = (props) => {
  const { tCategory, tPriority } = useTranslations()
  const [title, setTitle] = createSignal(props.task.title)
  const [description, setDescription] = createSignal(
    props.task.description || '',
  )
  const [deadline, setDeadline] = createSignal(props.task.deadline || '')
  const [priority, setPriority] = createSignal<TaskPriorityType>(
    props.task.priority || TaskPriority.MEDIUM,
  )
  const [category, setCategory] = createSignal<TaskCategoryType>(
    props.task.category || TaskCategory.WORK,
  )
  const [loading, setLoading] = createSignal(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setLoading(true)

    await props.onSave(props.task.id, {
      title: title(),
      description: description(),
      priority: priority(),
      category: category(),
      deadline: deadline() ? new Date(deadline()).toISOString() : undefined,
    })

    haptics.success()
    setLoading(false)
    props.onClose()
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Редактировать задачу"
    >
      <form onSubmit={handleSubmit} class={styles.form}>
        <div class={styles.field}>
          <label>Название</label>
          <input
            type="text"
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)}
            required
          />
        </div>

        <div class={styles.field}>
          <label>Описание</label>
          <textarea
            value={description()}
            onInput={(e) => setDescription(e.currentTarget.value)}
            rows="3"
          />
        </div>

        <div class={styles.rowFlex}>
          <div class={styles.field}>
            <label>Категория</label>
            <select
              value={category()}
              onChange={(e) => {
                haptics.impact('light')

                setCategory(e.currentTarget.value as TaskCategoryType)
              }}
            >
              <For each={Object.values(TaskCategory)}>
                {(cat) => <option value={cat}>{tCategory(cat)}</option>}
              </For>
            </select>
          </div>

          <div class={styles.field}>
            <label>Приоритет</label>
            <select
              class={styles.prioritySelect}
              value={priority()}
              onChange={(e) => {
                haptics.impact('light')
                setPriority(e.currentTarget.value as TaskPriorityType)
              }}
            >
              <For each={Object.values(TaskPriority)}>
                {(pri) => <option value={pri}>{tPriority(pri)}</option>}
              </For>
            </select>
          </div>
        </div>

        <div class={styles.field}>
          <label>Дедлайн</label>
          <DatePicker value={deadline()} onChange={setDeadline} />
        </div>

        <button type="submit" class={styles.saveBtn} disabled={loading()}>
          {loading() ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </Modal>
  )
}

import { Component, createSignal, Show } from 'solid-js'
import { formatDate, isOverdue } from '@/utils/date'
import styles from './TaskCard.module.scss'
import { TaskStatus } from '@/constants/task'
import { Task } from '@/types/task'
import { useTranslations } from '@/hooks/useTranslations'
import { ConfirmModal } from '../ConfirmModal/ConfirmModal'
import { Calendar, Check, Trash2 } from 'lucide-solid'
import { haptics } from '@/utils/haptics'

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onClick: () => void
}

export const TaskCard: Component<TaskCardProps> = (props) => {
  const { tCategory, tPriority } = useTranslations()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = createSignal(false)

  const isDone = () => props.task.status === TaskStatus.DONE
  const overdue = () => !isDone() && isOverdue(props.task.deadline)

  const handleStatusChange = (e: Event) => {
    e.stopPropagation()
    haptics.impact('medium')
    const nextStatus = isDone() ? TaskStatus.TODO : TaskStatus.DONE
    props.onUpdate(props.task.id, { status: nextStatus })
  }

  return (
    <div
      onClick={props.onClick}
      class={`${styles.card} ${styles[props.task.priority.toLowerCase()]} ${
        isDone() ? styles.done : ''
      } ${overdue() ? styles.overdue : ''}`}
    >
      <div class={styles.checkboxWrapper} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          id={`task-${props.task.id}`}
          checked={isDone()}
          onChange={handleStatusChange}
          class={styles.checkbox}
        />
        <label
          for={`task-${props.task.id}`}
          class={styles.customCheckbox}
        ></label>
      </div>

      <div class={styles.content}>
        <div class={styles.header}>
          <span class={styles.categoryBadge}>
            {tCategory(props.task.category)}
          </span>
          <span
            class={`${styles.priorityBadge} ${styles[props.task.priority.toLowerCase()]}`}
          >
            {tPriority(props.task.priority)}
          </span>
        </div>

        <h3 class={styles.title}>{props.task.title}</h3>

        <Show when={props.task.description}>
          <p class={styles.description}>{props.task.description}</p>
        </Show>

        <Show when={props.task.deadline}>
          <div
            class={`${styles.deadline} ${overdue() ? styles.deadlineOverdue : ''}`}
          >
            <Calendar size={16} />
            {formatDate(props.task.deadline)} {overdue() ? '(Просрочено)' : ''}
          </div>
        </Show>

        <Show when={isDone() && props.task.completed_at}>
          <div class={styles.completedAtBadge}>
            <Check size={16} />
            Выполнено: {formatDate(props.task.completed_at)}
          </div>
        </Show>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          haptics.warning()
          setIsDeleteModalOpen(true)
        }}
        class={styles.deleteBtn}
        title="Удалить"
      >
        <Trash2 size={20} />
      </button>

      <div onClick={(e) => e.stopPropagation()}>
        <ConfirmModal
          isOpen={isDeleteModalOpen()}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            props.onDelete(props.task.id)
            haptics.success()
            setIsDeleteModalOpen(false)
          }}
          title="Удалить задачу?"
          message="Это действие нельзя отменить. Задача будет удалена навсегда."
        />
      </div>
    </div>
  )
}

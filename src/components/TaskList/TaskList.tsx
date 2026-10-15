import { Component, For, Show, createSignal } from 'solid-js'
import { TaskCard } from '@/components/TaskCard/TaskCard'
import { TaskEditModal } from '@/components/TaskEditModal/TaskEditModal'
import { Task } from '@/types/task'
import { haptics } from '@/utils/haptics'
import styles from './TaskList.module.scss'

interface TaskListProps {
  tasks: Task[]
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}

export const TaskList: Component<TaskListProps> = (props) => {
  const [editingTask, setEditingTask] = createSignal<Task | null>(null)

  const handleSaveEdit = async (taskId: string, updates: Partial<Task>) => {
    props.onUpdate(taskId, updates)
    haptics.success()
  }

  return (
    <div class={styles.list}>
      <Show
        when={props.tasks.length > 0}
        fallback={
          <div class={styles.emptyState}>Задач пока нет. Отдыхаем!</div>
        }
      >
        <For each={props.tasks}>
          {(task) => (
            <TaskCard
              task={task}
              onUpdate={props.onUpdate}
              onDelete={props.onDelete}
              onClick={() => {
                haptics.impact('medium')
                setEditingTask(task)
              }}
            />
          )}
        </For>
      </Show>

      <Show when={editingTask()}>
        {(task) => (
          <TaskEditModal
            task={task()}
            isOpen={true}
            onClose={() => setEditingTask(null)}
            onSave={handleSaveEdit}
          />
        )}
      </Show>
    </div>
  )
}

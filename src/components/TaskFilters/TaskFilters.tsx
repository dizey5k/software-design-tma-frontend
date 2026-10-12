import { Component, For } from 'solid-js'
import styles from './TaskFilters.module.scss'
import { TaskCategory } from '@/constants/task'
import { useTranslations } from '@/hooks/useTranslations'
import { NonBinary, Timer } from 'lucide-solid'
import { haptics } from '@/utils/haptics'

interface TaskFiltersProps {
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
  sortByDeadline: boolean
  setSortByDeadline: (val: boolean) => void
}

export const TaskFilters: Component<TaskFiltersProps> = (props) => {
  const { tCategory } = useTranslations()
  const categories = ['ALL', ...Object.values(TaskCategory)]

  return (
    <div class={styles.toolbar}>
      <div class={styles.categories}>
        <For each={categories}>
          {(cat) => (
            <button
              class={`${styles.catChip} ${props.selectedCategory === cat ? styles.activeChip : ''}`}
              onClick={() => {
                haptics.impact('light')
                props.setSelectedCategory(cat)
              }}
            >
              {tCategory(cat)}
            </button>
          )}
        </For>
      </div>

      <button
        class={styles.sortToggle}
        onClick={() => {
          haptics.impact('light')
          props.setSortByDeadline(!props.sortByDeadline)
        }}
      >
        {props.sortByDeadline ? (
          <>
            <Timer size={16} /> Ближайшие
          </>
        ) : (
          <>
            <NonBinary size={16} />
            Без сортировки
          </>
        )}
      </button>
    </div>
  )
}

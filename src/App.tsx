import {
  Component,
  createSignal,
  createMemo,
  onMount,
  Show,
  Switch,
  Match,
  createEffect,
  onCleanup,
} from 'solid-js'
import { useTasks } from '@/hooks/useTasks'
import { TaskCreateForm } from '@/components/TaskCreateForm/TaskCreateForm'
import { TaskList } from '@/components/TaskList/TaskList'
import { AppHeader, TabType } from '@/components/AppHeader/AppHeader'
import { TaskFilters } from '@/components/TaskFilters/TaskFilters'
import styles from './App.module.scss'
import { TaskStatus } from './constants/task'
import { Toaster } from 'solid-sonner'
import { backButton } from '@telegram-apps/sdk'
import { Loader } from './components/Loader/Loader'
import './index.scss'

export const App: Component = () => {
  const { tasks, error, loadTasks, createTask, updateTask, removeTask } =
    useTasks()
  const [activeTab, setActiveTab] = createSignal<TabType>('ACTIVE')
  const [selectedCategory, setSelectedCategory] = createSignal<string>('ALL')
  const [sortByDeadline, setSortByDeadline] = createSignal<boolean>(true)

  onMount(() => {
    loadTasks()
  })

  const activeTasks = createMemo(() => {
    let list = tasks().filter((t) => t.status !== TaskStatus.DONE)

    if (selectedCategory() !== 'ALL') {
      list = list.filter((t) => t.category === selectedCategory())
    }

    if (sortByDeadline()) {
      list = list.sort((a, b) => {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      })
    }

    return list
  })

  const completedTasks = createMemo(() => {
    return tasks().filter((t) => t.status === TaskStatus.DONE)
  })

  const handleTaskCreated = async (payload: any) => {
    await createTask(payload)
    setActiveTab('ACTIVE')
  }

  createEffect(() => {
    try {
      if (backButton.isSupported()) {
        if (activeTab() !== 'ACTIVE') {
          backButton.show()

          const handleBack = () => setActiveTab('ACTIVE')
          backButton.onClick(handleBack)

          onCleanup(() => {
            backButton.offClick(handleBack)
          })
        } else {
          backButton.hide()
        }
      }
    } catch (e) {}
  })

  return (
    <div class={styles.appContainer}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--tg-theme-secondary-bg-color, #1e1e1e)',
            color: 'var(--tg-theme-text-color, #ffffff)',
            border: '1px solid var(--tg-theme-hint-color, #2c2c2e)',
            'border-radius': '12px',
            'font-family': 'inherit',
          },
        }}
      />

      <AppHeader
        activeTab={activeTab()}
        setActiveTab={setActiveTab}
        onRefresh={loadTasks}
        activeCount={activeTasks().length}
        completedCount={completedTasks().length}
      />

      <main class={styles.content}>
        <Show when={error()}>
          <div class={styles.errorAlert}>{error()}</div>
        </Show>

        <Switch fallback={<Loader text="Собираем задачи..." />}>
          <Match when={activeTab() === 'ACTIVE'}>
            <TaskFilters
              selectedCategory={selectedCategory()}
              setSelectedCategory={setSelectedCategory}
              sortByDeadline={sortByDeadline()}
              setSortByDeadline={setSortByDeadline}
            />
            <TaskList
              tasks={activeTasks()}
              onUpdate={updateTask}
              onDelete={removeTask}
            />
          </Match>

          <Match when={activeTab() === 'CREATE'}>
            <div class={styles.formWrapper}>
              <TaskCreateForm onCreate={handleTaskCreated} />
            </div>
          </Match>

          <Match when={activeTab() === 'DONE'}>
            <TaskList
              tasks={completedTasks()}
              onUpdate={updateTask}
              onDelete={removeTask}
            />
          </Match>
        </Switch>
      </main>
    </div>
  )
}

export default App

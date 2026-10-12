import { createSignal, onCleanup, onMount } from 'solid-js'
import axios from 'axios'
import { taskApi } from '@/api/task'
import { Task } from '@/types/task'
import { toast } from 'solid-sonner'
import { haptics } from '@/utils/haptics'
import { CheckCheck, RotateCw, Trash2 } from 'lucide-solid'

export function useTasks() {
  const [tasks, setTasks] = createSignal<Task[]>([])
  const [loading, setLoading] = createSignal<boolean>(false)
  const [error, setError] = createSignal<string | null>(null)

  const loadTasks = async (isBackground = false) => {
    if (!isBackground) {
      setLoading(true)
    }
    setError(null)
    try {
      const data = await taskApi.getTasks()
      setTasks(data)
    } catch (err: unknown) {
      if (!isBackground) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message)
        } else {
          setError('Не удалось загрузить задачи')
        }
      }
    } finally {
      if (!isBackground) {
        setLoading(false)
      }
    }
  }

  onMount(() => {
    loadTasks()

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadTasks(true)
      }
    }, 3000)

    onCleanup(() => {
      clearInterval(interval)
    })
  })

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskApi.updateTask(id, updates)
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)))

      if (updates.status === 'DONE') {
        haptics.success()
        toast.success('Отличная работа! Задача выполнена', {
          icon: <CheckCheck size={18} color="#f9feff" />,
        })
      } else if (
        updates.status === 'TODO' ||
        updates.status === 'IN_PROGRESS'
      ) {
        haptics.impact('light')
        toast.info('Задача возвращена в работу', {
          icon: <RotateCw size={18} color="#3b82f6" />,
        })
      } else {
        haptics.impact('light')
        toast.success('Изменения сохранены')
      }
    } catch (e: any) {
      haptics.error()
      toast.error('Ошибка при обновлении задачи')
    }
  }

  const removeTask = async (id: string) => {
    try {
      await taskApi.deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))

      haptics.warning()
      toast.success('Задача удалена', {
        icon: <Trash2 size={18} color="#ef4444" />,
      })
    } catch (e: any) {
      haptics.error()
      toast.error('Не удалось удалить задачу')
    }
  }

  const createTask = async (payload: any) => {
    try {
      let newTask

      if ('message' in payload) {
        newTask = await taskApi.createTaskAI(payload)
      } else {
        newTask = await taskApi.createTaskManual(payload)
      }

      setTasks((prev) => [newTask, ...prev])

      haptics.success()
      toast.success('Задача успешно создана!')
    } catch (e: any) {
      haptics.error()
      toast.error('Не удалось создать задачу')
    }
  }
  return {
    tasks,
    loading,
    error,
    loadTasks,
    updateTask,
    removeTask,
    createTask,
  }
}

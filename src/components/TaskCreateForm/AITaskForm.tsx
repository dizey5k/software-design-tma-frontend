import {
  Component,
  createSignal,
  createEffect,
  onCleanup,
  Show,
} from 'solid-js'
import { mainButton, retrieveLaunchParams } from '@telegram-apps/sdk'
import styles from './TaskCreateForm.module.scss'
import LoaderCircle from 'lucide-solid/icons/loader-2'

interface AITaskFormProps {
  onSubmit: (payload: { message: string }) => Promise<void>
}

export const AITaskForm: Component<AITaskFormProps> = (props) => {
  const [message, setMessage] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  const isTgNative = () => {
    try {
      retrieveLaunchParams()
      return true
    } catch (e) {
      return false
    }
  }

  const isValid = () => message().trim().length > 0

  const handleSubmit = async (e?: Event) => {
    e?.preventDefault()
    if (!isValid() || loading()) return

    setLoading(true)
    try {
      if (isTgNative()) mainButton.setParams({ isLoaderVisible: true })
      await props.onSubmit({ message: message().trim() })
      setMessage('')
    } finally {
      setLoading(false)
      if (isTgNative()) mainButton.setParams({ isLoaderVisible: false })
    }
  }

  createEffect(() => {
    if (!isTgNative()) return

    mainButton.setParams({
      text: 'Задать в свободной форме',
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
        <textarea
          placeholder="Напиши: Напомни сдать отчет к пятнице..."
          value={message()}
          onInput={(e) => setMessage(e.currentTarget.value)}
          disabled={loading()}
          class={styles.textarea}
          rows={4}
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
            'Создать с помощью ИИ'
          )}
        </button>
      </Show>
    </form>
  )
}

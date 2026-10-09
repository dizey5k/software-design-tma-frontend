import { Component, onMount, onCleanup, createEffect } from 'solid-js'
import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru.js'
import 'flatpickr/dist/flatpickr.min.css'
import 'flatpickr/dist/themes/airbnb.css'
import styles from './DatePicker.module.scss'

interface DatePickerProps {
  value?: string | null
  onChange: (isoString: string) => void
  placeholder?: string
  enableTime?: boolean
}

export const DatePicker: Component<DatePickerProps> = (props) => {
  let inputRef!: HTMLInputElement
  let fpInstance: flatpickr.Instance | null = null

  onMount(() => {
    fpInstance = flatpickr(inputRef, {
      enableTime: props.enableTime ?? true,
      time_24hr: true,
      dateFormat: props.enableTime !== false ? 'd.m.Y H:i' : 'd.m.Y',
      locale: Russian,
      defaultDate: props.value || undefined,
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          props.onChange(selectedDates[0].toISOString())
        }
      },
    }) as flatpickr.Instance
  })

  onCleanup(() => {
    if (fpInstance) fpInstance.destroy()
  })

  createEffect(() => {
    if (fpInstance && props.value === '') {
      fpInstance.clear()
    } else if (fpInstance && props.value) {
      fpInstance.setDate(props.value)
    }
  })

  return (
    <div class={styles.wrapper}>
      <input
        ref={inputRef}
        type="text"
        placeholder={props.placeholder || 'Выберите дату...'}
        class={styles.input}
      />
    </div>
  )
}

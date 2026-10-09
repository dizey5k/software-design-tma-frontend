import { Component, JSX, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import styles from './Modal.module.scss'
import { X } from 'lucide-solid'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: JSX.Element
}

export const Modal: Component<ModalProps> = (props) => {
  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class={styles.overlay} onClick={props.onClose}>
          <div class={styles.modal} onClick={(e) => e.stopPropagation()}>
            <Show when={props.title}>
              <div class={styles.header}>
                <h3 class={styles.title}>{props.title}</h3>
                <button class={styles.closeBtn} onClick={props.onClose}>
                  <X size={20} />
                </button>
              </div>
            </Show>

            <div class={styles.body}>{props.children}</div>
          </div>
        </div>
      </Portal>
    </Show>
  )
}

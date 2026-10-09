import { Component } from 'solid-js'
import { Modal } from '@/components/Modal/Modal'
import styles from './ConfirmModal.module.scss'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

export const ConfirmModal: Component<ConfirmModalProps> = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={props.title || 'Подтверждение'}
    >
      <p class={styles.message}>
        {props.message || 'Вы уверены, что хотите продолжить?'}
      </p>

      <div class={styles.actions}>
        <button class={styles.cancelBtn} onClick={props.onClose}>
          {props.cancelText || 'Отмена'}
        </button>
        <button
          class={styles.confirmBtn}
          onClick={() => {
            props.onConfirm()
            props.onClose()
          }}
        >
          {props.confirmText || 'Удалить'}
        </button>
      </div>
    </Modal>
  )
}

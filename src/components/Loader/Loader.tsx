import { Component } from 'solid-js'
import { LoaderCircle } from 'lucide-solid'
import styles from './Loader.module.scss'

interface LoaderProps {
  text?: string
}

export const Loader: Component<LoaderProps> = (props) => {
  return (
    <div class={styles.loaderWrapper}>
      <LoaderCircle class={styles.spinner} size={32} />
      {props.text && <span class={styles.text}>{props.text}</span>}
    </div>
  )
}

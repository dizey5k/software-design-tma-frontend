import { render } from 'solid-js/web'
import {
  init,
  backButton,
  mainButton,
  retrieveLaunchParams,
} from '@telegram-apps/sdk'
import App from './App'
import './index.scss'

try {
  init()

  const launchParams = retrieveLaunchParams()

  if (launchParams.initDataRaw) {
    sessionStorage.setItem('tma_token', launchParams.initDataRaw as string)
  }

  if (!backButton.isMounted()) {
    backButton.mount()
  }
  if (!mainButton.isMounted()) {
    mainButton.mount()
  }
} catch (error) {
  console.log('Запуск вне среды Telegram (в браузере)')
}

const root = document.getElementById('root')
if (root) {
  render(() => <App />, root)
}

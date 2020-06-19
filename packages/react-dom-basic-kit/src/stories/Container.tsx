import React from 'react'
import {} from '../containers/ModalLayer'
import { Modal } from '../components/Modal'
import {
  useToggleToast,
  useThemeStyles,
  AppContainer,
} from '../index'

import styles from './styles/Container.module.scss'
import styles_dark from './styles/Container-dark.module.scss'

function useStyles() {
  return useThemeStyles(styles, { dark: styles_dark })
}

export const ToggleToastComponent = () => {
  const toggleToast = useToggleToast()
  const [count, setCount] = React.useState(0)
  const toggleMessage = React.useCallback(() => {
    toggleToast('text' + count)
    setCount(x => x + 1)
  }, [count])
  return <div onClick={toggleMessage}>Toggle Toast Test</div>
}

export const ToggleToast = () => {
  return (
    <AppContainer>
      <ToggleToastComponent />
    </AppContainer>
  )
}

import React from 'react'
import {} from '../containers/ModalLayer'
import { Modal } from '../components/Modal'
import {
  useAppContext,
  useToggleToast,
  useThemeStyles,
  Container,
  useToggleModal,
} from '../index'

import { useStyle } from './styles/Container.module.scss'

import styles from './styles/Container.module.scss'
import styles_dark from './styles/Container-dark.module.scss'

function useStyles() {
  return useThemeStyles(styles, { dark: styles_dark })
}

export const ToggleToastComponent = () => {
  const toggleToast = useToggleToast()
  const toggleMessage = () => {
    toggleToast('text')
  }
  return <div onClick={toggleMessage}>Toggle Toast Test</div>
}

export const ToggleToast = () => {
  return (
    <Container>
      <ToggleToastComponent />
    </Container>
  )
}

const ThemeingText = () => {
  const cx = useStyles()
  return <div className={cx('test')}>Theme test Text</div>
}

const TestModal = (props: any) => {
  const cx = useStyles()
  return (
    <Modal {...props} opts={{ blankClose: true }}>
      <div className={cx('test')}>Toggle Modal Test2</div>
    </Modal>
  )
}

export const ToggleModalComponent = () => {
  const cx = useStyles()
  const { theme, setTheme } = useAppContext()
  const toggleModal = useToggleModal(
    (mProps: any) => (
      <Modal {...mProps} opts={{ blankClose: true }}>
        <div className={cx('test')}>Toggle Modal Test</div>
      </Modal>
    ),
    [theme],
  ) as any
  const toggleModal2 = useToggleModal(
    (mProps: any) => <TestModal {...mProps} />,
    [theme],
  ) as any
  const toDark = () => {
    setTheme('dark')
  }
  const clearTheme = () => {
    setTheme('')
  }
  return (
    <div>
      <div className={cx('test')} onClick={() => toggleModal2({ xxx: 'xxx' })}>
        Toggle Dialog Modal
      </div>
      <div className={cx('test')} onClick={toggleModal}>
        Toggle Dialog Modal
      </div>
      <ThemeingText />
      <div onClick={toDark}>Toggle Dialog Modal</div>
      <div onClick={clearTheme}>Toggle Dialog Modal</div>
    </div>
  )
}

export const ToggleModal: any = (p: any) => {
  return (
    <Container>
      <ToggleModalComponent />
    </Container>
  )
}

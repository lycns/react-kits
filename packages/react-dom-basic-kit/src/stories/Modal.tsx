import React from 'react'
import { Modal } from '../components/Modal'
import {
  useAppContext,
  useThemeStyles,
  AppContainer,
} from '../index'

import styles from './styles/Container.module.scss'
import styles_dark from './styles/Container-dark.module.scss'
import { useModalContext } from '../containers/ModalLayer'
import { useModal } from '../logics/ModalLayerHooks'

function useStyles() {
  return useThemeStyles(styles, { dark: styles_dark })
}

const ThemeingText = () => {
  const cx = useStyles()
  return <div className={cx('test')}>Theme test Text</div>
}

const TestModal = (props: any) => {
  const cx = useStyles()
  const { uuid } = props
  return (
    <Modal uuid={uuid}>
      <div className={cx('test')}>Toggle Modal Test2</div>
    </Modal>
  )
}

export const ToggleModalComponent = () => {
  const cx = useStyles()
  const { theme, setTheme } = useAppContext()
  const [count, setCount] = React.useState(0)
  const modal = useModal((uuid: string) => (
    <Modal uuid={uuid}>
        <div>jjjljkl {count}</div>
    </Modal>
  ), [count])

  const modal2 = useModal(uuid => <TestModal uuid={uuid} />, [count])
  const toDark = () => {
    setTheme('dark')
  }
  const clearTheme = () => {
    setTheme('')
  }
  const onClose = () => {
    modal.hide()
  }
  const onOpen = () => {
    modal.toggle()
    setTimeout(() => {
        setCount(x => x + 1)
    }, 1000);
  }
  return (
    <div>
      <div className={cx('test')} onClick={onOpen}>
        Toggle Dialog Modal
      </div>
      <div className={cx('test')} onClick={modal2.show}>
        Toggle Dialog Modal2
      </div>
      <div className={cx('test')} onClick={onClose}>
        Close
      </div>
      {/* <div className={cx('test')} onClick={toggleModal}>
        Toggle Dialog Modal
      </div>
      <ThemeingText />
      <div onClick={toDark}>Toggle Dialog Modal</div>
      <div onClick={clearTheme}>Toggle Dialog Modal</div> */}
    </div>
  )
}

export const ToggleModal: any = (p: any) => {
  return (
    <AppContainer>
      <ToggleModalComponent />
    </AppContainer>
  )
}

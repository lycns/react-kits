import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styles from './styles/Toast.module.scss'
import { transformStyles } from '../utils/style'
import { usePopupShown } from './Popup'

const cx = transformStyles(styles)

const TOAST_LAYER_ID = 'ToastLayer'

const createToastLayer = (): HTMLElement => {
  const node = document.createElement('div')
  node.id = TOAST_LAYER_ID
  node.className = cx('toast-layer')
  document.body.appendChild(node)
  return node
}

const removeToastLayer = (rootNode: HTMLElement) => {
  if (rootNode.children.length === 0) {
    if (!document.body.contains(rootNode)) {
      return
    }
    document.body.removeChild(rootNode)
  }
}

const ToastComponent = (props: any) => {
  const rootNode = document.getElementById(TOAST_LAYER_ID) || createToastLayer()

  React.useEffect(() => {
    return () => {
      // WORKAROUND 延迟 10 毫秒关闭弹出层确保组件已经关闭并且没有新的弹窗出现
      setTimeout(() => {
        removeToastLayer(rootNode)
      }, 10)
    }
  })

  return ReactDOM.createPortal(React.cloneElement(props.children), rootNode)
}

export const Toast: React.FC<any> = (props) => {
  const { children, className, duration = 1500, animDuration = 3000 } = props
  const [visible, setVisible] = React.useState(true)
  const shown = usePopupShown()
  const [hidden, setHidden] = React.useState(false)
  React.useEffect(() => {
    const toastTimer = setTimeout(() => {
      setVisible(false)
    }, duration + animDuration)
    const hiddenTimer = setTimeout(() => {
      setHidden(true)
    }, duration)
    return () => {
      clearTimeout(toastTimer)
      clearTimeout(hiddenTimer)
    }
  }, [])
  return visible ? (
    <ToastComponent>
      <div
        className={cx('toast', className, { shown: shown && !hidden, hidden })}
      >
        {children}
      </div>
    </ToastComponent>
  ) : null
}

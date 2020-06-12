import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styles from './styles/Popup.module.scss'
import { transformStyles } from '../utils/style'

const cx = transformStyles(styles)

const POPUP_LAYER_ID = 'PopupLayer'
let scrolledTop = 0

const createPopupLayer = (): HTMLElement => {
  const node = document.createElement('div')
  node.id = POPUP_LAYER_ID
  node.className = cx('popup-layer')
  // node.onclick = e => e.preventDefault();
  scrolledTop = window.scrollY
  document.body.className = cx('popup-locked-body')
  document.body.style.top = `-${scrolledTop}px`
  document.body.appendChild(node)
  return node
}

const removePopupLayer = (rootNode: HTMLElement) => {
  if (rootNode.children.length === 0) {
    if (!document.body.contains(rootNode)) {
      return
    }
    document.body.className = ''
    // document.body.style.overflow = 'auto'
    document.body.removeChild(rootNode)
    window.scrollTo(0, scrolledTop)
  }
}

const PopupComponent = (props: any) => {
  const rootNode = document.getElementById(POPUP_LAYER_ID) || createPopupLayer()

  React.useEffect(() => {
    return () => {
      // WORKAROUND 延迟 10 毫秒关闭弹出层确保组件已经关闭并且没有新的弹窗出现
      setTimeout(() => {
        removePopupLayer(rootNode)
      }, 10)
    }
  })

  return ReactDOM.createPortal(React.cloneElement(props.children), rootNode)
}

export type IPopupProps = {
  isOpen: boolean
  onClose: () => void
  onRemove: () => void
}

export const enhancePopupComponent = (
  WrappedComponent: any,
  layerClassName?: string,
) => (props: any): any => {
  const { isOpen } = props
  const [removed, setRemoved] = React.useState(false)
  const shown = usePopupShown(isOpen)
  const onRemove = React.useCallback(() => {
    if (!shown) {
      setRemoved(true)
      props.onRemove()
    }
  }, [shown])

  return (
    !removed && (
      <PopupComponent className={layerClassName}>
        <WrappedComponent {...props} onRemove={onRemove} />
      </PopupComponent>
    )
  )
}

export function usePopupShown(isOpen: boolean = true) {
  const [shown, setShown] = React.useState(false)
  React.useEffect(() => {
    if (!isOpen) {
      setShown(false)
    }
  }, [isOpen])
  React.useEffect(() => {
    setTimeout(() => {
      setShown(true)
    }, 10)
    return () => {
      setShown(false)
    }
  }, [])
  return shown
}

export function usePopupLayerOverlay(shown: boolean, onRemove?: any) {
  const [overlay, setOverlay] = React.useState(true)
  React.useEffect(() => {
    if (!onRemove) {
      setOverlay(shown)
    }
  }, [shown])

  React.useEffect(() => {
    const popupLayerNode = document.getElementById('PopupLayer')
    if (popupLayerNode) {
      if (overlay) {
        popupLayerNode.style.zIndex = '2'
      } else {
        popupLayerNode.style.zIndex = ''
      }
    }
  }, [overlay])
  return React.useCallback(() => {
    if (!shown && onRemove) {
      onRemove()
      setOverlay(false)
    }
  }, [shown])
}

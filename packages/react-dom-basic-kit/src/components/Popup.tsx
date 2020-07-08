import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styles from './styles/Popup.module.scss'
import { transformStyles } from '../utils/style'

const cx = transformStyles(styles)

const POPUP_LAYER_ID = 'PopupLayer'
const scrolledPoint = { x: 0, y: 0 }

function hasVerticalScrollbar() {
  return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}

function hasHorizontalScrollbar() {
  return document.body.scrollWidth > (window.innerWidth || document.documentElement.clientWidth);
}

const createPopupLayer = (): HTMLElement => {
  const node = document.createElement('div')
  node.id = POPUP_LAYER_ID
  node.className = cx('popup-layer')
  // node.onclick = e => e.preventDefault();
  scrolledPoint.y = window.scrollY
  scrolledPoint.x = window.scrollX
  document.body.className = cx('popup-locked-body')
  if (scrolledPoint.x > 0) {
    document.body.style.left = `-${scrolledPoint.x}px`
  }
  if (scrolledPoint.y > 0) {
    document.body.style.top = `-${scrolledPoint.y}px`
  }
  if (hasVerticalScrollbar()) {
    document.body.style.overflowY = 'scroll'
  }
  if (hasHorizontalScrollbar()) {
    document.body.style.overflowX = 'scroll'
  }
  document.body.appendChild(node)
  return node
}

const removePopupLayer = (rootNode: HTMLElement) => {
  if (rootNode.children.length === 0) {
    if (!document.body.contains(rootNode)) {
      return
    }
    document.body.className = ''
    document.body.setAttribute('style', '')
    // document.body.style.overflow = 'auto'
    document.body.removeChild(rootNode)
    window.scrollTo(scrolledPoint.x, scrolledPoint.y)
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

  return (
      <PopupComponent className={layerClassName}>
        <WrappedComponent {...props} />
      </PopupComponent>
    )
}

export function usePopupShown(hidden: boolean) {
  const [shown, setShown] = React.useState(false)
  React.useEffect(() => {
    if (hidden) {
      setShown(false)
    }
  }, [hidden])

  // 兼容处理，延时 10 毫秒
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

let popupDeep = 0

export function usePopupOverlayClose(shown: boolean, onClose: () => void) {
  const [overlay, setOverlay] = React.useState(true)
  React.useEffect(() => {
    if (overlay) {
      popupDeep++
    } else {
      popupDeep--
    }
    const popupLayerNode = document.getElementById('PopupLayer')
    if (!popupLayerNode) {
      return
    }
    if (overlay) {
      popupLayerNode.style.zIndex = '2'
    } else if (popupDeep === 0) {
      popupLayerNode.style.zIndex = ''
    }
  }, [overlay])
  return React.useCallback(() => {
    if (!shown && onClose) {
      setOverlay(false)
      setTimeout(onClose)
    }
  }, [shown])
}
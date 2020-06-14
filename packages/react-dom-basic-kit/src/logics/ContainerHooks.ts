import * as React from 'react'
import { AppContext } from '../containers/AppContainer'
import { transformStyles } from '../utils/style'
import { IS_WINDOWS, IS_WECHAT_WEBVIEW } from 'basic-kit-browser'
import { useLocation } from 'react-router-dom'

export function useAppContext() {
  return React.useContext(AppContext)
}

// TODO: legacy code
export function useToastError(error: any) {
  const toggleToast = useToggleToast()
  React.useEffect(() => {
    if (error) {
      const text = error && (error.info || error.message)
      toggleToast(text)
    }
  }, [error])
}

export function useToggleToast(props: any = {}) {
  const { toggleToast } = useAppContext()
  return React.useCallback(
    (text: string) => {
      toggleToast({ props, text })
    },
    [props],
  )
}

export function useThemeStyles(styles: any, themes?: any) {
  const { theme } = useAppContext()
  return transformStyles(styles, { themes, currentTheme: theme })
}

function initInnerHeight(rootNode: any) {
  // windows 如果不减去两个像素就会出现滚动条
  const heightOffset = IS_WINDOWS ? -2 : 0
  const innerHeight = window.innerHeight
  rootNode.style.minHeight = innerHeight
    ? innerHeight + heightOffset + 'px'
    : '100vh'
}

export function useInitRootHeight() {
  const { pathname } = useLocation()
  React.useEffect(() => {
    const rootNode = document.getElementById('root') as any
    if (!rootNode.style.minHeight) {
      // 初始化 min height， 主要目的为兼容 safari 的 innerHeight
      initInnerHeight(rootNode)
    } else if (IS_WECHAT_WEBVIEW) {
      // WORKAROUND 兼容 wechat 内置浏览器路由切换时 innerHeight 不一致的问题, 路由延迟大概 100 ms
      setTimeout(() => {
        initInnerHeight(rootNode)
      }, 100)
    }
  }, [pathname])
}

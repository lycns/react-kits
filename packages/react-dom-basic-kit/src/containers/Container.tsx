import * as React from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { ModalLayer } from './ModalLayer'
import { Toast } from '../components/Toast'
import { useInitAppContext } from '../logics/ContainerContext'
import { transformStyles } from '../utils/style'
import { useUrlQuery } from '../hooks/router'

type IAppContainerProps = {
  basename?: string
  loading?: any
}

export const AppContext = React.createContext<any>(null)

export const Container: React.FC<IAppContainerProps> = (props) => {
  const { children, basename } = props
  const appContext = useInitAppContext()

  return (
    <AppContext.Provider value={appContext}>
      <BrowserRouter basename={basename}>
        {appContext.toasts.map((toast: any, i: number) => (
          <Toast {...toast.props} key={i}>
            {toast.text}
            {!!appContext.theme}
          </Toast>
        ))}
        <ModalLayer>{children}</ModalLayer>
        {/* <DebugConsole /> */}
      </BrowserRouter>
    </AppContext.Provider>
  )
}

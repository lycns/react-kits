import * as React from 'react'
import { BrowserRouter, StaticRouter } from 'react-router-dom'
import { ModalLayer } from './ModalLayer'
import { Toast } from '../components/Toast'
import { useInitAppContext } from '../logics/ContainerContext'

type IAppContainerProps = {
  basename?: string
  loading?: any
}

export const AppContext = React.createContext<any>({})

export const AppContainer: React.FC<IAppContainerProps> = (props) => {
  const { children, basename } = props
  const context = useInitAppContext()

  return (
    <AppContext.Provider value={context}>
      <BrowserRouter basename={basename}>
        {context.toasts.map((toast: any, i: number) => (
          <Toast {...toast.props} key={i}>
            {toast.text}
          </Toast>
        ))}
        <ModalLayer>{children}</ModalLayer>
        {/* <DebugConsole /> */}
      </BrowserRouter>
    </AppContext.Provider>
  )
}
// export const AppSSRContainer: React.FC<IAppContainerProps> = props => {
//   const { children, basename } = props
//   const context = useInitAppContext()
//   return (
//     <AppContext.Provider value={context}>
//       <StaticRouter basename={basename}>
//         {context.toasts.map((toast: any, i: number) => (
//           <Toast {...toast.props} key={i}>
//             {toast.text}
//           </Toast>
//         ))}
//         <ModalLayer>{children}</ModalLayer>
//         {/* <DebugConsole /> */}
//       </StaticRouter>
//     </AppContext.Provider>
//   )
// }
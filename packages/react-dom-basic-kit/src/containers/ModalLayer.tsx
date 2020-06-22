import * as React from 'react'
import { useInitModalContext } from '../logics/ModalLayerContext'

export const ModalContext = React.createContext<any>({})

type IModalLayerProps = {
  
} 

export const ModalLayer: React.FC<IModalLayerProps> = props => {
  const { children } = props
  const context = useInitModalContext()
  const { modals, opts } = context

  return (
    <ModalContext.Provider value={context}>
      {children}
      {Object.keys(modals).map((key) => {
        const modal = modals[key]
        const props = opts[key]?.props
        return React.cloneElement(modal({ uuid: key, ...props }), { key }) 
      })}
    </ModalContext.Provider>
  )
}

export function useModalContext() {
  return React.useContext<any>(ModalContext)
}

export function cloneModalContent(children: any) {
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      children.props?.onClick?.()
    },
  })
}
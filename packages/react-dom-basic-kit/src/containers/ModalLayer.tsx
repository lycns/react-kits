import * as React from 'react'
import { useInitModalContext } from '../logics/ModalLayerContext'

export const ModalContext = React.createContext<any>({})

export const ModalLayer: React.FC<any> = (props) => {
  const { children } = props
  const context = useInitModalContext()
  const { modals, opts } = context

  return (
    <ModalContext.Provider value={context}>
      {children}
      {Object.keys(modals).map((key) => {
        return React.cloneElement(modals[key](key), { key })
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
      const onChildClick = children.props.onClick
      if (onChildClick) {
        onChildClick()
      }
    },
  })
}
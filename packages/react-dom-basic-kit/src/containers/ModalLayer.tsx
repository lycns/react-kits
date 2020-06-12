import * as React from 'react'
import uuidv4 from 'uuid/v4'
import { useLocation } from 'react-router-dom'
import { TOGGLED_MODALES } from '../logics/ModalLayerHooks'

export function asModalProps(props: any) {
  return {
    isOpen: props.isOpen,
    onClose: props.onClose,
    onRemove: props.onRemove,
  }
}

export const ModalContext = React.createContext<any>(null)

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

// WORKAROUND: webpack 打包时，如果依赖 context 是否为 null 进行 render,
// 则第二次 webpack 打包之后，存在先 render 的问题
function useLoadingContext(defaultContext: any): any {
  const [context, setContext] = React.useState(null)
  React.useEffect(() => {
    setContext((mContext) => mContext || defaultContext)
  }, [defaultContext])
  return [context, !context]
}

// LEGACYCODE: 有机会改成 React.useReducer 的形式...算了，没啥机会了
export const ModalLayer: React.FC<any> = (props) => {
  const { children } = props
  const { pathname } = useLocation()
  const [modalsMap, setModalsMap] = React.useState<any>({})
  const [optsMap, setOptsMap] = React.useState<any>({})
  const [hiddenModals, setHiddenModals] = React.useState<any>([])

  React.useEffect(() => {
    setModalsMap({})
  }, [pathname])

  const showModal = (modal: any, id?: any, props?: any) => {
    const uuid = id || uuidv4()
    if (props) {
      setOptsMap((opts: any) => ({ ...opts, [uuid]: props }))
    }
    setModalsMap((modals: any) => ({ ...modals, [uuid]: modal }))
    return uuid
  }
  const removeModal = (uuid: any) => {
    setModalsMap((modals: any) => {
      if (modals[uuid]) {
        delete modals[uuid]
        return { ...modals }
      }
      return modals
    })
  }

  const closeModal = (uuid: any) => {
    setHiddenModals((x: any) => [...x, uuid])
  }

  const updateModal = (uuid: any, modal: any) => {
    setModalsMap((modals: any) => {
      if (modals[uuid]) {
        return { ...modals, [uuid]: modal }
      }
      return modals
    })
  }

  const onCloseBySelf = (key: any, modal: any) => () => {
    TOGGLED_MODALES[key] = modal
    closeModal(key)
  }

  const [modalContext, loading] = useLoadingContext({
    showModal,
    closeModal,
    removeModal,
    updateModal,
  })

  return (
    <ModalContext.Provider value={modalContext}>
      {!loading && children}
      {Object.keys(modalsMap).map((key, i) => {
        return React.createElement(modalsMap[key], {
          ...(optsMap[key] || {}),
          key,
          isOpen: !hiddenModals.includes(key),
          onClose: onCloseBySelf(key, modalsMap[key]),
          onRemove: () => removeModal(key),
        })
      })}
    </ModalContext.Provider>
  )
}

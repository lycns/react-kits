import * as React from 'react'
import { ModalContext } from '../containers/ModalLayer'

export const TOGGLED_MODALES: any = {}

function useUpdateModal(modalId: any, modal: any, deps: any[]) {
  const { updateModal } = React.useContext(ModalContext)
  React.useEffect(() => {
    if (modalId) {
      updateModal(modalId, modal)
    }
  }, [modalId, modal, ...deps])
}

export function useToggleModal(modal: any, deps: any = []) {
  const { showModal, closeModal } = React.useContext(ModalContext)
  const [activeModal, setActiveModal] = React.useState<any>(null)
  const memoModal = React.useMemo(() => modal, deps)
  const toggleModal = React.useCallback(
    (props) => {
      if (activeModal && !TOGGLED_MODALES[activeModal]) {
        setActiveModal(null)
        closeModal(activeModal)
      } else {
        if (TOGGLED_MODALES[activeModal]) {
          delete TOGGLED_MODALES[activeModal]
        }
        const modalId = showModal(memoModal, undefined, props)
        setActiveModal(modalId)
      }
    },
    [activeModal, ...deps],
  )
  useUpdateModal(activeModal, memoModal, deps)
  return toggleModal
}

export function useModal(modal: any, deps: any = []) {
  const { showModal, closeModal } = React.useContext(ModalContext)
  const [activeModal, setActiveModal] = React.useState<any>()
  const memoModal = React.useMemo(() => modal, deps)
  const onShowModal = React.useCallback((props?: any) => {
    const modalId = showModal(memoModal, undefined, props)
    setActiveModal(modalId)
  }, deps)
  const onCloseModal = React.useCallback(() => {
    setActiveModal(null)
    closeModal(activeModal)
  }, [activeModal])
  useUpdateModal(activeModal, memoModal, deps)
  return [onShowModal, onCloseModal]
}

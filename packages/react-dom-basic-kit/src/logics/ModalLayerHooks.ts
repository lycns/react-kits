import * as React from 'react'
import uuidv4 from 'uuid/v4'
import { useModalContext } from '../containers/ModalLayer'
import { usePopupShown } from '../components/Popup'

type IModalType = (uuid: string) => React.ReactElement

export function useModal(modal: IModalType, deps = [] as any[]) {
    const { open, hide, update, modals } = useModalContext()
    const [uuid, setUuid] = React.useState('')
    const memoModal = React.useMemo(() => modal, deps)
    const opened = !!modals[uuid]

    const onShowModal = () => {
        const uuid = uuidv4()
        open(modal, uuid)
        setUuid(uuid)
    }
    const onHideModal = React.useCallback(() => {
        hide(uuid)
        setUuid('')
    }, [uuid])

    const onToggleModal = React.useCallback(() => {
        if (opened) {
            onHideModal()
        } else {
            onShowModal()
        }
    }, [opened, onShowModal, onHideModal])

    React.useEffect(() => {
        if (!uuid) {
            return
        }
        update(memoModal, uuid)
    }, [uuid, memoModal, ...deps])

    return {
        show: onShowModal,
        hide: onHideModal,
        toggle: onToggleModal,
    }
}


export function useModalClose(uuid: string) {
  const { hide, close } = useModalContext()
  const { shown } = useModalStatus(uuid)
  const onHide = () => hide(uuid)
  // !shown 表示处于 hidden 状态
  const onClose = () => !shown ? close(uuid) : undefined
  return [onHide, onClose]
}

// opened -> shown -> hidden/shown false -> closed/opened falase
export function useModalStatus(uuid: string) {
  const { modals, opts } = useModalContext()
  const opened = !!modals[uuid]
  const hidden = opts[uuid]?.hidden
  const shown = usePopupShown(hidden)
  return { opened, shown }
}

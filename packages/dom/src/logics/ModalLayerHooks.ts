import * as React from 'react'
import uuidv4 from 'uuid/v4'
import { useModalContext } from '../containers/ModalLayer'
import { usePopupShown } from '../components/Popup'

export type IModalProps = {
    uuid: string
}

type IModalType<T> = (props: IModalProps & T) => React.ReactElement

function isUIEvent(test: any): test is React.UIEvent {
    return test && !!test.nativeEvent
}

export function useModal<T>(modal: IModalType<T>, deps = [] as any[]) {
    const { open, hide, update, modals } = useModalContext()
    const [uuid, setUuid] = React.useState('')
    const uuidRef = React.useRef('')
    const memoModal = React.useMemo(() => modal, deps)
    const opened = !!modals[uuid]

    const onShowModal = (props?: T | React.UIEvent) => {
        const uuid = uuidv4()
        if (isUIEvent(props)) {
            open(modal, uuid)
        } else {
            open(modal, uuid, props)
        }
        setUuid(uuid)
        uuidRef.current = uuid
    }

    const onHideModal = React.useCallback(() => {
        hide(uuid || uuidRef.current)
        setUuid('')
        uuidRef.current = ''
    }, [uuid])

    const onToggleModal = React.useCallback((props?: T) => {
        if (opened || (!uuid && uuidRef.current)) {
            onHideModal()
        } else {
            onShowModal(props)
        }
    }, [opened, onShowModal, onHideModal])

    React.useEffect(() => {
        if (!uuid) {
            return
        }
        update(memoModal, uuid)
    }, [uuid, memoModal])

    return {
        show: onShowModal,
        hide: onHideModal,
        toggle: onToggleModal,
    }
}


export function useModalClose(uuid: string, timeout: number = 0) {
  const { hide, close, opts } = useModalContext()
  const hidden = opts[uuid]?.hidden
  const onHide = () => {
      hide(uuid)
      if (timeout === 0) {
          return
      }
      setTimeout(() => {
        close(uuid)   
      }, timeout)
  }
  // !shown 表示处于 hidden 状态
  const onClose = React.useCallback(() => {
      if (hidden) {
        close(uuid)
      }
  }, [hidden])
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

export function useModalCloseAll() {
    const { modals, close } = useModalContext()
    return React.useCallback(() => {
        for (const uuid of Object.keys(modals)) {
            close(uuid)
        }
    }, [modals])
  }
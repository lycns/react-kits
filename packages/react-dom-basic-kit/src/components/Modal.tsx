import * as React from 'react'
import styles from './styles/Modal.module.scss'
import {
  enhancePopupComponent,
  IPopupProps,
  usePopupOverlayClose,
} from './Popup'

import { transformStyles } from '../utils/style'
import { cloneModalContent } from '../containers/ModalLayer'
import { useModalStatus, useModalClose } from '../logics/ModalLayerHooks'

const cx = transformStyles(styles)

type IDrawerModalProps = IPopupProps & {
  children: React.ReactElement
  uuid: string
  className?: string
  layerClose?: boolean
}

const TModal: React.FC<IDrawerModalProps> = (props) => {
  const { uuid, children, className, layerClose = true, } = props
  const [ onHide, onClose ] = useModalClose(uuid)
  const { shown } = useModalStatus(uuid)

  return (
    <div
      className={cx('modal', className, { shown })}
      onClick={layerClose ? onHide : undefined}
      onTransitionEnd={onClose}
    >
      {cloneModalContent(children)}
    </div>
  )
}

export const Modal = enhancePopupComponent(TModal)

const TModalOverlay: React.FC<IDrawerModalProps> = (props) => {
  const { uuid, children, className, layerClose = true, } = props
  const [ onHide, onClose ] = useModalClose(uuid)
  const { shown } = useModalStatus(uuid)
  const onOverlayClose = usePopupOverlayClose(shown, onClose)

  return (
    <div
      className={cx('modal', className, { shown })}
      onClick={layerClose ? onHide : undefined}
      onTransitionEnd={onOverlayClose}
    >
      {cloneModalContent(children)}
    </div>
  )
}

export const ModalOverlay = enhancePopupComponent(TModalOverlay)
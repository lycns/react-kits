import * as React from 'react'
import styles from './styles/Modal.module.scss'
import {
  enhancePopupComponent,
  usePopupShown,
  IPopupProps,
  usePopupLayerOverlay,
} from './Popup'

import { transformStyles } from '../utils/style'
import { cloneModalContent } from '../containers/ModalLayer'

const cx = transformStyles(styles)

type IModalOpts = {
  blankClose?: boolean
  noBg?: boolean
  noAnim?: boolean
}

type IDrawerModalProps = IPopupProps & {
  children: React.ReactElement
  className?: string
  opts?: IModalOpts
}

const TModal: React.FC<IDrawerModalProps> = (props) => {
  const { isOpen, onClose, onRemove, children, className, opts = {} } = props
  const { blankClose, noBg, noAnim } = opts
  const shown = usePopupShown(isOpen)
  const onRemoveModal = usePopupLayerOverlay(shown, onRemove)

  return (
    <div
      className={cx('modal', className, {
        shown,
        'no-bg': noBg,
        'no-anim': noAnim,
      })}
      onClick={blankClose ? onClose : undefined}
      onTransitionEnd={onRemoveModal}
    >
      {cloneModalContent(children)}
    </div>
  )
}

export const Modal = enhancePopupComponent(TModal)

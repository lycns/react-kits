import React from 'react'
import { useToggleToast, Container } from '../index'
import { Modal } from '../components/Modal'

export const LazyModal = (props: any) => {
  return (
    <Modal {...props} blankClose>
      <div>LazyModal</div>
    </Modal>
  )
}
export default LazyModal

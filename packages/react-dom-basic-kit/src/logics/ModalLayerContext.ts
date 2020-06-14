import * as React from 'react'
import { createReducer } from 'react-logic-utils'

const MODAL_ACTION_OPEN = 'MODAL_ACTION_OPEN'
const MODAL_ACTION_CLOSE = 'MODAL_ACTION_CLOSE'
const MODAL_ACTION_HIDE = 'MODAL_ACTION_HIDE'
const MODAL_ACTION_UPDATE = 'MODAL_ACTION_UPDATE'

const open = (modal: any, uuid: string) => ({ type: MODAL_ACTION_OPEN, modal, uuid })
const close = (uuid: string) => ({ type: MODAL_ACTION_CLOSE, uuid })
const hide = (uuid: string) => ({ type: MODAL_ACTION_HIDE, uuid })
const update = (modal: any, uuid: string) => ({ type: MODAL_ACTION_UPDATE, modal, uuid })

const initialState = {
  modals: {},
  opts: {},
}

const appReducer = createReducer(state => ({
  [MODAL_ACTION_OPEN]: ({ modal, uuid }) => {
    state.modals[uuid] = modal
    state.opts[uuid] = {}
  },
  [MODAL_ACTION_UPDATE]: ({ modal, uuid }) => {
    if (!state.modals[uuid]) {
        return
    }
    state.modals[uuid] = modal
  },
  [MODAL_ACTION_CLOSE]: ({ uuid }) => {
    delete state.modals[uuid]
    delete state.opts[uuid]
  },
  [MODAL_ACTION_HIDE]: ({ uuid }) => {
    const opts = state.opts[uuid]
    if (!opts) {
        return
    }
    state.opts[uuid] = { ...opts, hidden: true }
  },
}))

export function useInitModalContext() {
  const [state, dispatch] = React.useReducer(appReducer, initialState)
  const data = {
    modals: state.modals,
    opts: state.opts,
  }
  const actions = {
    open: (modal: any, uuid: string) => dispatch(open(modal, uuid)),
    update: (modal: any, uuid: string) => dispatch(update(modal, uuid)),
    close: (uuid: string) => dispatch(close(uuid)),
    hide: (uuid: string) => dispatch(hide(uuid)),
  }
  return { ...data, ...actions}
}

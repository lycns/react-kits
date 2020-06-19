import * as React from 'react'
import { createReducer } from 'react-logic-utils'

const MODAL_ACTION_OPEN = 'MODAL_ACTION_OPEN'
const MODAL_ACTION_UPDATE = 'MODAL_ACTION_UPDATE'
const MODAL_ACTION_CLOSE = 'MODAL_ACTION_CLOSE'
const MODAL_ACTION_CLOSE_BYNAME = 'MODAL_ACTION_CLOSE_BYNAME'
const MODAL_ACTION_HIDE = 'MODAL_ACTION_HIDE'
const MODAL_ACTION_HIDE_BYNAME = 'MODAL_ACTION_HIDE_BYNAME'

const open = (modal: any, uuid: string, name?: string) => ({ type: MODAL_ACTION_OPEN, modal, uuid, name })
const update = (modal: any, uuid: string) => ({ type: MODAL_ACTION_UPDATE, modal, uuid })
const close = (uuid: string) => ({ type: MODAL_ACTION_CLOSE, uuid })
const closeByName = (name: string) => ({ type: MODAL_ACTION_CLOSE_BYNAME, name })
const hide = (uuid: string) => ({ type: MODAL_ACTION_HIDE, uuid })
const hideByName = (name: string) => ({ type: MODAL_ACTION_HIDE_BYNAME, name })

const initialState = {
  modals: {},
  opts: {},
  names: {},
}

const appReducer = createReducer(state => ({
  [MODAL_ACTION_OPEN]: ({ modal, uuid, name }) => {
    state.modals[uuid] = modal
    state.opts[uuid] = {}
    if (!name) {
      return
    }
    if (!state.names[name]) {
      state.names[name] = []
    }
    state.names[name].push(uuid)
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
    for (const name of Object.keys(state.names)) {
      const uuids = state.names[name].filter((id: string) => id !== uuid)
      if (uuids.length === 0) {
        delete state.names[name]
      } else {
        state.names[name] = uuids
      }
    }
  },
  [MODAL_ACTION_CLOSE_BYNAME]: ({ name }) => {
    const uuids = state.names[name] || []
    for (const uuid of uuids) {
      delete state.modals[uuid]
      delete state.opts[uuid]
    }
    delete state.names[name]
  },
  [MODAL_ACTION_HIDE]: ({ uuid }) => {
    const opts = state.opts[uuid]
    state.opts[uuid] = { ...opts, hidden: true }
  },
  [MODAL_ACTION_HIDE_BYNAME]: ({ name }) => {
    const uuids = state.names[name] || []
    for (const uuid of uuids) {
      const opts = state.opts[uuid]
      state.opts[uuid] = { ...opts, hidden: true }
    }
  },
}))

export function useInitModalContext() {
  const [state, dispatch] = React.useReducer(appReducer, initialState)
  const data = {
    modals: state.modals,
    opts: state.opts,
    names: state.names,
  }
  const actions = {
    open: (modal: any, uuid: string, name?: string) => dispatch(open(modal, uuid, name)),
    update: (modal: any, uuid: string) => dispatch(update(modal, uuid)),
    close: (uuid: string) => dispatch(close(uuid)),
    // closeByName: (name: string) => dispatch(closeByName(name)), // 这个原则上应该不会用到
    hide: (uuid: string) => dispatch(hide(uuid)),
    hideByName: (name: string) => dispatch(hideByName(name)),
  }
  return { ...data, ...actions }
}

import * as React from 'react'
import { injectReducers } from './injector'
import produce from 'immer'
import _cloneDeep from 'lodash/cloneDeep'
import _assign from 'lodash/assign'
import { useScopedAction, useScopedSelector } from './hooks'
import { xArray, xType } from 'basic-kit-js'
import { usePreviousWithNull } from 'react-logic-utils'
import { Dispatch } from 'redux'
import { storeInstance } from './store'

export function createSlice(name: string, reducers: any) {
  return {
    selector: (select: any) => (state: any) => select(state[name]),
    injector: () => {
      return injectReducers(name, reducers)
    },
    dispatch: async (action: any, preload = true) => {
      const values = { scope: name } as any
      values.preload = preload
      const promise = createActionPromise(action, values, storeInstance?.dispatch as any)
      await promise?.()
    },
    useAction: (action: any, deps?: any) => {
      return useScopedAction(name, action, deps)
    },
    useSelector: (selector: any) => {
      const data = useScopedSelector(name, selector)
      const cache = usePreviousWithNull(data)
      return [cache, data]
    },
  }
}

export function createActionPromise(action: any, values: any, dispatch: Dispatch) {
  const extras = {} as any
  if (values && Object.keys(values).length) {
    extras.__values__ = values
  }
  const promise = dispatch({ ...action, ...extras })
  if (xType(promise) === 'function') {
    return promise
  }
}

export function createReducer(initialState: any, reducerMap?: any) {
  return (injectState: any = initialState) => {
    // TODO: 有机会优化 = =
    const injectedState = _cloneDeep({
      ...initialState, 
      ...injectState,
      __values__: {
        ...initialState.__values__,
        ...injectState.__values__,
      }
    })
    return produce((state: any = injectedState, action: any) => {
      const {
        __values__: { scope: stateScope } = {} as any, 
      } = state
      const { 
        __values__: { scope, preload, preloaded } = {} as any 
      } = action
      const scopes = xArray(scope)
     
      if (stateScope && !scopes.includes(stateScope)) {
        return state
      }

      if (preload) {
        if (!state.__values__.preload) {
          state.__values__.preload = []
        }
        if (!state.__values__.preload.includes(action.from)) {
          state.__values__.preload.push(action.from)
        }
      }

      if (preloaded && state.__values__.preload) {
        const idx = state.__values__.preload.indexOf(action.type)
        if (idx > -1) {
          delete state.__values__.preload[idx]
          return state
        }
      }

      if (reducerMap) {
        const reducer = reducerMap(state)[action.type]
        if (reducer) {
          return reducer(action)
        }
      }
      return state
    })
  }
}

export function createPayloadAction(type: string) {
  return (payload: any) => ({ type, payload })
}

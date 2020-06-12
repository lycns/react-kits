import { combineReducers } from 'redux'
import mapValues from 'lodash/mapValues'
import { storeInstance } from './store'

const initialValues = {}

export function formatReducers(reducers: any, values: any = {}) {
  const mergedValues = { ...initialValues, ...values }
  return mapValues(reducers, (reducer) => {
    if (Object.keys(mergedValues).length === 0) {
      return reducer()
    }
    return reducer({ __values__: mergedValues })
  })
}

export function injectReducers(name: string, reducers: any) {
  if (!storeInstance) {
    return
  }
  if (name) {
    const { asyncReducers } = storeInstance
    if (asyncReducers[name]) {
      console.warn('exist reducer name')
      return
    }
    const injectedReducers = formatReducers(reducers, { scope: name })
    asyncReducers[name] = combineReducers(injectedReducers)
    const combinedReducers = combineReducers({ ...asyncReducers }) as any
    storeInstance.replaceReducer(combinedReducers)
  }
}

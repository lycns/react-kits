import mapValues from 'lodash/mapValues'
import { xArray } from 'basic-kit-js'
import { storeInstance } from './store'

export const asyncMiddleware = ({ dispatch, getState }: any) => {
  return (next: any) => (action: any) => {
    const { target, type, success, meta, payload, failure, cache, selector } = action
    const state = getState()
    const { __values__ = {} } = action
    const preload = __values__.preload

    if (storeInstance?.preloadState) {
      const scopes = xArray(__values__.scope)
      let preloaded = false
      for (const scope of scopes) {
        const preloadState = storeInstance?.preloadState[scope] || []
        const idx = preloadState.indexOf(type)
        if (idx > -1) {
          preloaded = true
          delete preloadState[idx]
        }
      }
      if (preloaded) {
        __values__.preloaded = true
        return next({ ...action, __values__ })
      }
    }
    
    if (target) {
      delete __values__.preload
      return async () => {
        let selected = {}
        if (typeof selector === 'function') {
          selected = selector(state)
        } else if (typeof selector === 'object') {
          selected = mapValues(selector, (value) => value && value(state))
        }
        const params = typeof meta === 'function' ? meta(selected) : meta
        const base: any = { __values__ }
        if (params) {
          base.meta = params
        }
        dispatch({ type, ...base })
        try {
          const cached = cache && await cache({ meta: params, selector: selected })
          let data = cached
          if (!cached || typeof cached === 'function') {
            const response = await target(params, dispatch)
            data = payload ? payload(response) : response
            if (cached) {
              cached(data)
            }
          }
          if (success) {
            if (preload) {
              base.__values__.preload = true
            }
            dispatch({ ...success(data), from: type, ...base })
          }
          return data
        } catch (e) {
          if (failure) {
            dispatch({ type: failure, from: type, error: e, ...base })
          }
          throw e
        }
      }
    }
    return next(action)
  }
}

import mapValues from 'lodash/mapValues'

export const asyncMiddleware = ({ dispatch, getState }: any) => {
  return (next: any) => (action: any) => {
    const { target, type, success, meta, payload, failure, cache, selector } = action
    const { __values__ } = action
    if (target) {
      return async () => {
        let selected = {}
        if (typeof selector === 'function') {
          selected = selector(getState())
        } else if (typeof selector === 'object') {
          selected = mapValues(selector, (value) => value && value(getState()))
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
            dispatch({ ...success(data), ...base })
          }
          return data
        } catch (e) {
          if (failure) {
            dispatch({ type: failure, error: e, ...base })
          }
          throw e
        }
      }
    }
    return next(action)
  }
}

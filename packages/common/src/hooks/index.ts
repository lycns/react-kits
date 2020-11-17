import * as React from 'react'
import produce from 'immer'
import qs from 'qs'
import { useLocation } from 'react-router'

export function usePreviousWithNull(data: any) {
    const [cache, setCache] = React.useState(data)
    React.useEffect(() => {
      if (data) {
        setCache(data)
      }
    }, [data])
    return data || cache
}

export type IReducerMapResult<T> = {
  [key: string]: (action: any) => T | void
}

export type IReducerMap<T> = (state: T) => IReducerMapResult<T>

export function createReducer(reducerMap: IReducerMap<any>) {
  return produce((state: any, action: any) => {
    const reducer = reducerMap(state)[action.type]
    if (reducer) {
      return reducer(action)
    }
    return state
  })
}

export function useUrlQuery<T extends {} = any>(): T {
  const { search } = useLocation()
  return qs.parse(search, { ignoreQueryPrefix: true }) as T
}

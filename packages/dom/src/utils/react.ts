import produce from 'immer'

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

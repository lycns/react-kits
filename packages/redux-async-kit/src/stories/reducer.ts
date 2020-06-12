import { TEST_ASYNC_ACTION, TEST_ACTION } from './enums'
import { createReducer } from '../modules/creator'

const initialState = {
  name: '',
  detail: '',
}

const mockCalculate = () => {
  for (let i = 1; i < 1000; i++) {
    for (let j = 1; j < 1000; j++) {
      for (let k = 1; k < 5000; k++) {
        const b = k * 100
      }
    }
  }
}

const reducerMap = (state: any) => ({
  [TEST_ACTION.SET_NAME]: ({ payload }: any) => {
    state.name = payload
  },
  [TEST_ASYNC_ACTION.GET_NAME]: () => {
    state.name = initialState.name
  },
  [TEST_ACTION.SET_DETAIL]: ({ payload }: any) => {
    state.detail = payload
  },
  [TEST_ASYNC_ACTION.GET_DETAIL]: () => {
    state.detail = initialState.detail
  },
})

export const testReducer = createReducer(initialState, reducerMap)

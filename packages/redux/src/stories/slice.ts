import { createSlice } from '../modules/creator'
import { testReducer } from './reducer'

export const testSlice = createSlice('test', {
    testReducer,
})

import React from 'react'

import { configureStore } from '../modules/store'
import { Provider } from 'react-redux'
import { createSlice } from '../modules/creator'
import { useAsyncCallback, useAsyncEffect, useScopedAction } from '../modules/hooks'
import { testReducer } from './reducer'
import { testAsyncAction, testAction } from './action'
import { testSelector } from './selectors'
import { testSlice } from './slice'

// export const TimeoutContainer = (props: any) => {
//     return (
//         <Provider store={store}>{props.children}</Provider>
//     )
// }

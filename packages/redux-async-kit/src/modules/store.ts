import { createEpicMiddleware } from 'redux-observable'
import {
  compose,
  applyMiddleware,
  createStore,
  combineReducers,
  Store,
} from 'redux'
import { asyncMiddleware } from './async'
import { formatReducers, IInjectReducerInfo } from './injector'
import { composeWithDevTools } from 'redux-devtools-extension'
import loggerMiddleware from 'redux-logger'
import { xArray, sleep } from 'basic-kit-js'
import _cloneDeep from 'lodash/cloneDeep'

type StoreInstance = Store & {
  asyncReducers: any;
  preloadState?: any;
}

export let storeInstance: StoreInstance | undefined

function createDefaultMiddleware() {
  return [asyncMiddleware, composeWithDevTools, loggerMiddleware]
}

type IInjector = () => IInjectReducerInfo

type IConfigure = {
  epics?: any,
  middlewares?: any[],
  reducers?: any,
  injector?: IInjector | IInjector[]
}

export function configureStore(configure: IConfigure = {} as IConfigure, initialState = {}) {
  const { epics, middlewares = [], reducers = {}, injector } = configure
  // configure middlewares
  const defaultMiddlewares: any[] = createDefaultMiddleware()
  const asyncReducers: any = formatReducers(reducers)
  const runEpics = epics && epics.length > 0
  const epicMiddleware = createEpicMiddleware()
  if (runEpics) {
    defaultMiddlewares.push(epicMiddleware)
  }

  const combinedMiddlewares = [...defaultMiddlewares, ...middlewares]
  // compose enhancers
  const enhancer = compose(applyMiddleware(...combinedMiddlewares))

  storeInstance = undefined

  xArray(injector).forEach(inject => {
    const injectInfo = inject()
    if (injectInfo) {
      const { reducers, name } = injectInfo
      const injectedReducers = formatReducers(reducers, { scope: name })
      asyncReducers[name] = combineReducers(injectedReducers)
    }
  })

  const combinedReducers = combineReducers({ ...asyncReducers })
  // create store
  const store = createStore(combinedReducers, initialState, enhancer)

  if (runEpics) {
    epicMiddleware.run(epics)
  }
  storeInstance = { 
    ...store, 
    asyncReducers,
    preloadState: formatPreloadState(initialState)
  } as any
 
  return store
}

function formatPreloadState(state: any) {
  const formatedState = {} as any
  for (const scopekey of Object.keys(state)) {
    const scopeState = state[scopekey]
    for (const reducerKey of Object.keys(scopeState)) {
      const reducer = scopeState[reducerKey]
      const { scope, preload } = reducer.__values__ || {}
      
      if (scope && preload) {
        formatedState[scope] = _cloneDeep(preload)
      }
    }
  }
  return formatedState
}

export async function asyncDispatch(timeout: number, promise: any[]) {
  return await Promise.race([Promise.all(promise), sleep(timeout)])
}
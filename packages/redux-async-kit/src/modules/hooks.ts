import * as React from 'react'
import * as Redux from 'react-redux'
import { createSelector } from 'reselect'
import { sleep } from 'basic-kit-js'

export function useScopedAction(name: string | string[], action: any, deps: any[] = []) {
  const dispatch = Redux.useDispatch()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const actionCreator = useAsyncCallback(async (...opts: any[]) => {
    const values = name ? { __values__: { scope: name } } : {}
    const promise = dispatch({ ...action(...opts), ...values })
    if (promise instanceof Function) {
      setLoading(true)
      setError(null)
      try {
        await promise()
        // 正常浏览器下，reducer 中的后续操作会阻塞线程，useCurrentCallback 应该拿到的都是最新数据
        // 如果有浏览器不兼容，可以尝试休眠解决
        await sleep(10)
      } catch (e) {
        setError(e)
        throw(e)
      } finally {
        setLoading(false)
      }
    }
  }, deps)
  return [actionCreator, { loading, error }]
}

function createSelectorMemo(selector: any) {
  return () => createSelector(selector, (state: any) => state)
}

export function useScopedSelector(name: string, selector: any) {
  const memoSelector = React.useMemo(createSelectorMemo(selector), [])
  return Redux.useSelector((state: any) => {
    if (!name) {
      return memoSelector(state)
    }
    const scoped = state[name]
    if (scoped) {
      return memoSelector(scoped)
    }
  })
}

export function useCurrentCallback(callback: any, deps: any[] = []) {
  const ref = React.useRef(callback)
  React.useEffect(() => {
    ref.current = callback
  }, deps)
  return ref
}

function callAsyncFunction(fun: any): any {
  if (!fun) {
    return fun
  }
  if (typeof fun === 'function') {
    return (...opts: any) => {
      return callAsyncFunction(fun(...opts))
    }
  }
  if (typeof fun.then === 'function') {
    return async (...opts: any) => {
      try {
        const f = await fun(...opts)
        return callAsyncFunction(f)
      } catch (e) {
        //
      }
    }
  }
  return fun
}

export function useActionCallback(callback: any, deps: any = []) {
  return React.useMemo(() => {
    return callAsyncFunction(callback)
  }, deps)
}

export function useAsyncCallback(callback: any, deps: any = []) {
  return React.useMemo(() => callback, deps)
}

export function useAsyncEffect(effect: any, deps = []) {
  const asyncEffect = useAsyncCallback(async () => {
      await effect()
  }, deps)
  React.useEffect(() => {
      asyncEffect()
  }, [asyncEffect])
}

// export function useActionCallback(callback: any, deps: any = []): any {
//   const [error, setError] = React.useState(null)
//   const promise = React.useMemo(() => {
//     return async (e: any) => {
//       setError(null)
//       try {
//         await callback(e)
//       } catch (e) {
//         setError(e)
//       }
//     }
//   }, deps)
//   return [promise, error]
// }

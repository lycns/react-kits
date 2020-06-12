
import * as React from 'react'
import uuid from 'uuid/v4'

const TRACE_GLOBAL = {} as any
const TRACE_EVENT_MAP = {} as any

(window as any)['SMOEX_DEBUG_TRACE'] = TRACE_GLOBAL

export function useEventTrace(ref: any, map: any, opts: any = {}): any {
  const { context = {}, event = 'click', target } = opts
  const [traceIds] = React.useState<any>(() => {
    const traceMap = {} as any
    for (const key of Object.keys(map)) {
      const traceId = key + '-' + uuid().replace('-', '').slice(0, 8)
      traceMap[key] = (ctx: any) => {
        if (map[key]) {
            TRACE_GLOBAL[traceId] = [ctx, map[key]]
        }
        return traceId
      }
    }
    return traceMap
  })

  React.useEffect(() => {
    if (ref && ref.current) {
      const nodes = ref.current.querySelectorAll('[data-trace]')
      nodes.forEach((node: any) => {
        const { trace: traceId } = node.dataset
        const bindedTrace = !!TRACE_EVENT_MAP[traceId]
        if (bindedTrace) {
          return
        }
        TRACE_EVENT_MAP[traceId] = (e: any) => {
          const [ctx, fun] =  TRACE_GLOBAL[traceId]
          const info = fun({ ...e, ctx })
          console.debug('traceInfo:', info)
          console.log('traceInfo:', info)
          // if (target) {
          //   target(info)
          // }
        }
        node.addEventListener(event, TRACE_EVENT_MAP[traceId])
      });
    }
  }, [])
  return traceIds
}

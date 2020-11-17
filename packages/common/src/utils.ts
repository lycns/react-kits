import * as React from 'react'
import { xArray } from '@basic-kits/js'

export function createLazyComponent(opts: any) {
    const { loader, injector } = opts
    return React.lazy(() => {
      xArray(injector).forEach((inject) => {
        inject()
      })
      return loader()
    })
}
import * as React from 'react'

export function usePreviousWithNull(data: any) {
    const [cache, setCache] = React.useState(data)
    React.useEffect(() => {
      if (data) {
        setCache(data)
      }
    }, [data])
    return data || cache
}

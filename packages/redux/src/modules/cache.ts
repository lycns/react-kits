
const memoryCacheMap = new Map()

export const makeMemoryCache = (key: any, value?: any, opts: any = {}) => {
    if (value) {
        const cacheOpts = {
            time: +new Date(),
            expire: opts.expire,
        }
        memoryCacheMap.set(key, [value, cacheOpts])
        return
    }
    const [cacheValue, cacheOpts = {}] = memoryCacheMap.get(key) || []
    if (cacheValue) {
        const isExpire = cacheOpts.expire && cacheOpts.time + cacheOpts.expire > +new Date()
        if (!isExpire) {
            return cacheValue
        } else {
            memoryCacheMap.delete(key)
        }
    }
    return null
}

export function memoryCache(keys: any, opts?: any) {
    if (typeof keys === 'object') {
        const cacheKeys: any = Object.keys(keys)
        for (const key of cacheKeys) {
            if (!keys[key]) {
                return null
            }
        }
    }
    const key = JSON.stringify(keys)
    const value = makeMemoryCache(key)
    return value || ((data: any) => {
        makeMemoryCache(key, data, opts)
    })
}

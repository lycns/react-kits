import qs from 'qs'
import { BrowserRouter, useLocation } from 'react-router-dom'

export function useUrlQuery() {
    const { search } = useLocation()
    return qs.parse(search, { ignoreQueryPrefix: true })
}

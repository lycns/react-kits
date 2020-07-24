import React from 'react'

import { configureStore, storeInstance } from '../modules/store'
import { Provider } from 'react-redux'
import { createSlice } from '../modules/creator'
import { useAsyncCallback, useAsyncEffect, useScopedAction } from '../modules/hooks'
import { testReducer } from './reducer'
import { testAsyncAction, testAction } from './action'
import { testSelector } from './selectors'
import { testSlice } from './slice'

export default {
    title: 'async slice for ssr'
}

const testSlice2 = createSlice('test2', {
    testReducer,
})
let initState = {}

const initStore = configureStore({
  injector: [
      testSlice.injector,
      testSlice2.injector,
  ]})


testSlice.dispatch(testAsyncAction.getName(10, 1))


setTimeout(() => {
    initState = initStore.getState()
}, 1200);

const BasicTestContainer = () => {
    const [count, setCount] = React.useState(0)
    const [cacheName, name] = testSlice.useSelector(testSelector.testName)
    const [detail] = testSlice.useSelector(testSelector.testDetail)
    const [setName] = testSlice.useAction(testAction.setName)
    const [getName, nameState] = testSlice.useAction(testAsyncAction.getName)
    const [getDetail, detailState] = testSlice.useAction(testAsyncAction.getDetail)
    const [getDetailByCache, detailCacheState] = testSlice.useAction(testAsyncAction.getDetailByCache)
    const [setName2] = testSlice2.useAction(testAction.setName)
    const [name2] = testSlice2.useSelector(testSelector.testName)
    const [setAllName] = useScopedAction(['test', 'test2'], testAction.setName)

    const onSetName = () => {
        setName('ON SET NAME')
    }

    const onSetName2 = () => {
        setName2('ON SET NAME2')
    }

    const onSetNameAll = () => {
        setAllName('ON SET NAME ALL')
    }

    const onGetName = useAsyncCallback(async (e: any) => {
        await getName(count)
        await getDetail()
    }, [count])

    const onGetNameByKeyword = useAsyncCallback((keyword: any) => async (e: any) => {
        await getName(count, keyword)
        await getDetail()
    }, [count])

    const onGetDetailByCache = useAsyncCallback(async (e: any) => {
        await getDetailByCache()
    }, [count])

    const onGetDetail = useAsyncCallback(async (e: any) => {
        await getDetail()
    }, [count])

    // useAsyncEffect(async () => {
    //     await getName(count)
    //     await getDetailByCache()
    // })

    return (
        <div>
            <div>COUNT: {JSON.stringify(count)}</div>
            <div>GET NAME ACTION: {!nameState.loading ? JSON.stringify(name) : 'loading...'}</div>
            <div>NAME: {JSON.stringify(name)}</div>
            <div>CACHE NAME: {cacheName ? cacheName : 'loading...'}</div>
            <div>GET NAME ERROR: {nameState.error && nameState.error.message}</div>
            <div>DETAIL: {JSON.stringify(detail)}</div>
            <div>NAME2: {JSON.stringify(name2)}</div>
            <div style={{ marginTop: '30px'}}>
                <div onClick={() => setCount(x => x + 1)}>ADD COUNT</div>
                <div onClick={onGetName}>ON GET NAME</div>
                <div onClick={onSetName}>ON SET NAME</div>
                <div onClick={onGetNameByKeyword('1')}>ON GET NAME ERROR</div>
                <div onClick={onGetDetail}>ON GET DETAIL</div>
                <div onClick={onGetDetailByCache}>ON GET DETAIL BY CACHE</div>
                <div onClick={onSetName2}>ON SET NAME2</div>
                <div onClick={onSetNameAll}>ON SET NAME ALL</div>
            </div>
        </div>
    )
}

export const Container = () => {
    const [store, setStore] = React.useState<any>()
    React.useEffect(() => {
        setTimeout(() => {
            const x = configureStore({
            injector: [
                testSlice.injector,
                testSlice2.injector,
            ]}, initState)
            setStore(x)
        }, 2000)
    }, [])
    if (!store) {
        return null
    }
    return (
        <Provider store={store}><BasicTestContainer /> </Provider>
    )
}

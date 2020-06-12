import * as React from 'react'
import { createReducer, IReducerMap } from '../utils/react'

const FORM_INITIAL_STATE = 'FORM_INITIAL_STATE'
const FORM_UPDATE_DATA = 'FORM_UPDATE_DATA'
const FORM_SUBMIT_DATA = 'FORM_SUBMIT_DATA'
const FORM_UPDATE_TEST = 'FORM_UPDATE_TEST'
const FORM_CHECK_DATA = 'FORM_CHECK_DATA'
const FORM_CLEAR_TIPS = 'FORM_CLEAR_TIPS'
const FORM_UPDATE_ERROR = 'FORM_UPDATE_ERROR'
const FORM_CLEAR_ERROR = 'FORM_CLEAR_ERROR'

export type IFormData = { [key: string]: string }
export type IFormChecks = { [key: string]: number }
export type IFormTests = { [key: string]: RegExp[] }
export type IFormErrors = { [key: string]: string }

type IFormState = {
  data: IFormData
  checks: IFormChecks
  tests: IFormTests
  errors: IFormErrors
  doSubmit: boolean | Boolean // tslint:disable-line
}

type IFormActions = {
  initial: (name: string) => void
  update: (data: IFormData) => void
  updateTest: (test: IFormTests) => void
  updateError: (error: IFormErrors) => void
  check: (name: string) => void
  submit: () => void
  clearTips: (name: string) => void
  clearError: (name: string) => void
}

const initial = (name: string) => ({ type: FORM_INITIAL_STATE, name })
const update = (data: IFormData) => ({ type: FORM_UPDATE_DATA, data })
const updateTest = (test: IFormTests) => ({ type: FORM_UPDATE_TEST, test })
const check = (name: string) => ({ type: FORM_CHECK_DATA, name })
const submit = () => ({ type: FORM_SUBMIT_DATA })
const clearTips = (name: string) => ({ type: FORM_CLEAR_TIPS, name })
const updateError = (error: IFormErrors) => ({ type: FORM_UPDATE_ERROR, error })
const clearError = (name: string) => ({ type: FORM_CLEAR_ERROR, name })

const initialState: IFormState = {
  data: {},
  checks: {},
  tests: {},
  errors: {},
  doSubmit: false,
}

function asFormDataCheck(value: string = '', test: RegExp[]): number {
  if (!test) {
    return -1
  }
  for (let i = 0; i < test.length; i++) {
    const exp = test[i]
    if (value.match(exp)) {
      return i
    }
  }
  return -1
}

function asFormChecks(data: IFormData, tests: IFormTests): IFormChecks {
  const checks: IFormChecks = {}
  for (const name of Object.keys(data)) {
    const test = tests[name]
    const value = data[name] || ''
    checks[name] = asFormDataCheck(value, test)
  }
  return checks
}

const reducerMap: IReducerMap<IFormState> = (state) => ({
  [FORM_INITIAL_STATE]: ({ name }) => {
    state.data[name] = ''
    state.checks[name] = -1
  },
  [FORM_SUBMIT_DATA]: () => {
    state.checks = asFormChecks(state.data, state.tests)
    // tslint:disable-next-line
    state.doSubmit = new Boolean(true) // 为了更新 doSubmit 的动作，取值时注意使用 valueOf
  },
  [FORM_CHECK_DATA]: ({ name }) => {
    state.checks[name] = asFormDataCheck(state.data[name], state.tests[name])
  },
  [FORM_CLEAR_TIPS]: ({ name }) => {
    state.checks[name] = -1
    state.errors[name] = ''
  },
  [FORM_CLEAR_ERROR]: ({ name }) => {
    state.errors[name] = ''
  },
  [FORM_UPDATE_DATA]: ({ data }) => ({
    ...state,
    data: { ...state.data, ...data },
  }),
  [FORM_UPDATE_TEST]: ({ test }) => ({
    ...state,
    tests: { ...state.tests, ...test },
  }),
  [FORM_UPDATE_ERROR]: ({ error }) => ({
    ...state,
    errors: { ...state.errors, ...error },
  }),
})

const appReducer = createReducer(reducerMap)

export type IFormContext = Omit<IFormState, 'tests'> & IFormActions

export function useInitFormContext(): IFormContext {
  const [state, dispatch] = React.useReducer(appReducer, initialState)
  return {
    data: state.data,
    checks: state.checks,
    errors: state.errors,
    doSubmit: state.doSubmit,
    initial: (name: string) => dispatch(initial(name)),
    update: (data: IFormData) => dispatch(update(data)),
    updateTest: (test: IFormTests) => dispatch(updateTest(test)),
    updateError: (error: IFormErrors) => dispatch(updateError(error)),
    check: (name: string) => dispatch(check(name)),
    submit: () => dispatch(submit()),
    clearTips: (name: string) => dispatch(clearTips(name)),
    clearError: (name: string) => dispatch(clearError(name)),
  }
}

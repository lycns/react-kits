import * as React from 'react'
import { createReducer } from '@react-kits/common'

const APP_TOGGLE_TOAST = 'APP_TOGGLE_TOAST'
const APP_CHNAGE_THEME = 'APP_CHNAGE_THEME'

const toggleToast = (toast: any) => ({ type: APP_TOGGLE_TOAST, toast })
const updateTheme = (theme: string) => ({ type: APP_CHNAGE_THEME, theme })

const initialState = {
  toasts: [],
  theme: '',
}

const appReducer = createReducer(state => ({
  [APP_TOGGLE_TOAST]: ({ toast }) => {
    state.toasts.push(toast)
  },
  [APP_CHNAGE_THEME]: ({ theme }) => {
    state.theme = theme
  },
}))

export function useInitAppContext() {
  const [state, dispatch] = React.useReducer(appReducer, initialState)
  const data = {
    toasts: state.toasts,
    theme: state.theme,
  }
  const actions = {
    toggleToast: (text: any) => dispatch(toggleToast(text)),
    setTheme: (theme: string) => dispatch(updateTheme(theme)),
  }
  return { ...data, ...actions}
}

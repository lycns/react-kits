import * as React from 'react'

const APP_TOGGLE_TOAST = 'APP_TOGGLE_TOAST'
const APP_CHNAGE_THEME = 'APP_CHNAGE_THEME'

const toggleToast = (toast: any) => ({ type: APP_TOGGLE_TOAST, toast })
const updateTheme = (theme: string) => ({ type: APP_CHNAGE_THEME, theme })

const initialState = {
  toasts: [],
  theme: '',
}

const appReducer = (state: any, action: any) => {
  switch (action.type) {
    case APP_TOGGLE_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      }
    case APP_CHNAGE_THEME:
      return {
        ...state,
        theme: action.theme,
      }
  }
  return state
}

export function useInitAppContext() {
  const [state, dispatch] = React.useReducer(appReducer, initialState)
  return {
    toasts: state.toasts,
    theme: state.theme,
    toggleToast: (text: any) => dispatch(toggleToast(text)),
    setTheme: (theme: string) => dispatch(updateTheme(theme)),
  }
}

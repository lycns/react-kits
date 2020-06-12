import * as React from 'react'
import {
  useInitFormContext,
  IFormContext,
  IFormData,
} from '../logics/FormContext'

// @ts-ignore
const FormContext = React.createContext<IFormContext>({})

export const TEST_NOT_NULL = /^$/
export const TEST_NOT_NUMBER = /^[0-9]+$/

export function useFormContext() {
  return React.useContext<IFormContext>(FormContext)
}

export type IFormComponentProps = {
  onSubmit?: (data: IFormData) => void
}

export function enhanceFormComponent<T>(
  WrappedComponent: React.ComponentType<T>,
): React.ComponentType<IFormComponentProps & T> {
  return (props) => {
    const { onSubmit = () => {} } = props
    const formContext = useInitFormContext()
    const { data, checks, errors, doSubmit } = formContext
    React.useEffect(() => {
      let approved = true
      for (const name of Object.keys(checks)) {
        const checked = checks[name] === -1
        if (!checked) {
          approved = false
        }
      }
      for (const name of Object.keys(errors)) {
        const checked = !errors[name]
        if (!checked) {
          approved = false
        }
      }
      if (!approved) {
        return
      }
      if (doSubmit.valueOf()) {
        onSubmit(data)
      }
    }, [doSubmit])
    return (
      <FormContext.Provider value={formContext}>
        <WrappedComponent {...props} />
      </FormContext.Provider>
    )
  }
}

export type IFormInputProps = {
  name: string
  value?: string
  test?: RegExp[]
}

export function enhanceFormInput<T extends IFormInputProps>(
  WrappedComponent: React.ComponentType<T>,
): React.ComponentType<T> {
  return (props) => {
    const { name, test, value } = props
    const { initial, data, updateTest } = useFormContext()
    React.useEffect(() => {
      initial(name)
      if (test) {
        updateTest({ [name]: test })
      }
    }, [])
    return <WrappedComponent {...props} value={value || data[name]} />
  }
}

## react-dom-basic-kit

You can use custom components by hooks simplify.

### Container

this is a base component, you must set it on base dom like `Provider`

```javascript
export const App = () => {
  return (
    <Container>
      { ... }
    </Container>
  )
}
```

### Toast

You can use toast in container

```javascript
export const ToggleToastComponent = () => {
  const toggleToast = useToggleToast({ ... });
  const toggleMessage = () => {
    toggleToast('...')
  }
  return <div onClick={toggleMessage}>Toggle Toast Test</div>
}
```

More examples is in the stories

### Modal

You can use toast in container

```javascript
export const ToggleModalComponent = () => {
  const toggleModal = useToggleModal((mProps: any) => (
    <Modal {...mProps} blankClose>
      <div>Toggle Modal Test</div>
    </Modal>
  ))
  return <div onClick={toggleModal}>Toggle Dialog Modal</div>
}
```

### Theme

```javascript
import styles from './styles/Container.module.scss'
import styles_dark from './styles/Container-dark.module.scss'

function useStyles() {
  return useThemeStyles(styles, { dark: styles_dark })
}

const ThemeingText = () => {
  const cx = useStyles()
  return <div className={cx('test')}>Theme test Text</div>
}

const Comp = () => {
  const { theme, setTheme } = useAppContext()
  const toDark = () => {
    setTheme('dark')
  }
  const clearTheme = () => {
    setTheme('')
  }
  return (...)
}

```

### Form

```javascript
const TFormInput: React.FC<any> = (props: any) => {
  const { name, tips } = props
  const { update, checks, clearCheck, check } = useFormContext()
  const error = checks[name]
  return (
    <div>
      <input
        onChange={(x) => update({ [name]: x.target.value })}
        onFocus={() => clearCheck(name)}
        onBlur={() => check(name)}
      />
      {error > -1 && tips[error]}
    </div>
  )
}

const FormInput = enhanceFormInput(TFormInput)

const TForm: React.FC<any> = (props) => {
  const { children } = props
  const { data, submit } = useFormContext()
  return (
    <form>
      <div>In Form1: {JSON.stringify(data)}</div>
      {children}
      <div onClick={submit}>SUBMIT</div>
    </form>
  )
}

export const Form1 = enhanceFormComponent(TForm)

export const FormTest = (props: any) => {
  const onSubmit = (data: any) => {
    console.log('submit:', data)
  }
  return (
    <Form1 onSubmit={onSubmit}>
      <div>Test Form</div>
      <FormInput
        name="x1"
        test={[TEST_NOT_NULL, TEST_NOT_NUMBER]}
        tips={['not null', 'not number']}
      />
      <FormInput name="x2" test={[TEST_NOT_NUMBER]} tips={['not number']} />
    </Form1>
  )
}
```

More examples is in the stories

Thanks

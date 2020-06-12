import * as React from 'react'

type IInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  onChange?: (target: HTMLInputElement) => void
}

export const Input: React.FC<IInputProps> = (props) => {
  const { onChange, value, ...otherProps } = props
  const [typing, setTyping] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      if (onChange && !typing) {
        onChange(e.target)
      }
    },
    [typing],
  )
  React.useEffect(() => {
    if (!typing) {
      setInputValue(value)
    }
  }, [value])
  React.useEffect(() => {
    if (onChange && !typing && inputRef.current) {
      onChange(inputRef.current)
    }
  }, [typing])
  return (
    <input
      {...otherProps}
      ref={inputRef}
      value={inputValue || ''}
      onChange={onInputChange}
      onCompositionStart={() => setTyping(true)}
      onCompositionEnd={() => setTyping(false)}
    />
  )
}

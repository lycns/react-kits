import classNames from 'classnames'

type IThemeStylesMap = {
  [key: string]: any
}

export function transformStyles(styles: any, opts: any = {}) {
  const { themes = {}, currentTheme = '' } = opts
  const themeStyle = themes[currentTheme] || {}
  const classMapper = (key: string) =>
    [styles[key] || key, themeStyle[key]].filter(Boolean).join(' ')

  return (...classOpts: any[]) => {
    const className = classNames(classOpts)
    return className
      .split(' ')
      .map(classMapper)
      .join(' ')
  }
}

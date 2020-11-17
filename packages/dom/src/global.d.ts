/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  const useStyle: () => { readonly [key: string]: string }
  export { useStyle }
  export default classes
}

declare module '*.scss' {
  const scss: { [key: string]: string }
  export = scss
}

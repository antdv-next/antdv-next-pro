// cronstrue 只给核心包发了类型，`locales/*.js`（UMD）没有声明文件。
declare module 'cronstrue/locales/*.js' {
  const localeModule: unknown
  export default localeModule
}

const mergeProperties = (target, source) => {
  Object.keys(source).forEach(key => {
    if (key.startsWith("class-")) return
    if (!Object.hasOwn(target, key)) target[key] = source[key]
  })
}

export { mergeProperties }

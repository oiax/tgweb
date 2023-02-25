const mergeProperties = (target, source) => {
  Object.keys(source).forEach(key => {
    if (!Object.hasOwn(target, key)) target[key] = source[key]
  })
}

export { mergeProperties }

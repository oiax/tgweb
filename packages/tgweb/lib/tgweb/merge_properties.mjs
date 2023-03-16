const mergeProperties = (target, source) => {
  const properties = {}

  Object.keys(source).forEach(key => {
    if (!key.startsWith("class-")) properties[key] = source[key]
  })

  Object.keys(target).forEach(key => {
    properties[key] = target[key]
  })

  return properties
}

export { mergeProperties }

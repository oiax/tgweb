const tableNames1 = ["data", "meta", "http-equiv", "meta-property", "link"]
const tableNames2 = ["data", "style", "meta", "http-equiv", "meta-property", "link"]

const mergeProperties = (target, source) => {
  const properties = {}

  Object.keys(source).forEach(key => {
    if (key === "style") return
    else if (tableNames1.includes(key)) {
      if (properties[key] === undefined) properties[key] = {}
      Object.assign(properties[key], source[key])
    }
    else {
      properties[key] = source[key]
    }
  })

  Object.keys(target).forEach(key => {
    if (tableNames2.includes(key)) {
      if (properties[key] === undefined) properties[key] = {}
      Object.assign(properties[key], target[key])
    }
    else {
      properties[key] = target[key]
    }
  })

  return properties
}

export { mergeProperties }

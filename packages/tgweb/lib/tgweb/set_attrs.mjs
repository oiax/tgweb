const setAttrs = element => {
  const attrs = {}

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i]
    attrs[attr.name] = element.attributes.getNamedItem(attr.name).value
  }

  element.attrs = attrs
}

export { setAttrs }

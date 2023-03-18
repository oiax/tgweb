const setAttrs = element => {
  const attrs = {data: {}}

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i]
    const value = element.attributes.getNamedItem(attr.name).value

    if (attr.name == "data") return

    if (attr.name.startsWith("data-")) {
      const dataName = attr.name.slice(5)
      attrs.data[dataName] = value
    }
    else {
      attrs[attr.name] = value
    }
  }

  element.attrs = attrs
}

export { setAttrs }

const getTgAttributes = element => {
  const attrs = {}

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i]

    if (attr.name.startsWith("tg-")) {
      const name = attr.name.slice(3)
      attrs[name] = element.attributes.getNamedItem(attr.name).value
    }
  }

  return attrs
}

export { getTgAttributes }

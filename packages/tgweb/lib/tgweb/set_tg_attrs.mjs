const setTgAttrs = element => {
  const attrs = {}

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i]
    if (!attr.name.startsWith("tg-")) continue

    const parts = attr.name.split("-")

    if (parts.includes("")) continue

    if (parts.length == 2) {
      attrs[parts[1]] = element.attributes.getNamedItem(attr.name).value
    }
    else {
      const key = parts.slice(1).join("-")
      attrs[key] = element.attributes.getNamedItem(attr.name).value
    }
  }

  element.tgAttrs = attrs
}

export { setTgAttrs }

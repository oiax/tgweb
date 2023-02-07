const setTgAttrs = element => {
  const attrs = {data: {}}

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i]
    if (!attr.name.startsWith("tg-")) continue

    const parts = attr.name.split("-")

    if (parts.includes("")) continue

    if (parts.length == 2) {
      attrs[parts[1]] = element.attributes.getNamedItem(attr.name).value
    }
    else if (parts.length == 3 && parts[1] == "data") {
      attrs.data[parts[2]] = element.attributes.getNamedItem(attr.name).value
    }
    else {
      const key = parts.slice(1).join("-")
      attrs[key] = element.attributes.getNamedItem(attr.name).value
    }
  }

  removeSpecialAttributes(element)

  element.tgAttrs = attrs
}

const removeSpecialAttributes = element => {
  const names = []

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i]
    if (attr.name.match(/^tg-/)) names.push(attr.name)
  }

  names.forEach(n => element.attributes.removeNamedItem(n))
}

export { setTgAttrs }

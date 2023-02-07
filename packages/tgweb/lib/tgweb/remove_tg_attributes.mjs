const removeTgAttributes = element => {
  const names = []

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i]
    if (attr.name.match(/^tg-/)) names.push(attr.name)
  }

  names.forEach(n => element.attributes.removeNamedItem(n))

  Array.from(element.children).forEach(child => removeTgAttributes(child))
}

export { removeTgAttributes }

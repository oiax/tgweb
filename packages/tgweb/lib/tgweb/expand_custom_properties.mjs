import { setAttrs } from "./set_attrs.mjs"

const expandCustomProperties = (node, frontMatter) => {
  if (node.nodeType !== 1) return

  setAttrs(node)

  Object.keys(node.attrs).forEach(key => {
    if (key === "class") return

    const value = node.attrs[key]

    const expanded = value.replaceAll(/\$\{(\w+(?:-\w+)*)\}/g, (_, name) => {
      const propName = `data-${name}`
      if (Object.hasOwn(frontMatter, propName)) return frontMatter[propName]
      else return ""
    })

    if (expanded === "")
      node.removeAttribute(key)
    else
      node.setAttribute(key, expanded)
  })

  Array.from(node.childNodes).forEach(child => expandCustomProperties(child, frontMatter))
}

export { expandCustomProperties }

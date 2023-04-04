const expandClassAliases = (node, frontMatter) => {
  if (node.constructor.name !== "Element") return
  if (node.attribs.class) doExpandClassAliases(node, frontMatter)
  node.children.forEach(child => expandClassAliases(child, frontMatter))
}

const doExpandClassAliases = (node, frontMatter) => {
  if (frontMatter.style === undefined) return

  node.attribs.class = node.attribs.class.replaceAll(/\$\{(\w+(?:-\w+)*)\}/g, (_, key) => {
    if (Object.hasOwn(frontMatter.style, key)) {
      const value = frontMatter.style[key]

      if (typeof value === "string") {
        return value.trim().replaceAll(/\n/g, " ").replace(/ +/, " ")
      }
      else {
        return `\${${key}}`
      }
    }
    else return `\${${key}}`
  })
}

export { expandClassAliases }

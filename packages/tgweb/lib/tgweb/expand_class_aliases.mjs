const expandClassAliases = (node, frontMatter) => {
  if (node.constructor.name !== "Element") return
  if (node.attribs.class) doExpandClassAliases(node, frontMatter)
  node.children.forEach(child => expandClassAliases(child, frontMatter))
}

const doExpandClassAliases = (node, frontMatter) => {
  node.attribs.class = node.attribs.class.replaceAll(/\$\{(\w+(?:-\w+)*)\}/g, (_, alias) => {
    const key = `class-${alias}`
    if (Object.hasOwn(frontMatter, key)) return frontMatter[key]
    else return `\${${alias}}`
  })
}

export { expandClassAliases }

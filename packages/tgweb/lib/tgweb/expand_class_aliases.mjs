const expandClassAliases = (node, frontMatter) => {
  if (node.constructor.name !== "Element") return
  if (node.attribs["tg:class"] !== undefined) doExpandClassAliases(node, frontMatter)
  node.children.forEach(child => expandClassAliases(child, frontMatter))
}

const doExpandClassAliases = (node, frontMatter) => {
  if (frontMatter.style === undefined) return

  const expanded = frontMatter.style[node.attribs["tg:class"]]

  if (expanded === undefined || expanded === "") return

  if (typeof node.attribs.class === "string") {
    node.attribs.class = node.attribs.class + " " + expanded
  }
  else {
    node.attribs.class = expanded
  }

  delete node.attribs["tg:class"]
}

export { expandClassAliases }

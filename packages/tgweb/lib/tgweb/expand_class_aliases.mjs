const expandClassAliases = (root, frontMatter) => {
  if (root.className) doExpandClassAliases(root, frontMatter)

  root.querySelectorAll("[class]").forEach(elem => {
    doExpandClassAliases(elem, frontMatter)
  })
}

const doExpandClassAliases = (elem, frontMatter) => {
  const htmlClass = elem.getAttribute("class")

  const expanded = htmlClass.replaceAll(/\$\{(\w+(?:-\w+)*)\}/g, (_, alias) => {
    const key = `class-${alias}`
    if (Object.hasOwn(frontMatter, key)) return frontMatter[key]
    else return `\${${alias}}`
  })

  elem.setAttribute("class", expanded)
}

export { expandClassAliases }

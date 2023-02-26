const expandClassAliases = (frontMatter, root) => {
  if (root.className) doExpandClassAliases(frontMatter, root)

  root.querySelectorAll("[class]").forEach(elem => {
    doExpandClassAliases(frontMatter, elem)
  })
}

const doExpandClassAliases = (frontMatter, elem) => {
  const htmlClass = elem.getAttribute("class")

  const expanded = htmlClass.replaceAll(/\$\{(\w+(?:-\w+)*)\}/g, (_, alias) => {
    const key = `class-${alias}`
    if (Object.hasOwn(frontMatter, key)) return frontMatter[key]
    else return `\${${alias}}`
  })

  elem.setAttribute("class", expanded)
}

export { expandClassAliases }

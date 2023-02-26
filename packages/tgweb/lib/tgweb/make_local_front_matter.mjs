const makeLocalFrontMatter = (template, wrapperOrLayout) => {
  const frontMatter = {}

  Object.keys(template.frontMatter).forEach(key => {
    if (Object.hasOwn(template.frontMatter, key)) {
      frontMatter[key] = template.frontMatter[key]
    }
  })

  Object.keys(wrapperOrLayout.frontMatter).forEach(key => {
    if (Object.hasOwn(wrapperOrLayout.frontMatter, key) && !Object.hasOwn(frontMatter, key)) {
      frontMatter[key] = wrapperOrLayout.frontMatter[key]
    }
  })

  return frontMatter
}

export { makeLocalFrontMatter }

const normalizeFrontMatter = frontMatter => {
  Object.keys(frontMatter).forEach(key => {
    if (key.startsWith("class-")) {
      const value = frontMatter[key]

      if (Array.isArray(value)) {
        frontMatter[key] = value.join(" ")
      }
    }
  })
}
export { normalizeFrontMatter }

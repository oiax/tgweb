const normalizeFrontMatter = frontMatter => {
  const tableNames = ["main", "data", "style"]

  tableNames.forEach(tableName => {
    if (typeof frontMatter[tableName] !== "object") frontMatter[tableName] = {}
  })

  Object.keys(frontMatter.style).forEach(key => {
    if (typeof frontMatter.style[key] !== "string") delete frontMatter.style[key]

    frontMatter.style[key] =
      frontMatter.style[key].replaceAll(/(\S+)\s*\{([^}]+)\}/g, (_, modifier, tokens) =>
        tokens.trim().split(/\s+/).map(token => `${modifier}:${token}`).join(" ")
      )
      .trim().replaceAll(/\s+/g, " ")
  })

  if (! Number.isInteger(frontMatter.main.layer)) frontMatter.main.layer = 0
  if (frontMatter.main.layer < 0) frontMatter.main.layer = 0

  return frontMatter
}

export { normalizeFrontMatter }

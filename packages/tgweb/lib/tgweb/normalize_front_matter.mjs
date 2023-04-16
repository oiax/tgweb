const normalizeFrontMatter = frontMatter => {
  if (typeof frontMatter.style !== "object") return

  Object.keys(frontMatter.style).forEach(key => {
    if (typeof frontMatter.style[key] !== "string") delete frontMatter.style[key]

    frontMatter.style[key] =
      frontMatter.style[key].replaceAll(/(\S+)\s*\{([^}]+)\}/g, (_, modifier, tokens) =>
        tokens.trim().split(/\s+/).map(token => `${modifier}:${token}`).join(" ")
      )
      .trim().replaceAll(/\s+/g, " ")
  })
}
export { normalizeFrontMatter }

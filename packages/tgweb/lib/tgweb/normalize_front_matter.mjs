const normalizeFrontMatter = frontMatter => {
  if (typeof frontMatter.style !== "object") return

  Object.keys(frontMatter.style).forEach(key => {
    if (typeof frontMatter.style[key] !== "string") delete frontMatter.style[key]

    frontMatter.style[key] =
      frontMatter.style[key].replaceAll(/\[([^\]]+)\]\s*\{([^}]+)\}/g, (_, selector, tokens) =>
        tokens.trim().split(/\s+/).map(token => `[${selector}]:${token}`).join(" ")
      )
      .trim().replaceAll(/\s+/g, " ")
  })
}
export { normalizeFrontMatter }

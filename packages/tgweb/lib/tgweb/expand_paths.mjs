const expandPaths = frontMatter => {
  Object.keys(frontMatter).forEach(key => {
    const value = frontMatter[key]

    if (typeof value === "string") {
      const converted = value.replaceAll(/%\{([^}]+)\}/g, (_, path) =>
        getUrlPrefix(frontMatter) + path
      )

      frontMatter[key] = converted
    }
  })
}

const getUrlPrefix = (frontMatter) => {
  const scheme = frontMatter["scheme"]
  const host = frontMatter["host"]
  const port = frontMatter["port"]

  if (scheme === "http") {
    if (port === 80) {
      return `http://${host}`
    }
    else {
      return `http://${host}:${port}`
    }
  }
  else if (scheme === "https") {
    if (port === 443) {
      return `https://${host}`
    }
    else {
      return `https://${host}:${port}`
    }
  }
}

export { expandPaths }

const setUrlProperty = (frontMatter, siteData, path) => {
  const scheme = siteData.properties["scheme"]
  const host = siteData.properties["host"]
  const port = siteData.properties["port"]

  let converted = path.replace(/^src\//, "").replace(/^pages\//, "")
  if (converted === "index.html") converted = ""
  converted = converted.replace(/\/index.html$/, "/")

  if (scheme === "http") {
    if (port === 80) {
      frontMatter.url = `http://${host}/${converted}`
    }
    else {
      frontMatter.url = `http://${host}:${port}/${converted}`
    }
  }
  else if (scheme === "https") {
    if (port === 443) {
      frontMatter.url = `https://${host}/${converted}`
    }
    else {
      frontMatter.url = `https://${host}:${port}/${converted}`
    }
  }
}

export { setUrlProperty }

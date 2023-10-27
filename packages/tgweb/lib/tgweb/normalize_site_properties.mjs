const normalizeSiteProperties = properties => {
  const tableNames = ["main", "data", "font", "meta", "http-equiv", "meta-property", "link"]

  tableNames.forEach(tableName => {
    if (typeof properties[tableName] !== "object") properties[tableName] = {}
  })

  if (typeof properties.font["google-fonts"] !== "object") properties.font["google-fonts"] = {}

  if (properties.main.scheme === "http" && properties.main.port === 80)
    properties.main["root-url"] = `http://${properties.main.host}/`
  else if (properties.scheme === "https" && properties.main.port === 443)
    properties.main["root-url"] = `https://${properties.main.host}/`
  else
    properties.main["root-url"] =
      `${properties.main.scheme}://${properties.main.host}:${properties.main.port}/`

  return properties
}

export { normalizeSiteProperties }

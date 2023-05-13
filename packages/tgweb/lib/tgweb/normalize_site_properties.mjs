const normalizeSiteProperties = properties => {
  const tableNames = ["data", "font", "meta", "http-equiv", "meta-property", "link"]

  tableNames.forEach(tableName => {
    if (typeof properties[tableName] !== "object") properties[tableName] = {}
  })

  if (typeof properties.font["google-fonts"] !== "object") properties.font["google-fonts"] = {}

  if (properties.scheme === "http" && properties.port === 80)
    properties["root-url"] = `http://${properties.host}/`
  else if (properties.scheme === "https" && properties.port === 443)
    properties["root-url"] = `https://${properties.host}/`
  else
    properties["root-url"] =
      `${properties.scheme}://${properties.host}:${properties.port}/`
}

export { normalizeSiteProperties }

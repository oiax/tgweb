const getTag = element => {
  element.attrs["filter"]

  if (element.attrs["filter"]) {
    const re = /^(tag):(.+)$/
    const md = re.exec(element.attrs["filter"])
    if (md) return md[2]
  }
}

export default getTag

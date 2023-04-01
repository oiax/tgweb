const getWrapper = (siteData, path) => {
  const dirParts = path.split("/")
  dirParts.pop()

  for(let i = dirParts.length; i > 0; i--) {
    const dir = dirParts.slice(0, i).join("/")
    const wrapperPath = `${dir}/_wrapper.html`

    const wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)
    if (wrapper) return wrapper
  }
}

export { getWrapper }

import * as PATH from "path"

const getWrapper = (siteData, path) => {
  const dirParts = path.split(PATH.sep)
  dirParts.pop()

  for(let i = dirParts.length; i > 0; i--) {
    const dir = dirParts.slice(0, i).join(PATH.sep)
    const wrapperPath = PATH.join(dir, "_wrapper.html")

    const wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)
    if (wrapper) return wrapper
  }
}

export { getWrapper }

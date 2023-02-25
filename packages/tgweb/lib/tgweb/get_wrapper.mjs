import * as PATH from "path"

const getWrapper = (template, siteData) => {
  const parts = template.path.split(PATH.sep)
  parts.pop()

  for(let i = parts.length; i >= 0; i--) {
    const dir = parts.slice(i).join(PATH.sep)
    const parentDir = template.type === "page" ? "pages" : "articles"
    const wrapperPath = PATH.join(parentDir, dir, "_wrapper.html")
    const wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)
    if (wrapper) return wrapper
  }
}

export { getWrapper }

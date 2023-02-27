import * as PATH from "path"
import { slash } from "./slash.mjs"

const getWrapper = (siteData, path) => {
  const dirParts = slash(path).split(PATH.posix.sep)
  dirParts.pop()

  for(let i = dirParts.length; i > 0; i--) {
    const dir = dirParts.slice(0, i).join(PATH.posix.sep)
    const wrapperPath = slash(PATH.join(dir, "_wrapper.html"))

    const wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)
    if (wrapper) return wrapper
  }
}

export { getWrapper }

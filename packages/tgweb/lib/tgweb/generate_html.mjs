import getType from "./get_type.mjs"
import generationFuncs from "./generation_funcs.mjs"

const generateHTML = (path, siteData) => {
  const type = getType(path)

  if (typeof generationFuncs[type] === "function") return generationFuncs[type](path, siteData)
}

export default generateHTML

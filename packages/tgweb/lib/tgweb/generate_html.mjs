import getType from "./get_type.mjs"
import generationFuncs from "./generation_funcs.mjs"
import { renderPage } from "./render_page.mjs"

const generateHTML = (path, siteData) => {
  const type = getType(path)

  if (type === "page") return renderPage(path, siteData)
  else if (type === "article") return generationFuncs["article"](path, siteData)
}

export default generateHTML

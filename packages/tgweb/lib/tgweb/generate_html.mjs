import getType from "./get_type.mjs"
import { renderPage } from "./render_page.mjs"
import { renderArticle } from "./render_article.mjs"

const generateHTML = (path, siteData) => {
  const type = getType(path)

  if (type === "page") return renderPage(path, siteData)
  else if (type === "article") return renderArticle(path, siteData)
}

export default generateHTML

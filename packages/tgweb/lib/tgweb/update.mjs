import * as PATH from "path"
import fs from "fs"
import { updateSiteData } from "./get_site_data.mjs"
import getType from "./get_type.mjs"
import generateHTML from "./generate_html.mjs"

const update = (path, siteData) => {
  updateSiteData(siteData, path)

  const type = getType(path)

  if (type === "page" || type === "article") {
    updateHTML(path, siteData)
  }
  else if (type == "site.yml") {
    siteData.pages.forEach(page => updateHTML("src/pages/" + page.path, siteData))
    siteData.articles.forEach(article => updateHTML("src/articles/" + article.path, siteData))
  }
  else {
    const name = path.replace(/^src\//, "").replace(/\.html$/, "")

    siteData.pages
      .filter(page => page.dependencies.includes(name))
      .forEach(page => updateHTML("src/pages/" + page.path, siteData))

    siteData.articles
      .filter(article => article.dependencies.includes(name))
      .forEach(article => updateHTML("src/articles/" + article.path, siteData))
  }
}

const updateHTML = (path, siteData) => {
  const html = generateHTML(path, siteData)

  if (html !== undefined) {
    const targetPath = path.replace(/^src\//, "dist/").replace(/^dist\/pages\//, "dist/")
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(targetPath, html)
  }
}

export default update

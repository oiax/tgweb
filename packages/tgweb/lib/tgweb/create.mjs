import * as PATH from "path"
import fs from "fs"
import { updateSiteData } from "./update_site_data.mjs"
import generateHTML from "./generate_html.mjs"
import getType from "./get_type.mjs"
import { updateHTML } from "./update_html.mjs"

const create = (path, siteData) => {
  const dirname = PATH.dirname(path)

  if (dirname.startsWith("src/images") || dirname.startsWith("src/audios")) {
    const targetPath = path.replace(/^src\//, "dist/")
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.copyFileSync(path, targetPath)
  }
  else {
    updateSiteData(siteData, path)
    const html = generateHTML(path, siteData)

    if (html !== undefined) {
      const targetPath = path.replace(/^src\//, "dist/").replace(/^dist\/pages\//, "dist/")
      const targetDir = PATH.dirname(targetPath)

      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
      fs.writeFileSync(targetPath, html)

      if (process.env.VERBOSE) console.log(`Created ${path}.`)
    }

    const type = getType(path)
    const name = path.replace(/^src\//, "").replace(/\.html$/, "")

    if (type === "page") return

    if (type === "site.yml") {
      siteData.pages.forEach(page => updateHTML("src/pages/" + page.path, siteData))
      siteData.articles.forEach(article => updateHTML("src/articles/" + article.path, siteData))
    }
    else {
      siteData.pages
        .filter(page => page.dependencies.includes(name))
        .forEach(page => updateHTML("src/pages/" + page.path, siteData))

      siteData.articles
        .filter(article => article.dependencies.includes(name))
        .forEach(article => updateHTML("src/articles/" + article.path, siteData))
    }
  }
}

export { create }

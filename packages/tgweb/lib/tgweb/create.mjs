import * as PATH from "path"
import { slash } from "./slash.mjs"
import fs from "fs"
import { updateSiteData } from "./update_site_data.mjs"
import generateHTML from "./generate_html.mjs"
import getType from "./get_type.mjs"
import { updateHTML } from "./update_html.mjs"
import { generateTailwindConfig } from "./generate_tailwind_config.mjs"

const create = (path, siteData) => {
  const posixPath = slash(path)
  const dirname = PATH.dirname(posixPath)

  if (dirname.startsWith("src/images") || dirname.startsWith("src/audios")) {
    const distPath = posixPath.replace(/^src\//, "dist/")
    const targetPath = PATH.resolve(distPath)
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.copyFileSync(posixPath, targetPath)
  }
  else {
    updateSiteData(siteData, posixPath)
    const html = generateHTML(posixPath, siteData)

    if (html !== undefined) {
      const distPath = posixPath.replace(/^src\//, "dist/").replace(/^dist\/pages\//, "dist/")
      const targetPath = PATH.resolve(distPath)
      const targetDir = PATH.dirname(targetPath)

      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
      fs.writeFileSync(targetPath, html)

      if (process.env.VERBOSE) console.log(`Created ${distPath}.`)
    }

    const type = getType(posixPath)
    const name = posixPath.replace(/^src\//, "").replace(/\.html$/, "")

    if (type === "page") return

    if (type === "site.yml") {
      siteData.pages.forEach(page => updateHTML("src/pages/" + page.path, siteData))
      siteData.articles.forEach(article => updateHTML("src/articles/" + article.path, siteData))
    }
    else if (type === "color_scheme.yml") {
      const tailwindConfig = generateTailwindConfig(PATH.dirname(posixPath))
      if (tailwindConfig) fs.writeFileSync("tailwind.config.js", tailwindConfig)
      if (process.env.VERBOSE) console.log(`Updated tailwind.config.js`)
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

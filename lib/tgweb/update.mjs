import * as PATH from "path"
import fs from "fs"
import { updateSiteData } from "./get_site_data.mjs"
import getType from "./get_type.mjs"
import generateHTML from "./generate_html.mjs"

const update = function(path, siteData) {
  updateSiteData(siteData, path)

  const type = getType(PATH.dirname(path))

  if (type == "page") {
    updateHTML(path, siteData)
  }
  else {
    const name = path.replace(/^src\//, "").replace(/\.html$/, "")

    siteData.pages
      .filter(page => page.dependencies.includes(name))
      .forEach(page => updateHTML("src/" + page.filename, siteData))
  }
}

const updateHTML = function(path, siteData) {
  const html = generateHTML(path, siteData)

  if (html !== undefined) {
    const targetPath = path.replace(/^src\//, "dist/")
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(targetPath, html)
  }
}

export default update

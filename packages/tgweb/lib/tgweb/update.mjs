import { slash } from "./slash.mjs"
import { updateSiteData } from "./update_site_data.mjs"
import getType from "./get_type.mjs"
import { updateHTML } from "./update_html.mjs"
import { dbg, pp } from "./debugging.mjs"
import * as PATH from "path"
import fs from "fs"
import { generateTailwindConfig } from "./generate_tailwind_config.mjs"
import { getWrapper } from "./get_wrapper.mjs"

// Prevent warnings when functions dbg and pp are not used.
if (dbg === undefined) { dbg() }
if (pp === undefined) { pp() }

const update = (path, siteData) => {
  const posixPath = slash(path)
  updateSiteData(siteData, posixPath)

  const type = getType(posixPath)

  if (type === "page") {
    updateHTML(posixPath, siteData)
  }
  else if (type === "article") {
    const article =
      siteData.articles.find(article => "src/articles/" + article.path === posixPath)

    updateArticle(article, siteData)

    const name = posixPath.replace(/^src\//, "").replace(/\.html$/, "")

    siteData.pages
      .filter(page => page.dependencies.includes(name))
      .forEach(page => updateHTML("src/pages/" + page.path, siteData))
  }
  else if (type == "site.yml") {
    siteData.pages.forEach(page => updateHTML("src/pages/" + page.path, siteData))
    siteData.articles.forEach(article => updateArticle(article, siteData))
  }
  else if (type == "color_scheme.yml") {
    const tailwindConfig = generateTailwindConfig(PATH.dirname(posixPath))
    if (tailwindConfig) fs.writeFileSync("tailwind.config.js", tailwindConfig)
    if (process.env.VERBOSE) console.log(`Updated tailwind.config.js`)
  }
  else {
    const name = posixPath.replace(/^src\//, "").replace(/\.html$/, "")

    siteData.pages
      .filter(page => page.dependencies.includes(name))
      .forEach(page => updateHTML("src/pages/" + page.path, siteData))

    siteData.articles
      .filter(article => article.dependencies.includes(name))
      .forEach(article => updateArticle(article, siteData))
  }
}

const updateArticle = (article, siteData) => {
  const wrapper = getWrapper(siteData, "articles/" + article.path)

  if (wrapper && wrapper.frontMatter["embedded-only"] === true) return
  if (article.frontMatter["embedded-only"] === true) return

  updateHTML("src/articles/" + article.path, siteData)
}

export { update }

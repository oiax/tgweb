import * as PATH from "path"
import { slash } from "../utils/slash.mjs"
import fs from "fs"
import { updateSiteData } from "./update_site_data.mjs"
import { renderWebPage } from "./render_web_page.mjs"
import getType from "./get_type.mjs"
import { updateHTML } from "./update_html.mjs"
import { setDependencies } from "./set_dependencies.mjs"
import { generateTailwindConfig } from "./generate_tailwind_config.mjs"
import render from "dom-serializer"
import pretty from "pretty"

const create = (path, siteData) => {
  const posixPath = slash(path)
  const type = getType(posixPath)

  const dirname = PATH.dirname(posixPath)

  if (dirname.startsWith("src/images") || dirname.startsWith("src/animations") ||
      dirname.startsWith("src/audios")) {
    const distPath = posixPath.replace(/^src\//, "dist/")
    const targetPath = PATH.resolve(distPath)
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.copyFileSync(posixPath, targetPath)
  }
  else {
    updateSiteData(siteData, posixPath)

    if (type === "site.toml") {
      siteData.pages.forEach(page => updateHTML(`src/${page.path}`, siteData))
      siteData.articles.forEach(article => updateHTML(`src/${article.path}`, siteData))
      return
    }
    else if (type === "color_scheme.toml") {
      const tailwindConfig = generateTailwindConfig(PATH.dirname(posixPath))
      if (tailwindConfig) fs.writeFileSync("tailwind.config.js", tailwindConfig)
      if (process.env.VERBOSE) console.log(`Updated tailwind.config.js`)
      return
    }
    else if (type === "page") {
      const page = siteData.pages.find(page => "src/" + page.path === posixPath)

      if (siteData.options["buildDrafts"] !== true && page.frontMatter.main &&
          page.frontMatter.main["draft"] === true) return

      const dom = renderWebPage(posixPath, siteData)
      createHTML(posixPath, dom)
      return
    }
    else if (type === "article") {
      const article = siteData.articles.find(article => "src/" + article.path === posixPath)
      if (siteData.options["buildDrafts"] !== true && article.frontMatter.main &&
          article.frontMatter.main["draft"] === true) return

      const dom = renderWebPage(posixPath, siteData)

      if (dom !== undefined) createHTML(posixPath, dom)
    }

    const name = posixPath.replace(/^src\//, "").replace(/\.(html|toml)$/, "")

    siteData.segments.forEach(s => setDependencies(s, siteData))
    siteData.articles.forEach(a => setDependencies(a, siteData))
    siteData.pages.forEach(p => setDependencies(p, siteData))

    siteData.articles
      .filter(article => article.dependencies.includes(name))
      .forEach(article => updateHTML("src/" + article.path, siteData))

    siteData.pages
      .filter(page => page.dependencies.includes(name))
      .forEach(page => updateHTML("src/" + page.path, siteData))
  }
}

const createHTML = (posixPath, dom) => {
  const html = pretty(render(dom, {encodeEntities: false}), {ocd: true})
  const distPath = posixPath.replace(/^src\//, "dist/").replace(/^dist\/pages\//, "dist/")
  const targetPath = PATH.resolve(distPath)
  const targetDir = PATH.dirname(targetPath)

  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
  fs.writeFileSync(targetPath, "<!DOCTYPE html>\n")
  fs.appendFileSync(targetPath, html)

  if (process.env.VERBOSE) console.log(`Created ${distPath}.`)
}

export { create }

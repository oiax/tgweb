import { slash } from "../utils/slash.mjs"
import { updateSiteData } from "./update_site_data.mjs"
import getType from "./get_type.mjs"
import { updateHTML } from "./update_html.mjs"
import * as PATH from "path"
import fs from "fs"
import { generateTailwindConfig } from "./generate_tailwind_config.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { setDependencies } from "./set_dependencies.mjs"
import { protectedFiles } from "./protected_files.mjs"

const update = (path, siteData) => {
  let posixPath = slash(path)

  if (protectedFiles.includes(posixPath.replace(/^src\//, ""))) return

  updateSiteData(siteData, posixPath)

  let type = getType(posixPath)
  const dirname = PATH.dirname(posixPath)


  if (dirname.startsWith("src/images") || dirname.startsWith("src/animations") ||
      dirname.startsWith("src/audios") || dirname.startsWith("src/css") ||
      dirname.startsWith("src/js")) {
    const distPath = posixPath.replace(/^src\//, "dist/")
    const targetPath = PATH.resolve(distPath)
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.copyFileSync(posixPath, targetPath)
    return
  }
  else if (dirname.startsWith("src/shared_css") || dirname.startsWith("src/shared_js")) {
    const assetPath = posixPath.replace(/^src\/shared_/, "src/")

    if (fs.existsSync(assetPath)) return

    const distPath = assetPath.replace(/^src\//, "dist/")
    const targetPath = PATH.resolve(distPath)
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.copyFileSync(posixPath, targetPath)
    return
  }

  if (type === "front_matter_file") {
    posixPath = posixPath.replace(/\.toml$/, ".html")

    if (!fs.existsSync(posixPath)) return

    type = getType(posixPath)
  }

  if (type === "site.toml") {
    siteData.pages.forEach(page => updateHTML("src/" + page.path, siteData))
    siteData.articles.forEach(article => updateArticle(article, siteData))
  }
  else if (type === "color_scheme.toml") {
    const tailwindConfig = generateTailwindConfig(PATH.dirname(posixPath))
    if (tailwindConfig) fs.writeFileSync("tailwind.config.js", tailwindConfig)
    if (process.env.VERBOSE) console.log(`Updated tailwind.config.js`)
  }
  else if (type === "page") {
    updateHTML(posixPath, siteData)
  }
  else if (type === "article") {
    const article =
      siteData.articles.find(article => "src/" + article.path === posixPath)

    updateArticle(article, siteData)

    const name = posixPath.replace(/^src\//, "").replace(/\.html$/, "")

    siteData.pages
      .filter(page => page.dependencies.includes(name))
      .forEach(page => {
        setDependencies(page, siteData)
        updateHTML("src/" + page.path, siteData)
      })
  }
  else if (type === "segment") {
    const name = posixPath.replace(/^src\//, "").replace(/\.html$/, "")

    siteData.pages
      .filter(page => page.dependencies.includes(name))
      .forEach(page => {
        setDependencies(page, siteData)
        updateHTML("src/" + page.path, siteData)
      })
  }
  else if (type === "component" || type === "shared_component") {
    const name = posixPath.replace(/^src\//, "").replace(/\.html$/, "")

    siteData.articles
      .filter(article => article.dependencies.includes(name))
      .forEach(article => updateArticle(article, siteData))

    siteData.pages
      .filter(page => page.dependencies.includes(name))
      .forEach(page => updateHTML("src/" + page.path, siteData))
  }
  else if (type === "wrapper" || type === "shared_wrapper") {
    const name = posixPath.replace(/^src\//, "").replace(/\.html$/, "")

    siteData.articles
      .filter(article => article.dependencies.includes(name))
      .forEach(article => {
        setDependencies(article, siteData)
        updateArticle(article, siteData)
      })

    siteData.pages
      .filter(page => page.dependencies.includes(name))
      .forEach(page => {
        setDependencies(page, siteData)
        updateHTML("src/" + page.path, siteData)
      })
  }
  else if (type === "layout") {
    const name = posixPath.replace(/^src\//, "").replace(/\.html$/, "")

    siteData.wrappers
      .filter(wrapper => wrapper.dependencies.includes(name))
      .forEach(wrapper => setDependencies(wrapper, siteData))

    siteData.articles
      .filter(article => article.dependencies.includes(name))
      .forEach(article => {
        setDependencies(article, siteData)
        updateArticle(article, siteData)
      })

    siteData.pages
      .filter(page => page.dependencies.includes(name))
      .forEach(page => {
        setDependencies(page, siteData)
        updateHTML("src/" + page.path, siteData)
      })
  }
  else {
    return
  }
}

const updateArticle = (article, siteData) => {
  const mainSection =
    typeof article.frontMatter.main === "object" ? article.frontMatter.main : {}

  if (mainSection["embedded-only"] === true) return

  const wrapper = getWrapper(siteData, article.path)

  if (wrapper) {
    const wrapperMainSection =
      typeof wrapper.frontMatter.main === "object" ? wrapper.frontMatter.main : {}

    if (wrapperMainSection["embedded-only"] === true) return
  }

  updateHTML("src/" + article.path, siteData)
}

export { update }

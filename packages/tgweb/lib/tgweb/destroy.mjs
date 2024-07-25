import * as PATH from "path"
import { slash } from "../utils/slash.mjs"
import fs from "fs"
import getType from "./get_type.mjs"
import { updateSiteData } from "./update_site_data.mjs"
import { updateHTML } from "./update_html.mjs"
import { setDependencies } from "./set_dependencies.mjs"
import { generateTailwindConfig } from "./generate_tailwind_config.mjs"

const destroy = (path, siteData) => {
  const posixPath = slash(path)
  const dirname = PATH.dirname(posixPath)

  if (dirname.startsWith("src/images") || dirname.startsWith("src/animations") ||
      dirname.startsWith("src/audios")) {
    const distPath = posixPath.replace(/^src\//, "dist/")
    const targetPath = PATH.resolve(distPath)

    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath)

      if (process.env.VERBOSE) console.log(`Deleted ${distPath}.`)
    }
  }
  else if (posixPath === "src/site.toml") {
    updateSiteData(siteData, posixPath)
    _regenerateFiles(posixPath, siteData)
  }
  else if (posixPath === "src/color_scheme.toml") {
    const tailwindConfig = generateTailwindConfig(PATH.dirname(posixPath))
    if (tailwindConfig) fs.writeFileSync("tailwind.config.js", tailwindConfig)
    if (process.env.VERBOSE) console.log(`Updated tailwind.config.js`)
  }
  else {
    _destroyTemplate(posixPath, siteData)
    _regenerateFiles(posixPath, siteData)
    _makeDependencies(posixPath, siteData)
    _removeFile(posixPath)
  }
}

const _destroyTemplate = (path, siteData) => {
  const type = getType(path)

  if (type === "page") {
    const shortPath = path.replace(/^src\//, "")
    siteData.pages = siteData.pages.filter(p => p.path !== shortPath)
  }
  else if (type === "article") {
    const shortPath = path.replace(/^src\//, "")
    siteData.articles = siteData.articles.filter(a => a.path !== shortPath)
  }
  else if (type === "wrapper") {
    const shortPath = path.replace(/^src\//, "")
    siteData.wrappers = siteData.wrappers.filter(w => w.path !== shortPath)
  }
  else if (type === "layout") {
    const shortPath = path.replace(/^src\//, "")
    siteData.layouts = siteData.layouts.filter(l => l.path !== shortPath)
  }
  else if (type === "component") {
    const shortPath = path.replace(/^src\//, "")
    siteData.components = siteData.components.filter(c => c.path !== shortPath)
  }
  else if (type === "segment") {
    const shortPath = path.replace(/^src\//, "")
    siteData.segments = siteData.segments.filter(s => s.path !== shortPath)
  }
}

const _regenerateFiles = (path, siteData) => {
  const type = getType(path)

  if (type === "page") {
    return
  }
  else if (type === "site.toml") {
    siteData.pages.forEach(page => updateHTML("src/" + page.path, siteData))
    siteData.articles.forEach(article => updateHTML("src/" + article.path, siteData))
  }
  else {
    const depName = path.replace(/^src\//, "").replace(/\.html$/, "")

    siteData.pages
      .filter(page => page.dependencies.includes(depName))
      .forEach(page => updateHTML("src/" + page.path, siteData))

    siteData.articles
      .filter(article => article.dependencies.includes(depName))
      .forEach(article => updateHTML("src/" + article.path, siteData))
  }
}

const _makeDependencies = (path, siteData) => {
  const type = getType(path)
  const depName = path.replace(/^src\//, "").replace(/\.html$/, "")

  if (type === "article") {
    siteData.pages.forEach(p => {
      p.dependencies = p.dependencies.filter(dep => dep !== depName)
    })

    siteData.articles.forEach(a => {
      a.dependencies = a.dependencies.filter(dep => dep !== depName)
    })
  }
  else if (type === "wrapper") {
    siteData.pages.forEach(p => {
      if (p.dependencies.includes(depName)) setDependencies(p, siteData)
    })

    siteData.articles.forEach(a => {
      if (a.dependencies.includes(depName)) setDependencies(a, siteData)
    })
  }
}

const _removeFile = (path) => {
  const type = getType(path)

  if (type === "page" || type === "article") {
    const distPath = path.replace(/^src\//, "dist/").replace(/^dist\/pages\//, "dist/")
    const targetPath = PATH.resolve(distPath)

    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath)

      if (process.env.VERBOSE) console.log(`Deleted ${distPath}.`)
    }
  }
}

export { destroy }

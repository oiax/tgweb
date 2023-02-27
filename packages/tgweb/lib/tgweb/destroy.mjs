import * as PATH from "path"
import { slash } from "./slash.mjs"
import fs from "fs"
import getType from "./get_type.mjs"
import { updateSiteData } from "./update_site_data.mjs"
import { updateHTML } from "./update_html.mjs"
import { setDependencies } from "./set_dependencies.mjs"

const destroy = (path, siteData) => {
  const dirname = slash(PATH.dirname(path))

  if (dirname.startsWith("src/images") || dirname.startsWith("src/audios")) {
    const distPath = slash(path).replace(/^src\//, "dist/")
    const targetPath = PATH.resolve(distPath)
    fs.unlinkSync(targetPath)
  }
  else if (path === "src/site.yml") {
    updateSiteData(siteData, path)
    _regenerateFiles(path, siteData)
  }
  else {
    _destroyTemplate(path, siteData)
    _regenerateFiles(path, siteData)
    _makeDependencies(path, siteData)
    _removeFile(path)
  }
}

const _destroyTemplate = (path, siteData) => {
  const type = getType(path)

  if (type === "page") {
    const shortPath = slash(path).replace(/^src\/pages\//, "")
    siteData.pages = siteData.pages.filter(p => p.path !== shortPath)
  }
  else if (type === "article") {
    const shortPath = slash(path).replace(/^src\/articles\//, "")
    siteData.articles = siteData.articles.filter(a => a.path !== shortPath)
  }
  else if (type === "wrapper") {
    const shortPath = slash(path).replace(/^src\//, "")
    siteData.wrappers = siteData.wrappers.filter(w => w.path !== shortPath)
  }
  else if (type === "layout") {
    const shortPath = slash(path).replace(/^src\/layouts\//, "")
    siteData.layouts = siteData.layouts.filter(l => l.path !== shortPath)
  }
  else if (type === "component") {
    const shortPath = slash(path).replace(/^src\/components\//, "")
    siteData.components = siteData.components.filter(c => c.path !== shortPath)
  }
}

const _regenerateFiles = (path, siteData) => {
  const type = getType(path)

  if (type === "page") {
    return
  }
  else if (type === "site.yml") {
    siteData.pages.forEach(page => updateHTML("src/pages/" + page.path, siteData))
    siteData.articles.forEach(article => updateHTML("src/articles/" + article.path, siteData))
  }
  else {
    const depName = slash(path).replace(/^src\//, "").replace(/\.html$/, "")

    siteData.pages
      .filter(page => page.dependencies.includes(depName))
      .forEach(page => updateHTML("src/pages/" + page.path, siteData))

    siteData.articles
      .filter(article => article.dependencies.includes(depName))
      .forEach(article => updateHTML("src/articles/" + article.path, siteData))
  }
}

const _makeDependencies = (path, siteData) => {
  const type = getType(path)
  const depName = slash(path).replace(/^src\//, "").replace(/\.html$/, "")

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
    const distPath = slash(path).replace(/^src\//, "dist/").replace(/^dist\/pages\//, "dist/")
    const targetPath = PATH.resolve(distPath)
    fs.unlinkSync(targetPath)

    if (process.env.VERBOSE) console.log(`Deleted ${targetPath}.`)
  }
}

export { destroy }

import * as PATH from "path"
import { slash } from "../utils/slash.mjs"
import fs from "fs"
import getType from "./get_type.mjs"
import { updateSiteData } from "./update_site_data.mjs"
import { updateHTML } from "./update_html.mjs"
import { setDependencies } from "./set_dependencies.mjs"
import { generateTailwindConfig } from "./generate_tailwind_config.mjs"
import { protectedFiles } from "./protected_files.mjs"

const destroy = (path, siteData) => {
  const posixPath = slash(path)

  if (protectedFiles.includes(posixPath.replace(/^src\//, ""))) return

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
  else if (dirname.startsWith("src/css") || dirname.startsWith("src/js")) {
    const sharedAssetPath = posixPath.replace(/^src\//, "src/shared_")

    if (fs.existsSync(sharedAssetPath)) {
      const distPath = posixPath.replace(/^src\//, "dist/")
      const targetPath = PATH.resolve(distPath)
      const targetDir = PATH.dirname(targetPath)

      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
      fs.copyFileSync(sharedAssetPath, targetPath)
    }
    else {
      const distPath = posixPath.replace(/^src\//, "dist/")
      const targetPath = PATH.resolve(distPath)

      if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath)

        if (process.env.VERBOSE) console.log(`Deleted ${distPath}.`)
      }
    }
  }
  else if (dirname.startsWith("src/shared_css") || dirname.startsWith("src/shared_js")) {
    const assetPath = posixPath.replace(/^src\/shared_/, "src/")

    if (fs.existsSync(assetPath)) {
      const distPath = assetPath.replace(/^src\//, "dist/")
      const targetPath = PATH.resolve(distPath)
      const targetDir = PATH.dirname(targetPath)

      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
      fs.copyFileSync(assetPath, targetPath)
    }
    else {
      const distPath = assetPath.replace(/^src\//, "dist/")
      const targetPath = PATH.resolve(distPath)

      if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath)

        if (process.env.VERBOSE) console.log(`Deleted ${distPath}.`)
      }
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
  const posixPath = slash(path)
  const type = getType(posixPath)
  const shortPath = posixPath.replace(/^src\//, "")

  if (type === "page") {
    siteData.pages = siteData.pages.filter(p => p.path !== shortPath)
  }
  else if (type === "article") {
    siteData.articles = siteData.articles.filter(a => a.path !== shortPath)
  }
  else if (type === "wrapper") {
    siteData.wrappers = siteData.wrappers.filter(w => w.path !== shortPath)
  }
  else if (type === "layout") {
    siteData.layouts = siteData.layouts.filter(l => l.path !== shortPath)
  }
  else if (type === "component") {
    siteData.components = siteData.components.filter(c => c.path !== shortPath)
  }
  else if (type === "shared_component") {
    siteData.sharedComponents = siteData.sharedComponents.filter(c => c.path !== shortPath)
  }
  else if (type === "segment") {
    siteData.segments = siteData.segments.filter(s => s.path !== shortPath)
  }
  else if (type === "front_matter_file") {
    const htmlPath = posixPath.replace(/\.toml$/, ".html")
    if (!fs.existsSync(htmlPath)) return

    updateSiteData(siteData, htmlPath)

    const name = shortPath.replace(/\.toml$/, "")

    siteData.articles
      .filter(article => article.dependencies.includes(name))
      .forEach(article => {
        updateHTML("src/" + article.path, siteData)
      })

    siteData.articles.forEach(a => setDependencies(a, siteData))
    siteData.segments.forEach(s => setDependencies(s, siteData))

    siteData.pages
      .filter(page => page.dependencies.includes(name))
      .forEach(page => {
        updateHTML("src/" + page.path, siteData)
      })

    siteData.pages.forEach(p => setDependencies(p, siteData))
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

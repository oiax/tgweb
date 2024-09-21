import * as PATH from "path"
import { slash } from "../utils/slash.mjs"
import fs from "fs"
import getType from "./get_type.mjs"
import { renderWebPage } from "./render_web_page.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import render from "dom-serializer"
import pretty from "pretty"
import { protectedFiles } from "./protected_files.mjs"

const createInitially = (path, siteData) => {
  const posixPath = slash(path)

  if (protectedFiles.includes(posixPath.replace(/^src\//, ""))) return

  const dirname = PATH.dirname(posixPath)

  if (dirname.startsWith("src/images") || dirname.startsWith("src/animations") ||
      dirname.startsWith("src/audios") || dirname.startsWith("src/css") ||
      dirname.startsWith("src/js")) {
    const distPath = posixPath.replace(/^src\//, "dist/")
    const targetPath = PATH.resolve(distPath)
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.copyFileSync(posixPath, targetPath)
  }
  else if (dirname.startsWith("src/shared_css") || dirname.startsWith("src/shared_js")) {
    const assetPath = posixPath.replace(/^src\/shared_/, "src/")

    if (fs.existsSync(assetPath)) return

    const distPath = assetPath.replace(/^src\//, "dist/")
    const targetPath = PATH.resolve(distPath)
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.copyFileSync(posixPath, targetPath)
  }
  else {
    const type = getType(posixPath)

    if (type !== "page" && type !== "article") return

    if (type === "article") {
      const article = siteData.articles.find(article => "src/" + article.path === posixPath)

      if (article.frontMatter.main["embedded-only"] === true) return

      if (siteData.options["buildDrafts"] !== true && article.frontMatter.main["draft"] === true)
        return

      const wrapper = getWrapper(siteData, article.path)

      if (wrapper && wrapper.frontMatter.main["embedded-only"] === true) return
    }
    else if (type === "page") {
      const page = siteData.pages.find(page => "src/" + page.path === posixPath)

      if (siteData.options["buildDrafts"] !== true && page.frontMatter.main &&
          page.frontMatter.main["draft"] === true) return
    }

    const dom = renderWebPage(posixPath, siteData)

    if (dom !== undefined) {
      const html = pretty(render(dom, {encodeEntities: false}), {ocd: true})

      const distPath = posixPath.replace(/^src\//, "dist/").replace(/^dist\/pages\//, "dist/")
      const targetPath = PATH.resolve(distPath)
      const targetDir = PATH.dirname(targetPath)

      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
      fs.writeFileSync(targetPath, html)

      if (process.env.VERBOSE) console.log(`Created ${distPath}.`)
    }
  }
}

export { createInitially }

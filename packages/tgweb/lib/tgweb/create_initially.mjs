import * as PATH from "path"
import { slash } from "../utils/slash.mjs"
import fs from "fs"
import getType from "./get_type.mjs"
import { renderWebPage } from "./render_web_page.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import render from "dom-serializer"
import pretty from "pretty"

const createInitially = (path, siteData) => {
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
    const type = getType(posixPath)

    if (type !== "page" && type !== "article") return

    if (type === "article") {
      const article = siteData.articles.find(article => "src/" + article.path === posixPath)

      if (article.frontMatter.main["embedded-only"] === true) return

      const wrapper = getWrapper(siteData, article.path)

      if (wrapper && wrapper.frontMatter.main["embedded-only"] === true) return
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

import * as PATH from "path"
import { slash } from "./slash.mjs"
import fs from "fs"
import getType from "./get_type.mjs"
import generateHTML from "./generate_html.mjs"
import { getWrapper } from "./get_wrapper.mjs"

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
      const article =
        siteData.articles.find(article => "src/articles/" + article.path === posixPath)

      const wrapper = getWrapper(siteData, "articles/" + article.path)

      if (wrapper && wrapper.frontMatter["embedded-only"] === true) return
      if (article.frontMatter["embedded-only"] === true) return
    }

    const html = generateHTML(posixPath, siteData)

    if (html !== undefined) {
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

import * as PATH from "path"
import { slash } from "./slash.mjs"
import fs from "fs"
import getType from "./get_type.mjs"
import generateHTML from "./generate_html.mjs"
import { getWrapper } from "./get_wrapper.mjs"

const createInitially = (path, siteData) => {
  const dirname = slash(PATH.dirname(path))

  if (dirname.startsWith("src/images") || dirname.startsWith("src/audios")) {
    const distPath = slash(path).replace(/^src\//, "dist/")
    const targetPath = PATH.resolve(distPath)
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.copyFileSync(path, targetPath)
  }
  else {
    const type = getType(path)

    if (type !== "page" && type !== "article") return

    if (type === "article") {
      const article = siteData.articles.find(article => "src/articles/" + article.path == path)
      const wrapper = getWrapper(siteData, "articles/" + article.path)

      if (article.frontMatter["embedded-only"] === true ||
          wrapper.frontMatter["embedded-only"] === true) return
    }

    const html = generateHTML(path, siteData)

    if (html !== undefined) {
      const distPath = slash(path).replace(/^src\//, "dist/").replace(/^dist\/pages\//, "dist/")
      const targetPath = PATH.resolve(distPath)
      const targetDir = PATH.dirname(targetPath)

      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
      fs.writeFileSync(targetPath, html)

      if (process.env.VERBOSE) console.log(`Created ${distPath}.`)
    }
  }
}

export { createInitially }

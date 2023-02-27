import * as PATH from "path"
import { slash } from "./slash.mjs"
import fs from "fs"
import generateHTML from "./generate_html.mjs"

const updateHTML = (path, siteData) => {
  const html = generateHTML(path, siteData)

  if (html !== undefined) {
    const distPath = slash(path).replace(/^src\//, "dist/").replace(/^dist\/pages\//, "dist/")
    const targetPath = PATH.resolve(distPath)
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(targetPath, html)

    if (process.env.VERBOSE) console.log(`Updated ${targetPath}.`)
  }
}

export { updateHTML }

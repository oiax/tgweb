import * as PATH from "path"
import fs from "fs"
import generateHTML from "./generate_html.mjs"

const createHTML = (path, siteData) => {
  const dirname = PATH.dirname(path)

  if (dirname.startsWith("src/images") || dirname.startsWith("src/audios")) {
    const targetPath = path.replace(/^src\//, "dist/")
    const targetDir = PATH.dirname(targetPath)

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
    fs.copyFileSync(path, targetPath)
  }
  else {
    const html = generateHTML(path, siteData)

    if (html !== undefined) {
      const targetPath = path.replace(/^src\//, "dist/").replace(/^dist\/pages\//, "dist/")
      const targetDir = PATH.dirname(targetPath)

      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
      fs.writeFileSync(targetPath, html)
    }
  }
}

export default createHTML

import * as PATH from "path"
import fs from "fs"

const installFonts = (siteData, workingDir) => {
  if (siteData.properties["font-material-symbols"] === true) {
    const packageDir = PATH.resolve(PATH.join(workingDir, "node_modules", "material-symbols"))

    const filenames = [
      "index.css",
      "material-symbols-outlined.woff2",
      "material-symbols-rounded.woff2",
      "material-symbols-sharp.woff2"
    ]

    const destDir = PATH.join(process.cwd(), "dist", "css", "material-symbols")
    fs.mkdirSync(destDir, {recursive: true})

    filenames.forEach(filename => {
      const srcPath = PATH.join(packageDir, filename)
      const destPath = PATH.join(destDir, filename)
      fs.copyFileSync(srcPath, destPath)
    })
  }
}

export { installFonts }

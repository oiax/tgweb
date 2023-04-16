import * as PATH from "path"
import fs from "fs"

const installUtilities = (workingDir) => {
  const packageDir = PATH.resolve(PATH.join(workingDir, "node_modules", "tgweb"))
  const srcPath = PATH.join(packageDir, "stubs", "tgweb_utilities.js")
  const targetDirPath = PATH.join(process.cwd(), "dist", "js")
  const destPath = PATH.join(process.cwd(), "dist", "js", "tgweb_utilities.js")
  fs.mkdirSync(targetDirPath, { recursive: true })
  fs.copyFileSync(srcPath, destPath)
}

export { installUtilities }

import * as PATH from "path"
import fs from "fs"

const installAlpinejs = (workingDir) => {
  const packageDir = PATH.resolve(PATH.join(workingDir, "node_modules", "alpinejs"))
  const srcPath = PATH.join(packageDir, "dist", "cdn.min.js")
  const targetDirPath = PATH.join(process.cwd(), "dist", "js")
  const destPath = PATH.join(process.cwd(), "dist", "js", "alpine.min.js")
  fs.mkdirSync(targetDirPath, { recursive: true })
  fs.copyFileSync(srcPath, destPath)
}

export { installAlpinejs }

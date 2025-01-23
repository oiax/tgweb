import * as PATH from "path"
import fs from "fs"

const installWebmanifest = (workingDir) => {
  const packageDir = PATH.resolve(PATH.join(workingDir, "node_modules", "tgweb"))
  const srcPath = PATH.join(packageDir, "resources", "manifest.webmanifest.json")
  const targetDirPath = PATH.join(process.cwd(), "dist")
  const destPath = PATH.join(process.cwd(), "dist", "manifest.webmanifest.json")
  fs.mkdirSync(targetDirPath, { recursive: true })
  fs.copyFileSync(srcPath, destPath)
}

export { installWebmanifest }

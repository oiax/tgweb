import * as PATH from "path"
import fs from "fs"

const installDotlottiejs = (workingDir) => {
  const packageDir = PATH.resolve(PATH.join(workingDir, "node_modules", "@lottiefiles", "dotlottie-web"))
  const srcPath = PATH.join(packageDir, "dist", "index.js")
  const targetDirPath = PATH.join(process.cwd(), "dist", "js")
  const destPath = PATH.join(process.cwd(), "dist", "js", "dotlottie.min.js")
  fs.mkdirSync(targetDirPath, { recursive: true })
  fs.copyFileSync(srcPath, destPath)
}

export { installDotlottiejs }

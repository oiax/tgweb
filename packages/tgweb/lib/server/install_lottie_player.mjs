import * as PATH from "path"
import fs from "fs"

const installLottiePlayer = (workingDir) => {
  const packageDir = PATH.resolve(PATH.join(workingDir, "node_modules", "tgweb"))
  const srcPath = PATH.join(packageDir, "resources", "tgweb_lottie_player.js")
  const targetDirPath = PATH.join(process.cwd(), "dist", "js")
  const destPath = PATH.join(process.cwd(), "dist", "js", "tgweb_lottie_player.js")
  fs.mkdirSync(targetDirPath, { recursive: true })
  fs.copyFileSync(srcPath, destPath)
}

export { installLottiePlayer }

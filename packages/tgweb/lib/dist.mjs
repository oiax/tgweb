#! /usr/bin/env node

import * as PATH from "path"
import fs from "fs"
import getopts from "getopts"
import { installFonts } from "./server/install_fonts.mjs"
import { installUtilities } from "./server/install_utilities.mjs"
import { installLottiePlayer } from "./server/install_lottie_player.mjs"
import { installAlpinejs } from "./server/install_alpinejs.mjs"
import { installDotlottiejs } from "./server/install_dotlottiejs.mjs"
import { touchTailwindcss } from "./server/touch_tailwindcss.mjs"
import { generateTailwindConfig } from "./tgweb/generate_tailwind_config.mjs"
import { execSync } from "child_process"
import tgweb from "./tgweb.mjs"

const tailwindCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`

const main = (targetDirPath, options) => {
  const workingDir = process.cwd()
  process.chdir(targetDirPath)

  const siteData = tgweb.getSiteData(process.cwd())
  siteData.options = options

  installFonts(siteData, workingDir)
  installUtilities(workingDir)
  installLottiePlayer(workingDir)
  installAlpinejs(workingDir)
  installDotlottiejs(workingDir)
  touchTailwindcss()

  const tailwindConfig = generateTailwindConfig(PATH.join(process.cwd(), "src"))
  if (tailwindConfig) fs.writeFileSync("tailwind.config.js", tailwindConfig)

  fs.writeFileSync("tailwind.css", tailwindCss.trim() + "\n")

  const paths = fs.readdirSync(PATH.join(process.cwd(), "src"), {recursive: true})

  paths.forEach(path => {
    const realPath = PATH.join(process.cwd(), "src", path)
    const targetPath = PATH.join(process.cwd(), "dist", path)
    const stat = fs.statSync(realPath)

    if (stat.isDirectory()) {
      if (!fs.existsSync(targetPath)) fs.mkdirSync(realPath, { recursive: true })
    }
    else {
      tgweb.createInitially(PATH.join("src", path), siteData)
    }
  })

  const tailwindcssPath = PATH.join("dist", "css", "tailwind.css")

  execSync(`npx tailwindcss -i tailwind.css -o ${tailwindcssPath}`)
}

const options = getopts(process.argv.slice(2))
const args = options["_"]

if (args.length > 0) {
  const targetDirName = args[0]

  if (targetDirName == undefined) {
    console.log("Usage: npx tgweb-dist <site-name>")
  }
  else {
    const adjustedDirName = targetDirName.replace(/^sites\//, "")
    const targetDirPath = PATH.resolve(process.cwd(), `./sites/${adjustedDirName}`)
    main(targetDirPath, options)
  }
}
else {
  const targetDirPath = PATH.resolve(process.cwd(), ".")
  main(targetDirPath, options)
}

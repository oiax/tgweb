#! /usr/bin/env node

import * as PATH from "path"
import fs from "fs"
import { installFonts } from "./server/install_fonts.mjs"
import { installUtilities } from "./server/install_utilities.mjs"
import { installAlpinejs } from "./server/install_alpinejs.mjs"
import { touchTailwindcss } from "./server/touch_tailwindcss.mjs"
import { generateTailwindConfig } from "./tgweb/generate_tailwind_config.mjs"
import { execSync } from "child_process"
import tgweb from "./tgweb.mjs"

const tailwindCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`

const main = (targetDirPath) => {
  const workingDir = process.cwd()
  process.chdir(targetDirPath)

  const siteData = tgweb.getSiteData(process.cwd())

  installFonts(siteData, workingDir)
  installUtilities(workingDir)
  installAlpinejs(workingDir)
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

if (process.argv.length > 2) {
  const targetDirName = process.argv[2]

  if (targetDirName == undefined) {
    console.log("Usage: npx tgweb-dist <site-name>")
  }
  else {
    const adjustedDirName = targetDirName.replace(/^sites\//, "")
    const targetDirPath = PATH.resolve(process.cwd(), `./sites/${adjustedDirName}`)
    main(targetDirPath)
  }
}
else {
  const targetDirPath = PATH.resolve(process.cwd(), ".")
  main(targetDirPath)
}

#! /usr/bin/env node

import * as PATH from "path"
import glob from "glob"
import fs from "fs"
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const run = () => {
  const src = PATH.resolve(__dirname, "../stubs")
  const targetDirName = process.argv[2]

  if (targetDirName == undefined) {
    console.log("Usage: npx tgweb-init <site-name>")
    return
  }

  const targetDirPath = PATH.resolve(process.cwd(), `./sites/${targetDirName}`)

  if (fs.existsSync(targetDirPath)) {
    console.log(`A directory named "sites/${targetDirName}" already exists.`)
    return
  }

  fs.mkdirSync(targetDirPath, { recursive: true })
  fs.mkdirSync(`${targetDirPath}/src`)
  fs.mkdirSync(`${targetDirPath}/dist`)

  const subdirectories =
    ["pages", "layouts", "components", "articles", "tags", "images", "audios"]

  subdirectories.forEach(subdir => fs.mkdirSync(`${targetDirPath}/src/${subdir}`))

  glob.sync(`${src}/*`).map(path => {
    const filename = PATH.basename(path)
    const dest = PATH.resolve(targetDirPath, `./${filename}`)
    fs.copyFileSync(path, dest)
  })

  console.log(`A site named "${targetDirName}" was created successfully.`)
}

run()

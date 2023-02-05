#!/usr/bin/env node
import * as PATH from "path"
import glob from "glob"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = PATH.dirname(__filename);

const run = () => {
  const src = PATH.resolve(__dirname, "./templates")
  const targetDirName = process.argv[2] || "tgweb"
  const targetDirPath = PATH.resolve(process.cwd(), `./${targetDirName}`)

  if (fs.existsSync(targetDirPath)) {
    console.log(`A directory named ${targetDirName} already exists.`)
    return
  }

  fs.mkdirSync(targetDirPath)

  glob.sync(`${src}/*`).map(path => {
    const filename = PATH.basename(path)
    const dest = PATH.resolve(targetDirPath, `./${filename}`)
    fs.copyFileSync(path, dest)
  })

  console.log("Tgweb was installed successfully.")
}

run()

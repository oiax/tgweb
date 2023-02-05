#!/usr/bin/env node
import * as PATH from "path"
import glob from "glob"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = PATH.dirname(__filename);
const targetDir = process.cwd()

const run = () => {
  const src = PATH.resolve(__dirname, "./templates")

  glob.sync(`${src}/*`).map(path => {
    const filename = PATH.basename(path)
    const dest = PATH.resolve(targetDir, `./${filename}`)
    fs.copyFileSync(path, dest)
  })
}

run()

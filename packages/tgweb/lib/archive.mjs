#! /usr/bin/env node

import * as PATH from "path"

import fs from "fs"
import archiver from "archiver"

const archive = (dirName) => {
  const name = PATH.parse(dirName).base
  const output = fs.createWriteStream(`./${name}.zip`)
  const archive = archiver("zip", {zlib: { level: 9 }})

  archive.pipe(output)
  archive.directory(`${dirName}/src`, false)
  archive.finalize()

  console.log(`A file named ${name}.zip was created in the current directory.`)
}

if (process.argv.length > 2) {
  const targetDirName = process.argv[2]

  if (targetDirName == undefined) {
    console.log("Usage: npx tgweb-archive <site-name>")
  }
  else {
    const adjustedDirName = targetDirName.replace(/^sites\//, "")
    const targetDirPath = PATH.resolve(process.cwd(), `./sites/${adjustedDirName}`)
    archive(targetDirPath)
  }
}
else {
  const targetDirPath = PATH.resolve(process.cwd(), ".")
  archive(targetDirPath)
}

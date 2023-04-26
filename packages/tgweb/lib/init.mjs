#! /usr/bin/env node

import * as PATH from "path"
import glob from "glob"
import fs from "fs"
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const initialize = () => {
  const sitesDirPath = PATH.resolve(process.cwd(), "./sites")

  if (fs.existsSync(sitesDirPath)) {
    console.log('A directory named "sites" exists.')
    console.log('It seems that this directory has already been initialized as a multi-site working directory.')
    return
  }

  createGitignore()
  generateSkeleton(process.cwd())

  console.log(`A website scaffold was created.`)
}

const initializeSites = () => {
  const srcDirPath = PATH.resolve(process.cwd(), "./src")

  if (fs.existsSync(srcDirPath)) {
    console.log('A directory named "src" exists.')
    console.log('It seems that this directory has already been initialized as a single-site working directory.')
    return
  }

  createGitignore()

  const targetDirName = process.argv[2]
  const targetDirPath = PATH.resolve(process.cwd(), `./sites/${targetDirName}`)

  if (fs.existsSync(targetDirPath)) {
    console.log(`A directory named "sites/${targetDirName}" already exists.`)
    return
  }

  fs.mkdirSync(targetDirPath, { recursive: true })

  generateSkeleton(targetDirPath)

  console.log(`A website scaffold was created in the sites/${targetDirName} directory.`)
}

const generateSkeleton = (targetDirPath) => {
  fs.mkdirSync(`${targetDirPath}/src`)
  fs.mkdirSync(`${targetDirPath}/dist`)

  const subdirectories =
    ["pages", "layouts", "segments", "components", "articles", "tags", "images", "audios"]

  subdirectories.forEach(subdir => fs.mkdirSync(`${targetDirPath}/src/${subdir}`))

  const skelDir = PATH.resolve(__dirname, "../skel")
  process.chdir(skelDir)

  glob.sync("**/*.*").map(path => {
    const dest = PATH.resolve(targetDirPath, `./${path}`)
    fs.copyFileSync(path, dest)
  })
}

const createGitignore = () => {
  const lines = [
    "/node_modules",
    "/dist",
    "/sites/*/dist",
    "/sites/*/tailwind.config.js",
    "/sites/*/tailwind.css"
  ]

  const content = lines.join("\n") + "\n"

  fs.writeFileSync(".gitignore", content)
}

if (process.argv.length === 2) initialize()
else initializeSites()

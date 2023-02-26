#! /usr/bin/env node

import * as PATH from "path"
import fs from "fs"
import express from "express"
import http from "http"
import reload from "reload"
import chokidar from "chokidar"
import { spawn } from "child_process"
import { getRouter } from "./server/router.mjs"
import tgweb from "./tgweb.mjs"

const run = () => {
  if (process.argv.length > 2) {
    const targetDirName = process.argv[2]

    if (targetDirName == undefined) {
      console.log("Usage: npx tgweb-server <site-name>")
      return
    }

    const targetDirPath = PATH.resolve(process.cwd(), `./sites/${targetDirName}`)

    if (!fs.existsSync(targetDirPath)) {
      console.log(`A directory named "sites/${targetDirName}" does not exist.`)
      return
    }

    process.chdir(targetDirPath)
  }

  const app = express()
  const router = getRouter()

  app.set("port", process.env.PORT || 3000)
  app.use(router)

  const server = http.createServer(app)

  reload(app).then(reloadReturned => {
    chokidar.watch("./dist").on("all", () => {
      reloadReturned.reload()
    })

    server.listen(app.get("port"), () => {
      console.log(`Web server is listening on port ${app.get("port")}.`)
    })
  }).catch(err => {
    console.error("Could not start a web server.", err)
  })

  const siteData = tgweb.getSiteData(process.cwd())

  chokidar.watch("./src")
    .on("add", path => tgweb.create(path, siteData))
    .on("change", path => tgweb.update(path, siteData))
    .on("unlink", path => tgweb.destroy(path, siteData))

  const childProcess = spawn("npx", [
    "tailwindcss",
    "-i",
    "./tailwind.css",
    "-o",
    "./dist/css/tailwind.css",
    "--watch",
  ])

  console.log("tailwindcss began to monitor the HTML files for changes.")

  const regex = /Rebuilding\.\.\.\s*/g

  childProcess.stderr.on("data", data => {
    const message = data.toString().trim().replaceAll(regex, "")
    if (message !== "") console.error("Rebuilding... " + message)
  })

  childProcess.on("close", code => {
    console.error(`tailwind stopped. (code: ${code})`)
  })
}

run()

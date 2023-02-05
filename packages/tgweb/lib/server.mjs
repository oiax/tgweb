#! /usr/bin/env node

import * as PATH from "path"
import fs from "fs"
import express from "express"
import http from "http"
import reload from "reload"
import chokidar from "chokidar"
import { getRouter } from "./server/router.mjs"
import tgweb from "./tgweb.mjs"

const run = () => {
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

  const app = express()
  const router = getRouter()

  app.set("port", process.env.PORT || 3000)
  app.use(router)

  const server = http.createServer(app)

  reload(app).then(function (reloadReturned) {
    chokidar.watch("./dist").on("all", (_event, _path) => {
      reloadReturned.reload()
    })

    server.listen(app.get("port"), function () {
      console.log("Web server listening on port " + app.get("port"))
    })
  }).catch(function (err) {
    console.error("Could not start a web server.", err)
  })

  const siteData = tgweb.getSiteData(process.cwd())

  chokidar.watch("./src")
    .on("add", path => tgweb.create(path, siteData))
    .on("change", path => tgweb.update(path, siteData))
}

run()

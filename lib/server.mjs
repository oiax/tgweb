#! /usr/bin/env node

import express from "express"
import http from "http"
import reload from "reload"
import chokidar from "chokidar"
import router from "./server/router.mjs"
import tgweb from "./tgweb.mjs"

const app = express()

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

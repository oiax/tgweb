#! /usr/bin/env node

import express from "express"
import http from "http"
import path from "path"
import reload from "reload"
import chokidar from "chokidar"

const documentRoot = path.join(process.cwd(), "dist")

const app = express()

app.set("port", process.env.PORT || 3000)

app.get("/", function (req, res) {
  res.sendFile(path.join(documentRoot, "index.html"))
})

app.get("/*.html", function (req, res) {
  res.sendFile(path.join(documentRoot, req.path))
})

app.get("/css/tailwind.css", function (req, res) {
  res.sendFile(path.join(documentRoot, req.path))
})

app.get(/^\/images\/.*\.(gif|png|jpe?g|svg|avif)$/, function (req, res) {
  res.sendFile(path.join(documentRoot, req.path))
})

app.get(/^\/audios\/.*\.(mp3|wav)$/, function (req, res) {
  res.sendFile(path.join(documentRoot, req.path))
})

const server = http.createServer(app)

reload(app).then(function (reloadReturned) {
  chokidar.watch('./dist').on('all', (_event, _path) => {
    reloadReturned.reload()
  })

  server.listen(app.get("port"), function () {
    console.log("Web server listening on port " + app.get("port"))
  })
}).catch(function (err) {
  console.error("Could not start a web server.", err)
})

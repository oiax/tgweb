#! /usr/bin/env node

import * as PATH from "path"
import fs from "fs"
import express from "express"
import http from "http"
import reload from "reload"
import chokidar from "chokidar"
import tcpPortUsed from "tcp-port-used"
import { spawn } from "child_process"
import { getRouter } from "./server/router.mjs"
import { installFonts } from "./server/install_fonts.mjs"
import { installUtilities } from "./server/install_utilities.mjs"
import { installLottiePlayer } from "./server/install_lottie_player.mjs"
import { installAlpinejs } from "./server/install_alpinejs.mjs"
import { installDotlottiejs } from "./server/install_dotlottiejs.mjs"
import { installWebmanifest } from "./server/install_webmanifest.mjs"
import { touchTailwindcss } from "./server/touch_tailwindcss.mjs"
import { generateTailwindConfig } from "./tgweb/generate_tailwind_config.mjs"
import tgweb from "./tgweb.mjs"

const run = () => {
  const workingDir = process.cwd()

  if (process.argv.length > 2) {
    const targetDirName = process.argv[2]

    if (targetDirName == undefined) {
      console.log("Usage: npx tgweb-server <site-name>")
      return
    }

    const adjustedDirName = targetDirName.replace(/^sites\//, "")
    const targetDirPath = PATH.resolve(process.cwd(), `./sites/${adjustedDirName}`)

    if (!fs.existsSync(targetDirPath)) {
      console.log(`A directory named "sites/${targetDirName}" does not exist.`)
      return
    }

    process.chdir(targetDirPath)
  }

  let port = 3000

  if (process.env.PORT !== undefined) {
    port = parseInt(process.env.PORT, 10)
    if (Number.isNaN(port)) port = 3000
  }

  tcpPortUsed.waitUntilFree(3000, 250, 500)
    .then(
      () => main(workingDir, port),
      () => console.log(`ERROR: Could not start a web server. Port ${port} is in use.`)
    )
}

const tailwindCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`

const main = (workingDir, port) => {
  const app = express()
  const router = getRouter()

  app.set("port", port)
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

  let ready = false
  const siteData = tgweb.getSiteData(process.cwd())

  installFonts(siteData, workingDir)
  installUtilities(workingDir)
  installLottiePlayer(workingDir)
  installAlpinejs(workingDir)
  installDotlottiejs(workingDir)
  installWebmanifest(workingDir)
  touchTailwindcss()

  const tailwindConfig = generateTailwindConfig(PATH.join(process.cwd(), "src"))
  if (tailwindConfig) fs.writeFileSync("tailwind.config.js", tailwindConfig)

  fs.writeFileSync("tailwind.css", tailwindCss.trim() + "\n")

  chokidar.watch("src")
    .on("add", path => {
      if (ready) tgweb.create(path, siteData)
      else tgweb.createInitially(path, siteData)
    })
    .on("change", path => tgweb.update(path, siteData))
    .on("unlink", path => tgweb.destroy(path, siteData))
    .on("ready", () => {
      tgweb.updateDependencies(siteData)
      ready = true
    })

  const childProcess = spawn("npx", [
    "tailwindcss",
    "-i",
    "tailwind.css",
    "-o",
    PATH.join("dist", "css", "tailwind.css"),
    "--watch",
  ], {shell: true})

  console.log("tailwindcss began to monitor the HTML files for changes.")

  const regex = /Rebuilding\.\.\.\s*/g

  childProcess.stderr.on("data", data => {
    const message = data.toString().trim().replaceAll(regex, "")
    if (message !== "") console.error("Rebuilding tailwind.css. " + message)
  })

  childProcess.on("close", code => {
    console.error(`tailwind stopped. (code: ${code})`)
  })
}

run()

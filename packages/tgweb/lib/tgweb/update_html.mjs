import * as PATH from "path"
import fs from "fs"
import { renderWebPage } from "./render_web_page.mjs"
import render from "dom-serializer"
import pretty from "pretty"
import { inspectDom } from "../utils/inspect_dom.mjs"

// Prevent warnings when the function inspectDom is not used.
if (inspectDom === undefined) { inspectDom() }

const updateHTML = (path, siteData) => {
  const dom = renderWebPage(path, siteData)

  if (dom == undefined) return

  const html = pretty(render(dom, {encodeEntities: false}), {ocd: true})
  const distPath = path.replace(/^src\//, "dist/").replace(/^dist\/pages\//, "dist/")
  const targetPath = PATH.resolve(distPath)
  const targetDir = PATH.dirname(targetPath)

  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
  fs.writeFileSync(targetPath, html)

  if (process.env.VERBOSE) console.log(`Updated ${distPath}.`)
}

export { updateHTML }

import assert from "node:assert/strict"
import update from "../../lib/tgweb/update.mjs"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { fileURLToPath } from "url";
import fs from "fs"
import * as PATH from "path"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("update", () => {
  it("should write the generated HTML file", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    update("src/index.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/index.html"), true)

    const html = fs.readFileSync(wd + "/dist/index.html")

    assert.match(html.toString(), /\bp-2\b/)
  })

  it("should regenerate a page dependent on a layout", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    update("src/index.html", siteData)
    process.chdir(wd + "a")

    update("src/layouts/home.html", siteData)

    assert.equal(fs.existsSync(wd + "a/dist/index.html"), true)

    const html = fs.readFileSync(wd + "a/dist/index.html")

    assert.match(html.toString(), /\bp-4\b/)
  })

  it("should regenerate a page dependent on a component", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    update("src/index.html", siteData)
    process.chdir(wd + "a")

    update("src/components/hello.html", siteData)

    assert.equal(fs.existsSync(wd + "a/dist/index.html"), true)

    const html = fs.readFileSync(wd + "a/dist/index.html")

    assert.match(html.toString(), /\bgreat\b/)
  })
})

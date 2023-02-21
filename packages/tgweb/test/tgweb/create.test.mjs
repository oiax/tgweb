import assert from "node:assert/strict"
import create from "../../lib/tgweb/create.mjs"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { fileURLToPath } from "url";
import fs from "fs"
import * as PATH from "path"
import { JSDOM } from "jsdom"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("create", () => {
  it("should write the generated HTML file for a page", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    create("src/pages/index.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/index.html"), true)

    const html = fs.readFileSync(wd + "/dist/index.html")
    const dom = new JSDOM(html)
    const body = dom.window.document.body

    assert.match(body.innerHTML, /computer/)
  })

  it("should write the generated HTML file for an article", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    create("src/articles/culture.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/articles/culture.html"), true)

    const html = fs.readFileSync(wd + "/dist/articles/culture.html")
    const dom = new JSDOM(html)
    const body = dom.window.document.body

    assert.match(body.innerHTML, /computer/)
  })

  it("should copy the specified image file to dist directory", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    create("src/images/red_square.png", siteData)

    assert.equal(fs.existsSync(wd + "/dist/images/red_square.png"), true)
  })

  it("should copy the specified audio file to dist directory", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    create("src/audios/dummy.mp3", siteData)

    assert.equal(fs.existsSync(wd + "/dist/audios/dummy.mp3"), true)
  })

  it("should render a page with Japanese text", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    create("src/pages/index_ja.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/index_ja.html"), true)

    const html = fs.readFileSync(wd + "/dist/index_ja.html")
    const dom = new JSDOM(html)
    const body = dom.window.document.body

    assert.match(body.innerHTML, /世界/)
  })
})

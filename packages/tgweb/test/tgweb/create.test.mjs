import assert from "node:assert/strict"
import { create } from "../../lib/tgweb/create.mjs"
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

  it("should process a new page", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "a")

    create("src/pages/new.html", siteData)

    const n = siteData.pages.find(p => p.path === "new.html")
    assert(n)

    assert.equal(fs.existsSync(wd + "a/dist/new.html"), true)
  })

  it("should proces a new article", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "a")

    create("src/articles/blog/k.html", siteData)

    const k = siteData.articles.find(a => a.path === "blog/k.html")
    assert(k)

    const tech = siteData.articles.find(a => a.path === "technology.html")
    assert(tech.dependencies.includes("articles/blog/k"))

    assert.equal(fs.existsSync(wd + "a/dist/articles/blog/k.html"), true)
    assert.equal(fs.existsSync(wd + "a/dist/articles/technology.html"), true)
  })

  it("should process a new component", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "a")

    create("src/components/x.html", siteData)

    const x = siteData.components.find(c => c.path === "x.html")
    assert(x)
  })

  it("should process a new layout", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "a")

    create("src/layouts/simple.html", siteData)

    const s = siteData.layouts.find(l => l.path === "simple.html")
    assert(s)
  })

  it("should process new page wrapper", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "a")

    create("src/pages/etc/_wrapper.html", siteData)

    const w = siteData.wrappers.find(w => w.path === "pages/etc/_wrapper.html")
    assert(w)

    const info = siteData.pages.find(p => p.path === "etc/info.html")
    assert(info.dependencies.includes("pages/etc/_wrapper"))
    assert(!info.dependencies.includes("pages/_wrapper"))

    assert.equal(fs.existsSync(wd + "a/dist/etc/info.html"), true)
  })

  it("should process new article wrapper", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "a")

    create("src/articles/_wrapper.html", siteData)

    const w = siteData.wrappers.find(w => w.path === "articles/_wrapper.html")
    assert(w)

    const c = siteData.articles.find(a => a.path === "culture.html")
    assert(c.dependencies.includes("articles/_wrapper"))

    assert.equal(fs.existsSync(wd + "a/dist/articles/culture.html"), true)
  })

  it("should process the addition of site.yml", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "a")

    create("src/site.yml", siteData)

    assert.equal(siteData.properties["title"], "Example")

    const index = siteData.pages.find(p => p.path === "index.html")
    assert.equal(index.frontMatter["data-foo"], "Bar")

    assert.equal(fs.existsSync(wd + "a/dist/index.html"), true)
  })
})

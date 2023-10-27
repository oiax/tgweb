import assert from "node:assert/strict"
import { create } from "../../lib/tgweb/create.mjs"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { updateDependencies } from "../../lib/tgweb/update_dependencies.mjs"
import { fileURLToPath } from "url";
import fs from "fs"
import * as PATH from "path"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

// $ diff -r site_1/src site_1c/src                                                                                                        [~/projects/teamgenik/tgweb/packages/tgweb/test/sites]
// Only in site_1c/src/articles: _wrapper.html
// Only in site_1c/src/articles/blog: k.html
// Only in site_1c/src/components: x.html
// Only in site_1c/src/pages/etc: _wrapper.html
// Only in site_1c/src/pages: new.html
// $ diff -r site_0/src site_0a/src                                                                                                        [~/projects/teamgenik/tgweb/packages/tgweb/test/sites]
// Only in site_0a/src: site.toml

describe("create", () => {
  it("should process a new page", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "c/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "c")

    create("src/pages/new.html", siteData)

    const n = siteData.pages.find(p => p.path === "pages/new.html")
    assert(n)

    assert.equal(fs.existsSync(wd + "c/dist/new.html"), true)
  })

  it("should proces a new article", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "c/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    updateDependencies(siteData)

    process.chdir(wd + "c")

    create("src/articles/blog/k.html", siteData)

    const k = siteData.articles.find(a => a.path === "articles/blog/k.html")
    assert(k)

    const tech = siteData.articles.find(a => a.path === "articles/technology.html")
    assert(tech.dependencies.includes("articles/blog/k"))

    assert.equal(fs.existsSync(wd + "c/dist/articles/blog/k.html"), true)
    assert.equal(fs.existsSync(wd + "c/dist/articles/technology.html"), true)
  })

  it("should process a new component", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "c/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "c")

    create("src/components/x.html", siteData)

    const x = siteData.components.find(c => c.path === "components/x.html")
    assert(x)
  })

  it("should process a new layout", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "c/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "c")

    create("src/layouts/simple.html", siteData)

    const s = siteData.layouts.find(l => l.path === "layouts/simple.html")
    assert(s)
  })

  it("should process new page wrapper", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "c/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "c")

    create("src/pages/etc/_wrapper.html", siteData)

    const w = siteData.wrappers.find(w => w.path === "pages/etc/_wrapper.html")
    assert(w)

    const info = siteData.pages.find(p => p.path === "pages/etc/info.html")
    assert(info.dependencies.includes("pages/etc/_wrapper"))
    assert(!info.dependencies.includes("pages/_wrapper"))

    assert.equal(fs.existsSync(wd + "c/dist/etc/info.html"), true)
  })

  it("should process new article wrapper", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "c/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "c")

    create("src/articles/_wrapper.html", siteData)

    const w = siteData.wrappers.find(w => w.path === "articles/_wrapper.html")
    assert(w)

    const c = siteData.articles.find(a => a.path === "articles/culture.html")
    assert(c.dependencies.includes("articles/_wrapper"))

    assert.equal(fs.existsSync(wd + "c/dist/articles/culture.html"), true)
  })

  it("should process the addition of site.toml", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_0")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    process.chdir(wd + "a")

    create("src/site.toml", siteData)

    assert.equal(siteData.properties["main"]["title"], "Example")
    assert.equal(fs.existsSync(wd + "a/dist/index.html"), true)
  })
})

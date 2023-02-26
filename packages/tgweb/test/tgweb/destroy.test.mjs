import assert from "node:assert/strict"
import { create } from "../../lib/tgweb/create.mjs"
import { destroy } from "../../lib/tgweb/destroy.mjs"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { fileURLToPath } from "url";
import fs from "fs"
import * as PATH from "path"
import { JSDOM } from "jsdom"
import { pp } from "../../lib/tgweb/debugging.mjs"

if (pp == undefined) { pp() }

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("destroy", () => {
  it("should process the deletion of a page", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    create("src/pages/about.html", siteData)

    destroy("src/pages/about.html", siteData)

    assert.equal(!fs.existsSync(wd + "/dist/about.html"), true)

    const page = siteData.pages.find(p => p.path === "about.html")

    assert.equal(page, undefined)
  })

  it("should process the deletion of an article", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    create("src/articles/blog/a.html", siteData)

    destroy("src/articles/blog/a.html", siteData)

    assert.equal(!fs.existsSync(wd + "/dist/articles/blog/a.html"), true)

    const article = siteData.articles.find(a => a.path === "blog/a.html")

    assert.equal(article, undefined)

    const index = siteData.pages.find(p => p.path === "index.html")

    assert(!index.dependencies.includes("articles/blog/a"))

    assert.equal(fs.existsSync(wd + "/dist/articles/technology.html"), true)
  })

  it("should process the deletion of a page wrapper", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    destroy("src/pages/etc/memo/_wrapper.html", siteData)

    const wrapper = siteData.wrappers.find(w => w.path === "pages/etc/memo/_wrapper.html")

    assert.equal(wrapper, undefined)

    const page = siteData.pages.find(p => p.path === "etc/memo/memo1.html")

    assert(!page.dependencies.includes("pages/etc/memo/_wrapper"))
    assert(page.dependencies.includes("pages/etc/_wrapper"))
    assert.equal(fs.existsSync(wd + "/dist/etc/memo/memo1.html"), true)

    const html = fs.readFileSync(wd + "/dist/etc/memo/memo1.html")
    const dom = new JSDOM(html)
    const body = dom.window.document.body
    const h3 = body.querySelector("h3")

    assert.equal(h3.textContent, "Memo 1")
  })

  it("should process the deletion of an article wrapper", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    destroy("src/articles/foo/_wrapper.html", siteData)

    const wrapper = siteData.wrappers.find(w => w.path === "articles/foo/_wrapper.html")

    assert.equal(wrapper, undefined)

    const article = siteData.articles.find(a => a.path === "foo/bar/baz.html")

    assert(!article.dependencies.includes("articles/foo/_wrapper"))
    assert(article.dependencies.includes("articles/_wrapper"))
    assert.equal(fs.existsSync(wd + "/dist/articles/foo/bar/baz.html"), true)

    const html = fs.readFileSync(wd + "/dist/articles/foo/bar/baz.html")
    const dom = new JSDOM(html)
    const body = dom.window.document.body
    const main = body.querySelector("main")

    assert.equal(main.className, "bg-blue-100 py-2")
  })

  it("should process the deletion of a layout", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    destroy("src/layouts/not_used.html", siteData)

    const layout = siteData.layouts.find(l => l.path === "not_used.html")

    assert.equal(layout, undefined)
  })

  it("should process the deletion of a component", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    destroy("src/components/not_used.html", siteData)

    const component = siteData.components.find(l => l.path === "not_used.html")

    assert.equal(component, undefined)
  })

  it("should process the deletion of the site.yml", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    process.chdir(wd + "c")

    destroy("src/site.yml", siteData)

    assert.deepEqual(siteData.properties, {host: "localhost", port: 3000, scheme: "http"})

    const page = siteData.pages.find(p => p.path === "index.html")

    assert.equal(page.frontMatter["data-current-year"], undefined)
    assert.equal(fs.existsSync(wd + "c/dist/index.html"), true)
  })
})

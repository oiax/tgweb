import assert from "node:assert/strict"
import { create } from "../../lib/tgweb/create.mjs"
import { update } from "../../lib/tgweb/update.mjs"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { updateDependencies } from "../../lib/tgweb/update_dependencies.mjs"
import { fileURLToPath } from "url";
import fs from "fs"
import * as PATH from "path"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

// $ diff -r site_1/src site_1a/src
// diff -r site_1/src/articles/technology.html site_1a/src/articles/technology.html
// 22a23
// >   <p>Added paragraph.</p>
// Only in site_1a/src/components: x.html
// diff -r site_1/src/layouts/home.html site_1a/src/layouts/home.html
// 4c4
// < <body class="p-2">
// ---
// > <body class="p-4">

describe("update", () => {
  it("should write the generated HTML file", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    updateDependencies(siteData)

    update("src/pages/index.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/index.html"), true)

    const html = fs.readFileSync(wd + "/dist/index.html")

    assert.match(html.toString(), /\bp-2\b/)
  })

  it("should regenerate a page dependent on an article", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    updateDependencies(siteData)
    update("src/pages/index.html", siteData)
    process.chdir(wd + "a")

    update("src/articles/technology.html", siteData)

    assert.equal(fs.existsSync(wd + "a/dist/index.html"), true)

    const html = fs.readFileSync(wd + "a/dist/index.html")

    assert.match(html.toString(), /Added paragraph./)
  })

  it("should regenerate a page dependent on a layout", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    updateDependencies(siteData)
    update("src/pages/index.html", siteData)
    process.chdir(wd + "a")

    update("src/layouts/home.html", siteData)

    assert.equal(fs.existsSync(wd + "a/dist/index.html"), true)

    const html = fs.readFileSync(wd + "a/dist/index.html")

    assert.match(html.toString(), /<body class="p-4">/)
  })

  it("should regenerate a page dependent on a component", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    updateDependencies(siteData)
    update("src/pages/index.html", siteData)
    process.chdir(wd + "a")

    update("src/components/hello.html", siteData)

    assert.equal(fs.existsSync(wd + "a/dist/index.html"), true)

    const html = fs.readFileSync(wd + "a/dist/index.html")

    assert.match(html.toString(), /\bgreat\b/)
  })

  it("should regenerate an article dependent on a component", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    create("src/articles/culture.html", siteData)
    process.chdir(wd + "a")

    create("src/components/x.html", siteData)
    update("src/articles/culture.html", siteData)
    update("src/components/hello.html", siteData)

    assert.equal(fs.existsSync(wd + "a/dist/articles/culture.html"), true)

    const html = fs.readFileSync(wd + "a/dist/articles/culture.html")

    assert.match(html.toString(), /\bCulture\b/)
    assert.match(html.toString(), /\bgreat\b/)
  })

  it("should regenerate all pages and articles", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "a/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    create("src/pages/index.html", siteData)
    create("src/articles/culture.html", siteData)
    process.chdir(wd + "a")

    update("src/site.toml", siteData)

    assert.equal(fs.existsSync(wd + "a/dist/index.html"), true)
    assert.equal(fs.existsSync(wd + "a/dist/articles/culture.html"), true)
  })
})

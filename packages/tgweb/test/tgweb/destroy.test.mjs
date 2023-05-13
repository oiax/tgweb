import assert from "node:assert/strict"
import { create } from "../../lib/tgweb/create.mjs"
import { destroy } from "../../lib/tgweb/destroy.mjs"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { updateDependencies } from "../../lib/tgweb/update_dependencies.mjs"
import { fileURLToPath } from "url";
import fs from "fs"
import * as PATH from "path"
import pretty from "pretty"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("destroy", () => {
  it("should process the deletion of a page", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    updateDependencies(siteData)
    create("src/pages/about.html", siteData)

    destroy("src/pages/about.html", siteData)

    assert.equal(!fs.existsSync(wd + "/dist/about.html"), true)

    const page = siteData.pages.find(p => p.path === "pages/about.html")

    assert.equal(page, undefined)
  })

  it("should process the deletion of an article", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    updateDependencies(siteData)
    create("src/articles/blog/a.html", siteData)

    destroy("src/articles/blog/a.html", siteData)

    assert.equal(!fs.existsSync(wd + "/dist/articles/blog/a.html"), true)

    const article = siteData.articles.find(a => a.path === "articles/blog/a.html")

    assert.equal(article, undefined)

    const index = siteData.pages.find(p => p.path === "pages/index.html")

    assert(!index.dependencies.includes("articles/blog/a"))

    assert.equal(fs.existsSync(wd + "/dist/articles/technology.html"), true)
  })

  it("should process the deletion of a page wrapper", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_2")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    updateDependencies(siteData)

    destroy("src/pages/etc/memo/_wrapper.html", siteData)

    const wrapper = siteData.wrappers.find(w => w.path === "pages/etc/memo/_wrapper.html")

    assert.equal(wrapper, undefined)

    const page = siteData.pages.find(p => p.path === "pages/etc/memo/memo1.html")

    assert(!page.dependencies.includes("pages/etc/memo/_wrapper"))
    assert(page.dependencies.includes("pages/etc/_wrapper"))
    assert.equal(fs.existsSync(wd + "/dist/etc/memo/memo1.html"), true)

    const html = fs.readFileSync(wd + "/dist/etc/memo/memo1.html")

    const lines = pretty(html.toString()).split("\n").filter(line => line !== "")

    const expected = [
      '<html>',
      '  <head>',
      '    <meta charset="utf-8">',
      '    <title>Memo 1</title>',
      '    <link rel="stylesheet" href="/css/tailwind.css">',
      '    <style>',
      '      [x-cloak] {',
      '        display: none !important;',
      '      }',
      '    </style>',
      '    <script src="/js/tgweb_utilities.js" defer></script>',
      '    <script src="/js/alpine.min.js" defer></script>',
      '    <script src="/reload/reload.js" defer></script>',
      '  </head>',
      '  <body class="p-2">',
      '    <header>HEADER</header>',
      '    <nav><a href="/">Index</a></nav>',
      '    <main class="py-2">',
      '      <h3 class="font-bold text-lg ml-2">MEMO</h3>',
      '      <p>This is a memo.</p>',
      '    </main>',
      '    <footer>FOOTER</footer>',
      '  </body>',
      '</html>'
    ]

    assert.deepEqual(lines, expected)
  })

  it("should process the deletion of an article wrapper", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_2")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    updateDependencies(siteData)

    destroy("src/articles/foo/_wrapper.html", siteData)

    const wrapper = siteData.wrappers.find(w => w.path === "articles/foo/_wrapper.html")

    assert.equal(wrapper, undefined)

    const article = siteData.articles.find(a => a.path === "articles/foo/bar/baz.html")

    assert(!article.dependencies.includes("articles/foo/_wrapper"))
    assert(article.dependencies.includes("articles/_wrapper"))
    assert.equal(fs.existsSync(wd + "/dist/articles/foo/bar/baz.html"), true)

    const html = fs.readFileSync(wd + "/dist/articles/foo/bar/baz.html").toString()

    assert.match(html, /bg-blue-100 py-2/)
  })

  it("should process the deletion of a layout", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_2")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    destroy("src/layouts/not_used.html", siteData)

    const layout = siteData.layouts.find(l => l.path === "layouts/not_used.html")

    assert.equal(layout, undefined)
  })

  it("should process the deletion of a component", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_2")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    destroy("src/components/not_used.html", siteData)

    const component = siteData.components.find(l => l.path === "layouts/not_used.html")

    assert.equal(component, undefined)
  })

  it("should process the deletion of the site.toml", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_0")
    process.chdir(wd + "a")
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    process.chdir(wd)

    destroy("src/site.toml", siteData)

    assert.deepEqual(siteData.properties,
      {host: "localhost", port: 3000, "root-url": "http://localhost:3000/", scheme: "http"})

    const page = siteData.pages.find(p => p.path === "pages/index.html")

    assert.equal(page.frontMatter["data-current-year"], undefined)
    assert.equal(fs.existsSync(wd + "/dist/index.html"), true)
  })
})

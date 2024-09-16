import assert from "node:assert/strict"
import { createInitially } from "../../lib/tgweb/create_initially.mjs"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { fileURLToPath } from "url";
import fs from "fs"
import * as PATH from "path"
import pretty from "pretty"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("createInitially", () => {
  it("should write the generated HTML file for a page", () => {
    const wd = PATH.resolve(__dirname, "../sites/minimum")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    createInitially("src/pages/index.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/index.html"), true)

    const html = pretty(fs.readFileSync(wd + "/dist/index.html").toString(), {ocd: true})

    const lines = html.trim().split("\n")

    const expected = [
      '<html>',
      '  <head>',
      '    <meta charset="utf-8">',
      '    <title>Hello, world!</title>',
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '    <meta name="googlebot" content="index,follow">',
      '    <meta name="googlebot" content="notranslate">',
      '    <meta name="description" content="Description">',
      '    <meta property="og:description" content="Description">',
      '    <link rel="stylesheet" href="/css/tailwind.css">',
      '    <style>',
      '      [x-cloak] {',
      '        display: none !important;',
      '      }',
      '    </style>',
      '    <script src="/js/tgweb_utilities.js" defer></script>',
      '    <script src="/js/alpine.min.js" defer></script>',
      '    <script type="module" src="/js/tgweb_lottie_player.js"></script>',
      '    <script src="/reload/reload.js" defer></script>',
      '  </head>',
      '  <body>',
      '    <h1 class="text-xl m-2">Hello, world!</h1>',
      '    <p class="m-1">I am a <em>computer</em>.</p>',
      '  </body>',
      '</html>'
    ]

    assert.deepEqual(lines, expected)
  })

  it("should write the generated HTML file for an article", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_articles")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    createInitially("src/articles/about_me.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/articles/about_me.html"), true)

    const html = fs.readFileSync(wd + "/dist/articles/about_me.html").toString()

    assert.match(html, /About me/)
  })

  it("should not generate an HTML file for an article with embedded-only property", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    createInitially("src/articles/embedded_only.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/articles/embedded_only.html"), false)
  })

  it("should copy the specified image file to dist directory", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    createInitially("src/images/red_square.png", siteData)

    assert.equal(fs.existsSync(wd + "/dist/images/red_square.png"), true)
  })

  it("should copy the specified audio file to dist directory", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    createInitially("src/audios/dummy.mp3", siteData)

    assert.equal(fs.existsSync(wd + "/dist/audios/dummy.mp3"), true)
  })

  it("should render a page with Japanese text", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_2")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    createInitially("src/pages/index_ja.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/index_ja.html"), true)

    const html = fs.readFileSync(wd + "/dist/index_ja.html").toString()

    assert.match(html, /世界/)
  })

  it("should not render a draft page", () => {
    const wd = PATH.resolve(__dirname, "../sites/draft")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    createInitially("src/pages/draft.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/draft.html"), false)
  })

  it("should render a draft page", () => {
    const wd = PATH.resolve(__dirname, "../sites/draft")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    siteData.options.buildDrafts = true

    createInitially("src/pages/draft.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/draft.html"), true)
  })

  it("should not render a draft article", () => {
    const wd = PATH.resolve(__dirname, "../sites/draft")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)

    createInitially("src/articles/b.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/articles/b.html"), false)
  })

  it("should render a draft article", () => {
    const wd = PATH.resolve(__dirname, "../sites/draft")
    process.chdir(wd)
    fs.rmSync(wd + "/dist", { force: true, recursive: true })
    const siteData = getSiteData(wd)
    siteData.options.buildDrafts = true

    createInitially("src/articles/b.html", siteData)

    assert.equal(fs.existsSync(wd + "/dist/articles/b.html"), true)
  })
})

import assert from "node:assert/strict"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { fileURLToPath } from "url";
import * as PATH from "path"
import pretty from "pretty"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("getSiteData", () => {
  it("should interpret the front matter correctly", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const page = siteData.pages.find(page => page.path == "index.html")

    assert.equal(page.frontMatter["layout"], "home")
    assert.equal(page.frontMatter["title"], "Home")
    assert.equal(page.frontMatter["property-fb:app_id"], "0123456789abced")
  })

  it("should process a page without <body> and </body> tags", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const page = siteData.pages.find(page => page.path == "div_only.html")
    const lines = pretty(page.dom.window.document.body.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<body>',
      '  <div>DIV ONLY</div>',
      '</body>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should process an empty page", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const page = siteData.pages.find(page => page.path == "empty.html")
    const lines = pretty(page.dom.window.document.body.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<body></body>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should interpret the class aliases correctly", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    const siteData = getSiteData(wd)

    const page = siteData.pages.find(page => page.path == "index.html")

    assert.equal(page.frontMatter["class-h3"], "font-bold text-lg ml-2")
    assert.equal(page.frontMatter["class-three-cols"],
      "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3")
  })

  it("should return the site data with articles", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    assert.equal(siteData.articles.length, 8)
  })

  it("should return the site data with dependencies", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    const layout = siteData.layouts.find(layout => layout.path == "home.html")
    assert.equal(layout.dependencies.length, 3)

    const page = siteData.pages.find(page => page.path == "index.html")

    const expected1 = [
      'articles/blog/_wrapper',
      'articles/blog/a',
      'articles/blog/c',
      'articles/blog/d',
      'articles/blog/e',
      'articles/technology',
      'components/hello',
      'components/i_am',
      'components/special',
      'layouts/home',
      'pages/_wrapper',
      'segments/apps/fizz_buzz',
      'segments/nav'
    ]

    assert.deepEqual(page.dependencies, expected1)

    const article = siteData.articles.find(article => article.path == "blog/a.html")

    const expected2 = [
      'articles/blog/_wrapper',
      'layouts/blog_article',
      'segments/blog_nav'
    ]

    assert.deepEqual(article.dependencies, expected2)
  })

  it("should return the site data with wrappers", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    assert.equal(siteData.wrappers.length, 2)

    const wrapper = siteData.wrappers[0]

    assert.equal(wrapper.frontMatter["layout"], "blog_article")
  })

  it("should return the site data with site properties", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    assert.equal(siteData.properties["title"], "No Title")
  })

  it("should return the site data with Japanese text", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    const siteData = getSiteData(wd)

    const page = siteData.pages.find(page => page.path == "index_ja.html")
    assert.equal(page.frontMatter["title"], "ホーム")

    const comp = siteData.components.find(comp => comp.path == "world.html")

    assert(comp.dom.window.document.body.outerHTML.includes("世界"))
  })
})


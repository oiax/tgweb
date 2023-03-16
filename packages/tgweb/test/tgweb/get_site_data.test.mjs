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

    assert.equal(page.frontMatter["property-og:image"],
      "http://localhost:3000/images/icons/default.png")
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

  it("should make the page front matter inherit site and wrapper properties", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    const page = siteData.pages.find(page => page.path == "index.html")

    assert.equal(page.frontMatter["layout"], "home")
    assert.equal(page.frontMatter["title"], "FizzBuzz")
    assert.equal(page.frontMatter["data-current-year"], 2023)
    assert.equal(page.frontMatter["class-div1"], undefined)
  })

  it("should make the page front matter inherit layout properties", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const page = siteData.pages.find(page => page.path == "index.html")

    assert.equal(page.frontMatter["http-equiv-content-security-policy"], "default-src 'self'")
    assert.equal(page.frontMatter["title"], "Home")
    assert.equal(page.frontMatter["class-grid"], undefined)
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

  it("should make the article front matter inherit site and wrapper properties", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    const article = siteData.articles.find(article => article.path == "blog/a.html")

    assert.equal(article.frontMatter["layout"], "blog_article")
    assert.equal(article.frontMatter["title"], "Y")
    assert.equal(article.frontMatter["data-current-year"], 2023)
    assert.equal(article.frontMatter["property-og:image"],
      "http://localhost:3000/images/red_square.png")
    assert.equal(article.frontMatter["data-w"], 0)
    assert.equal(article.frontMatter["data-x"], 0)
    assert.equal(article.frontMatter["data-y"], 2)
    assert.equal(article.frontMatter["data-z"], 3)
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
      'segments/blog_nav',
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
    assert.equal(wrapper.frontMatter["data-current-year"], 2023)
  })

  it("should return the site data with site properties", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    assert.equal(siteData.properties["title"], "No Title")
    assert.equal(siteData.properties["data-current-year"], 2023)
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


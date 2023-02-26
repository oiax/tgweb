import assert from "node:assert/strict"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { updateSiteData } from "../../lib/tgweb/update_site_data.mjs"
import { fileURLToPath } from "url";
import * as PATH from "path"
import pretty from "pretty"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

const dbg = arg => console.log(arg)

const pp = element => {
  console.log("<<<<")
  console.log(pretty(element.outerHTML, {ocd: true}))
  console.log(">>>>")
}

// Prevent warnings when functions dbg and pp are not used.
if (dbg === undefined) { dbg() }
if (pp === undefined) { pp() }

describe("updateSiteData", () => {
  it("should update all front matters", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    process.chdir(wd + "b")

    updateSiteData(siteData, "src/site.yml")

    const page = siteData.pages.find(p => p.path === "index.html")
    assert(page)

    assert.equal(page.frontMatter["title"], "FizzBuzz")
    assert.equal(page.frontMatter["layout"], "home")
    assert.equal(page.frontMatter["data-current-year"], 2024)
  })

  it("should update a page template", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    process.chdir(wd + "a")

    updateSiteData(siteData, "src/components/x.html")
    updateSiteData(siteData, "src/articles/culture.html")
    updateSiteData(siteData, "src/pages/index.html")

    const page = siteData.pages.find(p => p.path === "index.html")
    assert(page)

    const body = page.dom.window.document.body
    const p = body.querySelector("p")
    assert.equal(p.textContent, "Added paragraph.")

    assert.equal(page.frontMatter["title"], "FizzBuzz")
    assert.equal(page.frontMatter["layout"], "home")
    assert.equal(page.frontMatter["data-current-year"], 2023)

    const expected = [
      'articles/blog/b',
      'articles/culture',
      'components/hello',
      'components/i_am',
      'components/nav',
      'components/special',
      'components/x',
      'layouts/home',
      'pages/_wrapper'
    ]

    assert.deepEqual(page.dependencies, expected)
  })

  it("should update an article template", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    process.chdir(wd + "a")

    updateSiteData(siteData, "src/articles/culture.html")

    const article = siteData.articles.find(a => a.path === "culture.html")
    assert(article)

    const body = article.dom.window.document.body
    const p = body.querySelector("p")
    assert.equal(p.textContent, "Added paragraph.")

    assert.equal(article.frontMatter["class-div1"], "bg-red-100 py-2")

    const expected = [
      'articles/blog/b',
      'components/hello',
      'components/i_am',
      'components/nav',
      'components/x',
      'layouts/home'
    ]

    assert.deepEqual(article.dependencies.sort(), expected)
  })

  it("should update a wrapper template", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    process.chdir(wd + "a")

    updateSiteData(siteData, "src/pages/_wrapper.html")

    const wrapper = siteData.wrappers.find(w => w.path === "pages/_wrapper.html")
    assert(wrapper)

    const body = wrapper.dom.window.document.body
    const p = body.querySelector("p")
    assert.equal(p.textContent, "Added paragraph.")

    assert.equal(wrapper.frontMatter["class-div1"], "bg-blue-100 py-2")
  })

  it("should update a component template", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    process.chdir(wd + "a")

    updateSiteData(siteData, "src/components/hello.html")

    const component = siteData.components.find(c => c.path === "hello.html")
    assert(component)

    const body = component.dom.window.document.body
    const p = body.querySelector("p")
    assert.equal(p.textContent, "Added paragraph.")

    assert.equal(component.frontMatter["class-div1"], "bg-blue-100 p-2")
  })
})

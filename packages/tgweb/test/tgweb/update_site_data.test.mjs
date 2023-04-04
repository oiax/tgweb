import assert from "node:assert/strict"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { updateDependencies } from "../../lib/tgweb/update_dependencies.mjs"
import { updateSiteData } from "../../lib/tgweb/update_site_data.mjs"
import { fileURLToPath } from "url";
import * as PATH from "path"
// import pretty from "pretty"
import { inspectDom } from "../../lib/utils/inspect_dom.mjs"
import { DomUtils } from "htmlparser2"

// Prevent warnings when function inspectDom is not used.
if (inspectDom === undefined) { inspectDom() }

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

// $ diff -r site_1/src site_1a/src
// diff -r site_1/src/articles/culture.html site_1b/src/articles/culture.html
// 3c3
// < class-div1: "bg-gray-100 py-2"
// ---
// > class-div1: "bg-red-100 py-2"
// 6a7
// >   <p>Added paragraph.</p>
// diff -r site_1/src/components/hello.html site_1b/src/components/hello.html
// 2c2
// < class-div1: "bg-gray-100 p-2"
// ---
// > class-div1: "bg-blue-100 p-2"
// 4a5
// >   <p>Added paragraph.</p>
// diff -r site_1/src/pages/_wrapper.html site_1b/src/pages/_wrapper.html
// 2c2
// < class-div1: "bg-gray-100 py-2"
// ---
// > class-div1: "bg-blue-100 py-2"
// 9a10
// >   <p>Added paragraph.</p>
// diff -r site_1/src/pages/index.html site_1b/src/pages/index.html
// 2a3
// > layout: home
// 11a13
// >   <p>Added paragraph.</p>

describe("updateSiteData", () => {
  it("should update all front matters", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    const siteData = getSiteData(wd)
    updateDependencies(siteData)

    process.chdir(wd + "b")

    updateSiteData(siteData, "src/site.yml")

    const page = siteData.pages.find(p => p.path === "pages/index.html")
    assert(page)

    assert.equal(page.frontMatter["title"], "FizzBuzz")
    assert.equal(page.frontMatter["layout"], "home")
  })

  it("should update a page template", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    const siteData = getSiteData(wd)
    updateDependencies(siteData)

    process.chdir(wd + "b")

    updateSiteData(siteData, "src/pages/index.html")

    const page = siteData.pages.find(p => p.path === "pages/index.html")
    assert(page)

    const p = DomUtils.find(node => node.name === "p", page.dom.children, true)
    assert.equal(DomUtils.textContent(p), "Added paragraph.")
  })

  it("should update an article template", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    const siteData = getSiteData(wd)
    updateDependencies(siteData)

    process.chdir(wd + "b")

    updateSiteData(siteData, "src/articles/culture.html")

    const article = siteData.articles.find(a => a.path === "articles/culture.html")
    assert(article)

    const p = DomUtils.find(node => node.name === "p", article.dom.children, true)
    assert.equal(DomUtils.textContent(p), "Added paragraph.")

    assert.equal(article.frontMatter.style["div1"], "bg-red-100 py-2")
  })

  it("should update a wrapper template", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    const siteData = getSiteData(wd)
    updateDependencies(siteData)

    process.chdir(wd + "b")

    updateSiteData(siteData, "src/pages/_wrapper.html")

    const wrapper = siteData.wrappers.find(w => w.path === "pages/_wrapper.html")
    assert(wrapper)

    const p = DomUtils.find(node => node.name === "p", wrapper.dom.children, true)
    assert.equal(DomUtils.textContent(p), "Added paragraph.")

    assert.equal(wrapper.frontMatter.style["div1"], "bg-blue-100 py-2")
  })

  it("should update a component template", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    const siteData = getSiteData(wd)
    updateDependencies(siteData)

    process.chdir(wd + "b")

    updateSiteData(siteData, "src/components/hello.html")

    const component = siteData.components.find(c => c.path === "components/hello.html")
    assert(component)

    const p = DomUtils.findOne(node => node.name === "p", component.dom.children, true)
    assert.equal(DomUtils.textContent(p), "Added paragraph.")

    assert.equal(component.frontMatter.style["div1"], "bg-blue-100 p-2")
  })
})

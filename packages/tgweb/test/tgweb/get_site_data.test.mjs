import assert from "node:assert/strict"
import { getSiteData, updateSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { fileURLToPath } from "url";
import * as PATH from "path"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("getSiteData", () => {
  it("should return the site data with articles", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    assert.equal(siteData.articles.length, 6)
  })

  it("should return the site data with dependencies", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    const layout = siteData.layouts.find(layout => layout.path == "home.html")
    assert.equal(layout.dependencies.length, 3)

    const page = siteData.pages.find(page => page.path == "index.html")
    assert(page.dependencies.includes("pages/_wrapper"))
    assert(page.dependencies.includes("layouts/home"))
    assert(page.dependencies.includes("components/nav"))
    assert(page.dependencies.includes("components/hello"))
    assert(page.dependencies.includes("components/i_am"))
  })

  it("should return the site data with wrappers", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    assert.equal(siteData.wrappers.length, 2)
  })
})

describe("updateSiteData", () => {
  it("should update a wrapper of the site data", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    process.chdir(wd)

    siteData.wrappers = siteData.wrappers.map(w => {
      if (w.path === "pages/_wrapper.html") {
        w.dom = undefined
      }

      return w
    })

    updateSiteData(siteData, "src/pages/_wrapper.html")

    const wrapper = siteData.wrappers.find(w => w.path === "pages/_wrapper.html")
    assert(wrapper)
    assert(wrapper.dom)
  })
})

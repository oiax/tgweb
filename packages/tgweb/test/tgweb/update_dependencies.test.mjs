import assert from "node:assert/strict"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { updateDependencies } from "../../lib/tgweb/update_dependencies.mjs"
import { fileURLToPath } from "url";
import * as PATH from "path"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("updateDependencies", () => {
  it("should set dependencies of 'with_layout' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_layout")
    const siteData = getSiteData(wd)
    const page = siteData.pages.find(p => p.path === "pages/index.html")

    updateDependencies(siteData)

    assert.deepEqual(page.dependencies, ["layouts/default"])
  })

  it("should set dependencies of 'with_component' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_component")
    const siteData = getSiteData(wd)
    const page = siteData.pages.find(p => p.path === "pages/index.html")

    updateDependencies(siteData)

    assert.deepEqual(page.dependencies, ["components/badge", "components/message"])
  })

  it("should set dependencies of 'with_segment' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_segment")
    const siteData = getSiteData(wd)
    const page = siteData.pages.find(p => p.path === "pages/index.html")

    updateDependencies(siteData)

    assert.deepEqual(page.dependencies, ["articles/x", "segments/hero"])
  })

  it("should set dependencies of 'with_wrapper_and_layout' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_wrapper_and_layout")
    const siteData = getSiteData(wd)
    const page = siteData.pages.find(p => p.path === "pages/index.html")

    updateDependencies(siteData)

    assert.deepEqual(page.dependencies, ["layouts/default", "pages/_wrapper"])
  })

  it("should set dependencies of 'index.html' of 'with_articles' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_articles")
    const siteData = getSiteData(wd)
    const page = siteData.pages.find(p => p.path === "pages/index.html")

    updateDependencies(siteData)

    const expected = [
      "articles/_wrapper",
      "articles/about_me",
      "articles/blog/a",
      "articles/blog/b",
      "layouts/default"
    ]

    assert.deepEqual(page.dependencies, expected)
  })

  it("should set dependencies of 'info.html' of 'with_articles' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_articles")
    const siteData = getSiteData(wd)

    updateDependencies(siteData)

    const wrapper = siteData.wrappers.find(w => w.path === "articles/info/_wrapper.html")

    assert.deepEqual(wrapper.dependencies, ["components/badge"])

    const page = siteData.pages.find(p => p.path === "pages/info.html")

    const expected = [
      "articles/info/_wrapper",
      "articles/info/i",
      "articles/info/j",
      "articles/info/k",
      "components/badge",
      "layouts/default"
    ]

    assert.deepEqual(page.dependencies, expected)
  })

  it("should set dependencies of 'index.html' of 'with_links' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_links")
    const siteData = getSiteData(wd)
    const page = siteData.pages.find(p => p.path === "pages/index.html")

    updateDependencies(siteData)

    const expected = [
      "components/nav_link",
      "layouts/default",
      "segments/header"
    ]

    assert.deepEqual(page.dependencies, expected)
  })

  it("should set dependencies of 'index.html' of 'with_link_list' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_link_list")
    const siteData = getSiteData(wd)
    const page = siteData.pages.find(p => p.path === "pages/index.html")

    updateDependencies(siteData)

    const expected = [
      "articles/blog/a",
      "articles/blog/b",
      "layouts/default"
    ]

    assert.deepEqual(page.dependencies, expected)
  })

  it("should set dependencies of 'info.html' of 'with_link_list' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_link_list")
    const siteData = getSiteData(wd)
    const page = siteData.pages.find(p => p.path === "pages/info.html")

    updateDependencies(siteData)

    const expected = [
      "articles/info/i",
      "articles/info/j",
      "articles/info/k",
      "components/nav_link",
      "layouts/default"
    ]

    assert.deepEqual(page.dependencies, expected)
  })
})

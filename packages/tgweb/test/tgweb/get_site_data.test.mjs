import assert from "node:assert/strict"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { fileURLToPath } from "url";
import * as PATH from "path"
import render from "dom-serializer"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("getSiteData", () => {
  it("should interpret the site.toml correctly", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_1")
    const siteData = getSiteData(wd)

    assert.equal(siteData.properties.main.layout, "home")
  })

  it("should interpret the front matter correctly", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_0")
    const siteData = getSiteData(wd)

    const page = siteData.pages.find(page => page.path == "pages/index.html")

    assert.equal(page.frontMatter["main"]["layout"], "home")
    assert.equal(page.frontMatter["main"]["title"], "Home")
    assert.equal(page.frontMatter["meta"]["viewport"], "width=device-width, initial-scale=1")
    assert.equal(page.frontMatter["meta-property"]["fb:app_id"], "0123456789abced")
  })

  it("should process a page without <body> and </body> tags", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_0")
    const siteData = getSiteData(wd)

    const page = siteData.pages.find(page => page.path == "pages/div_only.html")

    const html = render(page.dom)
    assert.equal(html, "<div>DIV ONLY</div>\n")
  })

  it("should process an empty page", () => {
    const wd = PATH.resolve(__dirname, "../sites/site_0")
    const siteData = getSiteData(wd)

    const page = siteData.pages.find(page => page.path == "pages/empty.html")

    const html = render(page.dom)
    assert.equal(html, "")
  })

  it("should get site date of 'minimum' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/minimum")
    const siteData = getSiteData(wd)

    assert.equal(siteData.properties.meta.viewport, "width=device-width, initial-scale=1.0")

    const page = siteData.pages.find(page => page.path == "pages/index.html")
    assert.equal(page.path, "pages/index.html")

    const html = render(page.dom, {encodeEntities: false})
    const lines = html.trim().split("\n")

    const expected = [
      '<h1 class="text-xl m-2">Hello, world!</h1>',
      '<p class="m-1">I am a <em>computer</em>.</p>'
    ]

    assert.deepEqual(lines, expected)
  })

  it("should get site date of 'minimum_with_title' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/minimum_with_title")
    const siteData = getSiteData(wd)

    assert.equal(siteData.properties.meta.viewport, "width=device-width, initial-scale=1.0")

    const page = siteData.pages.find(page => page.path == "pages/index.html")
    assert.equal(page.path, "pages/index.html")
    assert.equal(page.frontMatter.main.title, "Greeting")

    const html = render(page.dom, {encodeEntities: false})
    const lines = html.trim().split("\n")

    const expected = [
      '<h1 class="text-xl m-2">Hello, world!</h1>',
      '<p class="m-1">I am a <em>computer</em>.</p>'
    ]

    assert.deepEqual(lines, expected)
  })

  it("should get site date of 'with_layout' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_layout")
    const siteData = getSiteData(wd)

    const layout = siteData.layouts[0]
    assert.equal(layout.frontMatter.style["div1"], "my-4 p-2 bg-blue-100")

    const html = render(layout.dom, {encodeEntities: false})
    const lines = html.trim().split("\n")

    const expected = [
      '<body>',
      '  <header>Header</header>',
      '  <div class="my-4 p-2 bg-blue-100">',
      '    <tg:content></tg:content>',
      '    <div>',
      '      <tg:slot name="x"></tg:slot>',
      '      <tg:data name="y"></tg:data>',
      '    </div>',
      '    <tg:if-complete>',
      '      <div>',
      '        <tg:slot name="x"></tg:slot>',
      '      </div>',
      '    </tg:if-complete>',
      '    <tg:if-complete>',
      '      <div>',
      '        <tg:slot name="z"></tg:slot>',
      '      </div>',
      '    </tg:if-complete>',
      '  </div>',
      '  <footer>Footer</footer>',
      '</body>'
    ]

    assert.deepEqual(lines, expected)
  })

  it("should get site date of 'with_wrapper' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_wrapper")
    const siteData = getSiteData(wd)

    const wrapper = siteData.wrappers[0]

    assert.equal(
      wrapper.frontMatter.style["div1"],
      "my-4 p-2 bg-green-100 md:my-6 md:p-4 [&>p]:mb-2 [&>p]:p-1"
    )

    const html = render(wrapper.dom, {encodeEntities: false})
    const lines = html.trim().split("\n")

    const expected = [
      '<div class="my-4 p-2 bg-green-100 md:my-6 md:p-4 [&>p]:mb-2 [&>p]:p-1">',
      '  <tg:content></tg:content>',
      '  <tg:if-complete>',
      '    <div>',
      '      <tg:slot name="x"></tg:slot>',
      '    </div>',
      '  </tg:if-complete>',
      '</div>'
    ]

    assert.deepEqual(lines, expected)
  })

  it("should get site date of 'with_segment' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_segment")
    const siteData = getSiteData(wd)

    const segment = siteData.segments[0]
    assert.equal(segment.path, "segments/hero.html")
  })

  it("should get site date of 'with_component' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_component")
    const siteData = getSiteData(wd)

    const component = siteData.components[0]
    assert.equal(component.path, "components/badge.html")

    const span = component.dom.children[0]
    assert.deepEqual(span.attribs, { class: "${class} badge badge-primary" })

    const html = render(component.dom, {encodeEntities: false})
    const lines = html.trim().split("\n")

    const expected = [
      '<span class="${class} badge badge-primary">',
      '  <tg:data name="mark">?</tg:data>',
      '  <tg:data name="letter"></tg:data>',
      '  <tg:content></tg:content>',
      '  <tg:slot name="x"></tg:slot>',
      '</span>'
    ]

    assert.deepEqual(lines, expected)
  })

  it("should get site date of 'with_articles' site", () => {
    const wd = PATH.resolve(__dirname, "../sites/with_articles")
    const siteData = getSiteData(wd)

    assert.equal(siteData.articles.length, 7)

    const article = siteData.articles[0]
    assert.equal(article.path, "articles/about_me.html")

    const html = render(article.dom, {encodeEntities: false})
    const lines = html.trim().split("\n")

    const expected = [
      '<h1 class="text-xl m-2">About me</h1>',
      '<p class="m-1">My name is Alice.</p>'
    ]

    assert.deepEqual(lines, expected)
  })
})

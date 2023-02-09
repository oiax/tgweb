import assert from "node:assert/strict"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import generateHTML from "../../lib/tgweb/generate_html.mjs"
import { JSDOM } from "jsdom"
import { fileURLToPath } from "url";
import * as PATH from "path"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("generateHTML", () => {
  it("should embed the given page into the document template", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/about.html", siteData)
    const dom = new JSDOM(html)

    const head = dom.window.document.head

    const title = head.querySelector("title")
    assert.equal(title.textContent, "About")

    const script = head.querySelector("script")
    assert.equal(script.attributes.getNamedItem("src").value, "/reload/reload.js")
    assert.equal(script.attributes.getNamedItem("defer").value, "")
  })

  it("should embed the given page into the specified layout", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/index.html", siteData)
    const dom = new JSDOM(html)

    const head = dom.window.document.head

    const title = head.querySelector("title")
    assert.equal(title.textContent, "Home")

    const body = dom.window.document.body
    const div0 = body.children[0]
    assert.equal(div0.attributes.length, 1)

    const h3 = body.querySelector("h3")
    assert.equal(h3.textContent, "Greeting")
  })

  it("should embed contents into slots within layout", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/product1.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body
    const div1 = body.children[1]
    assert.equal(div1.textContent.trim(), "This product is very fragile.")

    const div2 = body.children[2]
    assert.equal(div2.children[0].tagName, "SPAN")
    assert.equal(div2.children[0].textContent, "A")
    assert.equal(div2.children[1].textContent, "B")
  })

  it("should omit an element with tg-if-complete attribute", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/product2.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body
    assert.equal(body.children.length, 2)

    const div1 = body.children[1]
    assert.equal(div1.textContent, "*")
  })

  it("should merge a layout, a page and components", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)
    assert.equal(siteData.pages.length, 1)

    const html = generateHTML("src/index.html", siteData)
    const dom = new JSDOM(html)

    const head = dom.window.document.head

    const title = head.querySelector("title")
    assert.equal(title.textContent, "FizzBuzz")

    const script = head.querySelector("script")
    assert.equal(script.attributes.getNamedItem("src").value, "/reload/reload.js")
    assert.equal(script.attributes.getNamedItem("defer").value, "")

    const body = dom.window.document.body
    const h3 = body.querySelector("h3")
    assert.equal(h3.textContent, "FizzBuzz")

    const grid = body.children[0]
    const div0 = grid.children[0]
    const p01 = div0.children[0]
    assert.equal(p01.textContent, "Hello, world!")

    const div1 = grid.children[1]
    const p10 = div1.children[0]
    assert.equal(p10.textContent, "I am a computer.")

    const div2 = grid.children[2]
    assert.equal(div2.attributes.getNamedItem("tg-layout"), null)

    const main = div2.children[2]
    assert.equal(main.children.length, 4)

    const tech = main.children[0]
    assert.equal(tech.attributes.getNamedItem("tg-layout"), null)

    const tech1 = main.children[1]

    assert.equal(tech1.attributes.getNamedItem("tg-layout"), null)
    assert.equal(tech1.attributes.getNamedItem("tg-tag"), null)
    assert.equal(tech1.children[0].textContent.trim(), "A")

    const tech2 = main.children[2]
    assert.equal(tech2.children[0].textContent.trim(), "D")

    const tech3 = main.children[3]
    assert.equal(tech3.children[0].textContent.trim(), "C")
  })

  it("should generate a link list", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)
    assert.equal(siteData.pages.length, 1)

    const html = generateHTML("src/articles/technology.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body
    const list = body.querySelector("nav > ul")

    assert.equal(list.children.length, 3)

    const link0 = list.children[0].children[0]

    assert.equal(link0.href, "blog/a.html")
    assert.equal(link0.textContent, "A")
    assert.equal(link0.attributes.getNamedItem("tg-text"), null)
  })

  it("should merge attributes of article and component", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/articles/blog/b.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body
    const h3 = body.querySelector("h3")

    assert.equal(h3.textContent.trim(), "B")

    const dateDiv = body.children[1].children[1]
    assert.equal(dateDiv.textContent, "2023-01-01")
  })
})

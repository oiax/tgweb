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
    assert.equal(siteData.pages.length, 1)

    const html = generateHTML("src/index.html", siteData)
    const dom = new JSDOM(html)

    const head = dom.window.document.head

    const title = head.querySelector("title")
    assert.equal(title.textContent, "Home")

    const script = head.querySelector("script")
    assert.equal(script.attributes.getNamedItem("src").value, "/reload/reload.js")
    assert.equal(script.attributes.getNamedItem("defer").value, "")

    const body = dom.window.document.body
    const div0 = body.children[0]
    assert.equal(div0.attributes.length, 1)

    const h3 = body.querySelector("h3")
    assert.equal(h3.textContent, "Greeting")
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
    const span102 = p10.children[2]
    assert.equal(span102.textContent, "computer")
    assert.equal(span102.attributes.getNamedItem("tg-text"), null)

    const div2 = grid.children[2]
    assert.equal(div2.attributes.getNamedItem("tg-layout"), null)

    const main = div2.children[2]
    assert.equal(main.children.length, 4)

    const tech = main.children[0]
    assert.equal(tech.attributes.getNamedItem("tg-layout"), null)

    const tech1 = main.children[1]
    assert.equal(tech1.attributes.getNamedItem("tg-layout"), null)
    assert.equal(tech1.attributes.getNamedItem("tg-tag"), null)
    assert.equal(tech1.children[0].textContent, "D")

    const tech2 = main.children[2]
    assert.equal(tech2.children[0].textContent, "C")

    const tech3 = main.children[3]
    assert.equal(tech3.children[0].textContent, "A")
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

    assert.equal(h3.textContent, "B")

    const dateDiv = body.children[1].children[1]
    assert.equal(dateDiv.textContent, "2023-01-01")
  })
})

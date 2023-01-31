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
    const script = head.querySelector("script")
    assert.equal(script.attributes.getNamedItem("src").value, "/reload/reload.js")
    assert.equal(script.attributes.getNamedItem("defer").value, "")

    const body = dom.window.document.body
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
  })
})

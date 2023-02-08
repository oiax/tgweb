import assert from "node:assert/strict"
import { JSDOM } from "jsdom"

describe("JSDOM", () => {
  it("accepts <tg-content></tg-content>", () => {
    const html =
      "<body><header>HEADER</header><tg-content></tg-content><footer>FOOTER</footer></body>"

    const dom = new JSDOM(html)
    const body = dom.window.document.body

    assert.equal(body.children.length, 3)
    assert.equal(body.children[1].tagName, "TG-CONTENT")

    const content = body.querySelector("tg-content")
    assert.equal(content.tagName, "TG-CONTENT")
  })

  it("parse text as a XML document", () => {
    const { window } = new JSDOM("")

    const html =
      "<body foo='1'><header>HEADER</header><tg-content /><footer>FOOTER</footer></body>"

    const dom = new window.DOMParser().parseFromString(html, "text/xml")
    const body = dom.documentElement

    assert.equal(body.tagName, "body")
    assert.equal(body.getAttribute("foo"), "1")
    assert.equal(body.childNodes.length, 3)

    const header = body.childNodes[0]
    assert.equal(header.textContent, "HEADER")

    const tgContent = body.childNodes[1]
    assert.equal(tgContent.tagName, "tg-content")

    const footer = body.childNodes[2]
    assert.equal(footer.textContent, "FOOTER")

    const targets = body.querySelectorAll("tg-content")
    assert.equal(targets.length, 1)

    const dom2 = new window.DOMParser().parseFromString("<div>A</div>", "text/xml")
    const div = dom2.documentElement

    targets.forEach(target => target.replaceWith(div))

    const result = body.outerHTML

    const dom3 = new JSDOM(result)
    const c1 = dom3.window.document.body.children[1]
    assert.equal(c1.textContent, "A")
  })

  it("rejects a malformed XML document", () => {
    const { window } = new JSDOM("")
    const html = "<body><div><span></div></body>"

    const dom = new window.DOMParser().parseFromString(html, "text/xml")

    assert.equal(dom.documentElement.tagName, "parsererror")
    assert.equal(dom.documentElement.textContent, "1:23: unexpected close tag.")
  })
})

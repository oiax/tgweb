import assert from "node:assert/strict"
import { JSDOM } from "jsdom"

describe("JSDOM", () => {
  it("accepts <tg-content />", () => {
    const html = "<body><header>HEADER</header><tg-content /></body>"
    const dom = new JSDOM(html)
    const body = dom.window.document.body

    assert.equal(body.children.length, 2)
    assert.equal(body.children[1].tagName, "TG-CONTENT")

    const content = body.querySelector("tg-content")
    assert.equal(content.tagName, "TG-CONTENT")
  })
})

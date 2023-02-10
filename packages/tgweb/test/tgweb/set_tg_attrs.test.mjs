import assert from "node:assert/strict"
import { setTgAttrs } from "../../lib/tgweb/set_tg_attrs.mjs"
import { JSDOM } from "jsdom"

describe("setTgAttrs", () => {
  it("should set a hash to tgAttrs attribute", () => {
    const html =
      "<div tg-component='button'><span tg-slot='label'>Push</span></div>"

    const dom = new JSDOM(html)
    const div = dom.window.document.body.children[0]

    setTgAttrs(div)

    assert.equal(div.tgAttrs["component"], "button")

    const span = div.children[0]

    setTgAttrs(span)

    assert.equal(span.tgAttrs["slot"], "label")
  })

  it("should handle 'tg-order-by' correctly", () => {
    const html = "<div tg-articles='blog/*' tg-order-by='index:asc'></div>"
    const dom = new JSDOM(html)
    const div = dom.window.document.body.children[0]

    setTgAttrs(div)

    assert.equal(div.tgAttrs["order-by"], "index:asc")
  })
})

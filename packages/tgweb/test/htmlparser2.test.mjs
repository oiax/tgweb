import assert from "node:assert/strict"

import { parseDocument } from "htmlparser2"
import { inspectDom } from "../lib/utils/inspect_dom.mjs"

// Prevent warnings when function inspectDom is not used.
if (inspectDom === undefined) { inspectDom() }

describe("parseDocument", () => {
  it("accepts <tg-content></tg-content>", () => {
    const html = "<div><div tg-app-code-name='alice.oiax/fizz_buzz'></div></div>"
    const dom = parseDocument(html)

    const div = dom.children[0].children[0]

    assert.equal(div.attribs["tg-app-code-name"], "alice.oiax/fizz_buzz")
  })
})

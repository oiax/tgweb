import assert from "node:assert/strict"
import { getTemplate } from "../../lib/tgweb/get_template.mjs"
import * as PATH from "path"
import { fileURLToPath } from "url";

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("getTemplate", () => {
  it("should return a page template", () => {
    const path = PATH.resolve(__dirname, "../sites/site_1/src/pages/index.html")
    const template = getTemplate(path, "page")

    assert.equal(template.type, "page")
    assert.equal(template.frontMatter.title, "FizzBuzz")

    const element0 = template.dom.children[0]
    assert.equal(element0.name, "tg:segment")
    assert.deepEqual(element0.attribs, { name: "apps/fizz_buzz" })

    const text0 = template.dom.children[1]
    assert.equal(text0.type, "text")
    assert.equal(text0.data, "\n")
  })
})

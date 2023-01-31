import assert from "node:assert/strict"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import { fileURLToPath } from "url";
import * as PATH from "path"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("getSiteData", () => {
  it("should return the site data with dependencies", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    const layout = siteData.layouts[0]
    assert.equal(layout.dependencies.length, 2)

    const page = siteData.pages[0]
    assert.equal(page.dependencies.length, 3)
  })
})

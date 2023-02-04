import assert from "node:assert/strict"
import tgweb from "../lib/tgweb.mjs"

describe("getSiteData", () => {
  it("should be a function", () => {
    assert.equal(typeof tgweb.getSiteData, "function")
  })
})

describe("create", () => {
  it("should be a function", () => {
    assert.equal(typeof tgweb.create, "function")
  })
})

describe("update", () => {
  it("should be a function", () => {
    assert.equal(typeof tgweb.update, "function")
  })
})

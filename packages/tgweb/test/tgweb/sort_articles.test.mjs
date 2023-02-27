import assert from "node:assert/strict"
import { sortArticles } from "../../lib/tgweb/sort_articles.mjs"

describe("sortArticles", () => {
  it("should sort articles by filename in descending order", () => {
    const articles = [
      {path: "foo.html"},
      {path: "bar.html"},
      {path: "zoo.html"},
    ]

    sortArticles(articles, "filename:desc")

    assert.equal(articles[0].path, "zoo.html")
    assert.equal(articles[1].path, "foo.html")
    assert.equal(articles[2].path, "bar.html")
  })
})

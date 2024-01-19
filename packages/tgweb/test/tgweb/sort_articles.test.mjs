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
  }),
  it("should sort articles by index and filename in ascending order", () => {
    const articles = [
      {path: "a.html", frontMatter: {main: {index: 2}}},
      {path: "b.html", frontMatter: {main: {index: 1}}},
      {path: "c.html", frontMatter: {}},
      {path: "d.html", frontMatter: {}},
    ]

    sortArticles(articles, "index:asc")

    assert.equal(articles[0].path, "b.html")
    assert.equal(articles[1].path, "a.html")
    assert.equal(articles[2].path, "c.html")
    assert.equal(articles[3].path, "d.html")
  }),
  it("should sort articles by index in descending order, by filename in ascending order", () => {
    const articles = [
      {path: "a.html", frontMatter: {main: {index: 1}}},
      {path: "b.html", frontMatter: {main: {index: 2}}},
      {path: "c.html", frontMatter: {}},
      {path: "d.html", frontMatter: {}},
    ]

    sortArticles(articles, "index:desc")

    assert.equal(articles[0].path, "b.html")
    assert.equal(articles[1].path, "a.html")
    assert.equal(articles[2].path, "c.html")
    assert.equal(articles[3].path, "d.html")
  })
})

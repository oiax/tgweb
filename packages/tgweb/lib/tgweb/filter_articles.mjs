import { minimatch } from "minimatch"

const filterArticles = (articles, pattern, tag) => {
  const sorted =
    articles.filter(article => {
      if (minimatch(article.path, pattern)) {
        if (tag) {
          if (typeof article.frontMatter["tags"] === "string") {
            return article.frontMatter["tags"] === tag
          }
          else if (Array.isArray(article.frontMatter["tags"])) {
            return article.frontMatter["tags"].includes(tag)
          }
        }
        else {
          return true
        }
      }
    })

  return sorted
}

export { filterArticles }

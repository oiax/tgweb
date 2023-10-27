import { minimatch } from "minimatch"

const filterArticles = (articles, pattern, tag) => {
  const sorted =
    articles.filter(article => {
      const tags = article.frontMatter.main.tags
      if (minimatch(article.path, "articles/" + pattern)) {
        if (tag) {
          if (typeof tags === "string") {
            return tags === tag
          }
          else if (Array.isArray(tags)) {
            return tags.includes(tag)
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

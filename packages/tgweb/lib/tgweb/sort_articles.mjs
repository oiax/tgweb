import { getTitle } from "./get_title.mjs"

const sortArticles = (articles, orderBy) => {
  const re = /^(title|index|filename):(asc|desc)$/
  const md = re.exec(orderBy)

  if (md === null) return

  const criteria = md[1]
  const direction = md[2]

  if (criteria === undefined) return

  if (criteria === "title") {
    articles.sort((a, b) => {
      const titleA = getTitle(a.frontMatter, a.dom)
      const titleB = getTitle(b.frontMatter, b.dom)

      if (titleA > titleB) return 1
      if (titleA < titleB) return -1
      return 0
    })
  }
  else if (criteria === "index") {
    articles.sort((a, b) => {
      const i = a.frontMatter.main && a.frontMatter.main["index"]
      const j = b.frontMatter.main && b.frontMatter.main["index"]

      if (i !== undefined) {
        if (j !== undefined) {
          if (i > j) return 1
          if (i < j) return -1
          if (a.path > b.path) return 1
          if (a.path < b.path) return -1
          return 0
        }
        else {
          return (direction === "asc" ? -1 : 1)
        }
      }
      else {
        if (j !== undefined) return (direction === "asc" ? 1 : -1)
        else {
          if (a.path > b.path) return (direction === "asc" ? 1 : -1)
          if (a.path < b.path) return (direction === "asc" ? -1 : 1)
          return 0
        }
      }
    })
  }
  else if (criteria === "filename") {
    articles.sort((a, b) => {
      if (a.path > b.path) return 1
      if (a.path < b.path) return -1
      return 0
    })
  }

  if (direction === "desc") articles.reverse()
}

export { sortArticles }

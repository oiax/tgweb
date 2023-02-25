import { getTitle } from "./get_title.mjs"

const sortArticles = (articles, orderBy) => {
  const re = /^(title|index):(asc|desc)$/
  const md = re.exec(orderBy)
  const criteria = md[1]
  const direction = md[2]

  if (criteria === undefined) return

  if (criteria === "title") {
    articles.sort((a, b) => {
      const titleA = getTitle(a, a.dom.window.document.body)
      const titleB = getTitle(b, b.dom.window.document.body)

      if (titleA > titleB) return 1
      if (titleA < titleB) return -1
      return 0
    })
  }
  else if (criteria === "index") {
    articles.sort((a, b) => {
      const i = a.frontMatter["index"]
      const j = b.frontMatter["index"]

      if (i) {
        if (j) {
          if (i > j) return 1
          if (i < j) return -1
          if (a.path > b.path) return 1
          if (a.path < b.path) return -1
          return 0
        }
        else {
          return 1
        }
      }
      else {
        if (j) return -1
        else return 1
      }
    })
  }

  if (direction === "desc") articles.reverse()
}

export { sortArticles }

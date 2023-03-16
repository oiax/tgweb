import { setAttrs } from "./set_attrs.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import getTag from "./get_tag.mjs"
import filterArticles from "./filter_articles.mjs"
import { sortArticles } from "./sort_articles.mjs"

const embedLinksToArticles = (container, siteData, path) => {
  const targets = container.querySelectorAll("tg-links")

  targets.forEach(target => {
    setAttrs(target)
    const pattern = target.attrs["pattern"]
    const tag = getTag(target)

    const articles = filterArticles(siteData.articles, pattern, tag)

    if (target.attrs["order-by"]) sortArticles(articles, target.attrs["order-by"])

    articles.forEach(article => {
      const href = `/articles/${article.path}`.replace(/\/index.html$/, "/")

      const articleRoot = article.dom.window.document.body.cloneNode(true)

      const copy = target.cloneNode(true)

      fillInPlaceHolders(copy, articleRoot, article.frontMatter)

      Array.from(copy.querySelectorAll("tg-link")).forEach(link => {
        if (`src/articles/${article.path}` === path) {
          const fallback = link.querySelector("tg-if-current")
          if (fallback)  {
            Array.from(fallback.childNodes).forEach(child => link.before(child))
          }
        }
        else {
          const fallback = link.querySelector("tg-if-current")
          if (fallback) fallback.remove()
          Array.from(link.querySelectorAll("a[href='#']")).forEach(a => a.href = href)
          Array.from(link.childNodes).forEach(child => link.before(child))
        }
      })

      Array.from(copy.querySelectorAll("tg-link")).forEach(link => link.remove())

      copy.querySelectorAll("a[href='#']").forEach(anchor => anchor.href = href)

      Array.from(copy.childNodes).forEach(child => target.before(child))
    })
  })

  Array.from(container.querySelectorAll("tg-links")).forEach(target => target.remove())
}

export { embedLinksToArticles }

import getTag from "./get_tag.mjs"
import filterArticles from "./filter_articles.mjs"
import { setAttrs } from "./set_attrs.mjs"
import { embedComponents } from "./embed_components.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { applyWrapper } from "./apply_wrapper.mjs"
import { sortArticles } from "./sort_articles.mjs"

const embedArticleLists = (node, siteData, path) => {
  const targets = node.querySelectorAll("tg-articles")

  targets.forEach(target => {
    setAttrs(target)
    const pattern = target.attrs["pattern"]
    const tag = getTag(target)
    const articles = filterArticles(siteData.articles, pattern, tag)

    if (target.attrs["order-by"]) sortArticles(articles, target.attrs["order-by"])

    articles.forEach(article => {
      const articleRoot = article.dom.window.document.body.cloneNode(true)

      const wrapper = getWrapper(siteData, "articles/" + article.path)

      embedComponents(article, articleRoot, siteData, path)
      embedLinksToArticles(article, articleRoot, siteData, path)

      if (wrapper) {
        const wrapperRoot = applyWrapper(article, articleRoot, wrapper)
        Array.from(wrapperRoot.childNodes).forEach(child => target.before(child))
      }
      else {
        Array.from(articleRoot.childNodes).forEach(child => target.before(child))
      }
    })
  })

  Array.from(node.querySelectorAll("tg-articles")).forEach(target => target.remove())
}

export { embedArticleLists }

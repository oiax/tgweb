import getTag from "./get_tag.mjs"
import filterArticles from "./filter_articles.mjs"
import { setAttrs } from "./set_attrs.mjs"
import { embedComponents } from "./embed_components.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { embedContent } from "./embed_content.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { sortArticles } from "./sort_articles.mjs"

const embedArticleLists = (templateRoot, documentProperties, siteData, path) => {
  const targets = templateRoot.querySelectorAll("tg-articles")

  targets.forEach(target => {
    setAttrs(target)
    const pattern = target.attrs["pattern"]
    const tag = getTag(target)
    const articles = filterArticles(siteData.articles, pattern, tag)

    if (target.attrs["order-by"]) sortArticles(articles, target.attrs["order-by"])

    articles.forEach(article => {
      const articleRoot = article.dom.window.document.body.cloneNode(true)
      embedComponents(articleRoot, documentProperties, siteData, path)
      embedLinksToArticles(articleRoot, siteData, path)

      const wrapper = getWrapper(siteData, "articles/" + article.path)

      if (wrapper) {
        const wrapperRoot = wrapper.dom.window.document.body.cloneNode(true)

        expandClassAliases(wrapperRoot, wrapper.frontMatter)
        embedComponents(wrapperRoot, documentProperties, siteData, path)
        embedContent(wrapperRoot, articleRoot)
        fillInPlaceHolders(wrapperRoot, articleRoot, documentProperties)

        Array.from(wrapperRoot.childNodes).forEach(child => target.before(child))
      }
      else {
        Array.from(articleRoot.childNodes).forEach(child => target.before(child))
      }
    })
  })

  targets.forEach(target => target.remove())
}

export { embedArticleLists }

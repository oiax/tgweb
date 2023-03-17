import { setAttrs } from "./set_attrs.mjs"
import { embedComponents } from "./embed_components.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { embedContent } from "./embed_content.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { err } from "./err.mjs"

const embedArticles = (container, documentProperties, siteData, path) => {
  const targets = container.querySelectorAll("tg-article")

  targets.forEach(target => {
    setAttrs(target)

    const article =
      siteData.articles.find(article => article.path == target.attrs["name"] + ".html")

    if (article) {
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
        Array.from(articleRoot.children).forEach(child => target.before(child))
      }
    }
    else {
      err(target, siteData, `No article named ${target.attrs["name"]} exists.`)
    }
  })

  targets.forEach(target => target.remove())
}

export { embedArticles }

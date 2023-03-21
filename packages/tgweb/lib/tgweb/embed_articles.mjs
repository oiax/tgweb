import { setAttrs } from "./set_attrs.mjs"
import { embedComponents } from "./embed_components.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { expandCustomProperties } from "./expand_custom_properties.mjs"
import { embedContent } from "./embed_content.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { mergeProperties } from "./merge_properties.mjs"
import { getDocumentProperties } from "./get_document_properties.mjs"
import { err } from "./err.mjs"

const embedArticles = (container, siteData, path) => {
  const targets = container.querySelectorAll("tg-article")

  targets.forEach(target => {
    setAttrs(target)

    const article =
      siteData.articles.find(article => article.path == target.attrs["name"] + ".html")

    if (article) {
      const articleRoot = article.dom.window.document.body.cloneNode(true)
      const properties = mergeProperties(article.frontMatter, siteData.properties)

      embedLinksToArticles(articleRoot, article.frontMatter, siteData, path)
      expandClassAliases(articleRoot, properties)
      expandCustomProperties(articleRoot, properties)
      embedComponents(articleRoot, properties, siteData, path)

      const wrapper = getWrapper(siteData, "articles/" + article.path)

      if (wrapper) {
        const wrapperRoot = wrapper.dom.window.document.body.cloneNode(true)
        const properties = getDocumentProperties(article, wrapper, null, siteData.properties)

        expandClassAliases(wrapperRoot, wrapper.frontMatter)
        expandCustomProperties(wrapperRoot, properties)
        embedComponents(wrapperRoot, properties, siteData, path)
        embedContent(wrapperRoot, articleRoot)
        fillInPlaceHolders(wrapperRoot, articleRoot, properties)

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

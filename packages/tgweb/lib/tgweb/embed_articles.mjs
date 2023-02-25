import { setAttrs } from "./set_attrs.mjs"
import { embedComponents } from "./embed_components.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { applyWrapper } from "./apply_wrapper.mjs"
import { err } from "./err.mjs"

const embedArticles = (node, siteData, path) => {
  const targets = node.querySelectorAll("tg-article")

  targets.forEach(target => {
    setAttrs(target)

    const article =
      siteData.articles.find(article => article.path == target.attrs["name"] + ".html")

    if (article) {
      const articleRoot = article.dom.window.document.body.cloneNode(true)

      embedComponents(article, articleRoot, siteData, path)
      embedLinksToArticles(articleRoot, siteData, path)

      const wrapper = getWrapper(siteData, "articles/" + article.path)

      if (wrapper) {
        const wrapperRoot = applyWrapper(article, articleRoot, wrapper, siteData, path)
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

  Array.from(node.querySelectorAll("tg-article")).forEach(target => target.remove())
}

export { embedArticles }

import { getWrapper } from "./get_wrapper.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { getTitle } from "./get_title.mjs"
import { renderHTML } from "./render_html.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { embedComponents } from "./embed_components.mjs"
import { applyWrapper } from "./apply_wrapper.mjs"
import { applyLayout } from "./apply_layout.mjs"

const renderArticle = (path, siteData) => {
  const article = siteData.articles.find(article => "src/articles/" + article.path == path)

  if (article) {
    if (article.frontMatter["embedded-only"] === true) return

    const articleRoot = article.dom.window.document.body.cloneNode(true)
    expandClassAliases(article.frontMatter, articleRoot)
    embedComponents(article, articleRoot, siteData, path)
    return _renderArticle(article, articleRoot, siteData, path)
  }
}

const _renderArticle = (article, articleRoot, siteData, path) => {
  embedComponents(article, articleRoot, siteData, path)
  embedLinksToArticles(articleRoot, siteData, path)

  const wrapper = getWrapper(siteData, "articles/" + article.path)

  if (wrapper) {
    const wrapperRoot = applyWrapper(article, articleRoot, wrapper, siteData, path)
    const headAttrs = { title: getTitle(article, wrapperRoot) }
    const layoutRoot = applyLayout(wrapper, wrapperRoot, siteData, path)
    return renderHTML(article, layoutRoot, siteData, headAttrs, path)
  }
  else {
    const headAttrs = { title: getTitle(article, articleRoot) }
    const layoutRoot = applyLayout(article, articleRoot, siteData, path)
    return renderHTML(article, layoutRoot, siteData, headAttrs, path)
  }
}

export { renderArticle }

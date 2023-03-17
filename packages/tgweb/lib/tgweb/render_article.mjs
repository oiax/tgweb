import { getWrapper } from "./get_wrapper.mjs"
import { getLayout } from "./get_layout.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { expandCustomProperties } from "./expand_custom_properties.mjs"
import { getTitle } from "./get_title.mjs"
import { renderHTML } from "./render_html.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { embedComponents } from "./embed_components.mjs"
import { embedSegments } from "./embed_segments.mjs"
import { embedContent } from "./embed_content.mjs"
import { getDocumentProperties } from "./get_document_properties.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"

const renderArticle = (path, siteData) => {
  const article = siteData.articles.find(article => "src/articles/" + article.path == path)

  if (article === undefined) return
  if (article.frontMatter["embedded-only"] === true) return

  const wrapper = getWrapper(siteData, "articles/" + article.path)
  const layout = getLayout(siteData, article, wrapper)
  const documentProperties = getDocumentProperties(article, wrapper, layout, siteData.properties)
  const articleRoot = makeArticleRoot(article, documentProperties, siteData, path)
  const headAttrs = { title: getTitle(article.frontMatter, articleRoot) }

  if (wrapper && layout) {
    const wrapperRoot = applyWrapper(wrapper, articleRoot, documentProperties, siteData, path)

    const layoutRoot =
      applyLayout(layout, wrapperRoot, articleRoot, documentProperties, siteData, path)

    return renderHTML(layoutRoot, siteData, documentProperties, headAttrs, path)
  }
  else if (wrapper) {
    const wrapperRoot = applyWrapper(wrapper, articleRoot, documentProperties, siteData, path)
    return renderHTML(wrapperRoot, siteData, documentProperties, headAttrs, path)
  }
  else if (layout) {
    const layoutRoot =
      applyLayout(layout, articleRoot, articleRoot, documentProperties, siteData, path)

    return renderHTML(layoutRoot, siteData, documentProperties, headAttrs, path)
  }
  else {
    fillInPlaceHolders(articleRoot, undefined, documentProperties)
    return renderHTML(articleRoot, siteData, documentProperties, headAttrs, path)
  }
}

const makeArticleRoot = (article, documentProperties, siteData, path) => {
  const articleRoot = article.dom.window.document.body.cloneNode(true)
  embedLinksToArticles(articleRoot, article.frontMatter, siteData, path)
  expandClassAliases(articleRoot, article.frontMatter)
  expandCustomProperties(articleRoot, documentProperties)
  embedComponents(articleRoot, documentProperties, siteData, path)
  return articleRoot
}

const applyWrapper = (wrapper, articleRoot, documentProperties, siteData, path) => {
  const wrapperRoot = wrapper.dom.window.document.body.cloneNode(true)
  expandClassAliases(wrapperRoot, wrapper.frontMatter)
  expandCustomProperties(wrapperRoot, documentProperties)
  embedComponents(wrapperRoot, documentProperties, siteData, path)
  embedContent(wrapperRoot, articleRoot)
  fillInPlaceHolders(wrapperRoot, articleRoot, documentProperties)
  return wrapperRoot
}

const applyLayout = (layout, innerContent, provider, documentProperties, siteData, path) => {
  const layoutRoot = layout.dom.window.document.body.cloneNode(true)
  embedLinksToArticles(layoutRoot, layout.frontMatter, siteData, path)
  expandClassAliases(layoutRoot, layout.frontMatter)
  expandCustomProperties(layoutRoot, documentProperties)
  embedSegments(layoutRoot, documentProperties, siteData, path)
  embedComponents(layoutRoot, documentProperties, siteData, path)
  embedContent(layoutRoot, innerContent)
  fillInPlaceHolders(layoutRoot, provider, documentProperties)
  return layoutRoot
}

export { renderArticle }

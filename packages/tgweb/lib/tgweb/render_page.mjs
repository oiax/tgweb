import { getWrapper } from "./get_wrapper.mjs"
import { getLayout } from "./get_layout.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { getTitle } from "./get_title.mjs"
import { renderHTML } from "./render_html.mjs"
import { embedArticles } from "./embed_articles.mjs"
import { embedArticleLists } from "./embed_article_lists.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { embedComponents } from "./embed_components.mjs"
import { embedSegments } from "./embed_segments.mjs"
import { embedContent } from "./embed_content.mjs"
import { getDocumentProperties } from "./get_document_properties.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"

const renderPage = (path, siteData) => {
  const relPath = path.replace(/^src\/pages\//, "")
  const page = siteData.pages.find(page => page.path == relPath)

  if (page === undefined) return

  const wrapper = getWrapper(siteData, "pages/" + page.path)
  const layout = getLayout(siteData, page, wrapper)
  const documentProperties = getDocumentProperties(page, wrapper, layout, siteData.properties)
  const pageRoot = makePageRoot(page, documentProperties, siteData, path)
  const headAttrs = { title: getTitle(page.frontMatter, pageRoot) }

  if (wrapper && layout) {
    const wrapperRoot = applyWrapper(wrapper, pageRoot, documentProperties, siteData, path)

    const layoutRoot =
      applyLayout(layout, wrapperRoot, pageRoot, documentProperties, siteData, path)

    return renderHTML(layoutRoot, siteData, documentProperties, headAttrs, path)
  }
  else if (wrapper) {
    const wrapperRoot = applyWrapper(wrapper, pageRoot, documentProperties, siteData, path)
    return renderHTML(wrapperRoot, siteData, documentProperties, headAttrs, path)
  }
  else if (layout) {
    const layoutRoot = applyLayout(layout, pageRoot, pageRoot, documentProperties, siteData, path)
    return renderHTML(layoutRoot, siteData, documentProperties, headAttrs, path)
  }
  else {
    fillInPlaceHolders(pageRoot, undefined, documentProperties)
    return renderHTML(pageRoot, siteData, documentProperties, headAttrs, path)
  }
}

const makePageRoot = (page, documentProperties, siteData, path) => {
  const pageRoot = page.dom.window.document.body.cloneNode(true)
  expandClassAliases(pageRoot, page.frontMatter)
  embedSegments(pageRoot, documentProperties, siteData, path)
  embedComponents(pageRoot, documentProperties, siteData, path)
  embedArticles(pageRoot, documentProperties, siteData, path)
  embedArticleLists(pageRoot, documentProperties, siteData, path)
  embedLinksToArticles(pageRoot, siteData, path)
  return pageRoot
}

const applyWrapper = (wrapper, pageRoot, documentProperties, siteData, path) => {
  const wrapperRoot = wrapper.dom.window.document.body.cloneNode(true)
  expandClassAliases(wrapperRoot, wrapper.frontMatter)
  embedComponents(wrapperRoot, documentProperties, siteData, path)
  embedContent(wrapperRoot, pageRoot)
  fillInPlaceHolders(wrapperRoot, pageRoot, documentProperties)
  return wrapperRoot
}

const applyLayout = (layout, innerContent, provider, documentProperties, siteData, path) => {
  const layoutRoot = layout.dom.window.document.body.cloneNode(true)
  expandClassAliases(layoutRoot, layout.frontMatter)
  embedSegments(layoutRoot, documentProperties, siteData, path)
  embedComponents(layoutRoot, documentProperties, siteData, path)
  embedArticles(layoutRoot, documentProperties, siteData, path)
  embedArticleLists(layoutRoot, documentProperties, siteData, path)
  embedLinksToArticles(layoutRoot, siteData, path)
  embedContent(layoutRoot, innerContent)
  fillInPlaceHolders(layoutRoot, provider, documentProperties)
  return layoutRoot
}

export { renderPage }

import pretty from "pretty"
import { setAttrs } from "./set_attrs.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { getTitle } from "./get_title.mjs"
import { renderHTML } from "./render_html.mjs"
import { embedArticles } from "./embed_articles.mjs"
import { embedArticleLists } from "./embed_article_lists.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { embedComponents } from "./embed_components.mjs"
import { applyWrapper } from "./apply_wrapper.mjs"
import { applyLayout } from "./apply_layout.mjs"

const renderPage = (path, siteData) => {
  const relPath = path.replace(/^src\/pages\//, "")
  const page = siteData.pages.find(page => page.path == relPath)

  if (page) {
    const pageRoot = page.dom.window.document.body.cloneNode(true)
    setAttrs(pageRoot)
    expandClassAliases(page.frontMatter, pageRoot)

    embedComponents(page, pageRoot, siteData, path)
    embedArticles(pageRoot, siteData, path)
    embedArticleLists(pageRoot, siteData, path)
    embedLinksToArticles(pageRoot, siteData, path)

    const wrapper = getWrapper(siteData, "pages/" + page.path)

    if (wrapper) {
      const wrapperRoot = applyWrapper(page, pageRoot, wrapper, siteData, path)
      const headAttrs = { title: getTitle(page, wrapperRoot) }
      const layoutRoot = applyLayout(wrapper, wrapperRoot, siteData, path)
      if (layoutRoot) return renderHTML(page, layoutRoot, siteData, headAttrs, path)
      else console.log("Error")
    }
    else if (page.frontMatter["layout"]) {
      const headAttrs = { title: getTitle(page, pageRoot) }
      const layoutRoot = applyLayout(page, pageRoot, siteData, path)
      if (layoutRoot) return renderHTML(page, layoutRoot, siteData, headAttrs, path)
      else return renderHTML(page, pageRoot, siteData, headAttrs, path)
    }
    else {
      const headAttrs = { title: getTitle(page, pageRoot) }
      return renderHTML(page, pageRoot, siteData, headAttrs, path)
    }
  }

  return pretty(siteData.documentTemplate.serialize())
}

export { renderPage }

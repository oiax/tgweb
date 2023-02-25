import pretty from "pretty"
import { getWrapper } from "./get_wrapper.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { getTitle } from "./get_title.mjs"
import { renderHTML } from "./render_html.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { embedComponents } from "./embed_components.mjs"
import { applyWrapper } from "./apply_wrapper.mjs"
import { applyLayout } from "./apply_layout.mjs"

const generationFuncs = {}

const dbg = arg => console.log(arg)

const pp = element => {
  console.log("<<<<")
  console.log(pretty(element.outerHTML, {ocd: true}))
  console.log(">>>>")
}

// Prevent warnings when functions dbg and pp are not used.
if (dbg === undefined) { dbg() }
if (pp === undefined) { pp() }

generationFuncs["article"] = (path, siteData) => {
  const article = siteData.articles.find(article => "src/articles/" + article.path == path)

  if (article) {
    const articleRoot = article.dom.window.document.body.cloneNode(true)
    expandClassAliases(article.frontMatter, articleRoot)
    embedComponents(article, articleRoot, siteData, path)
    return renderArticle(article, articleRoot, siteData, path)
  }

  return pretty(siteData.documentTemplate.serialize())
}

const renderArticle = (article, articleRoot, siteData, path) => {
  embedComponents(article, articleRoot, siteData, path)
  embedLinksToArticles(article, articleRoot, siteData, path)

  const wrapper = getWrapper(siteData, "articles/" + article.path)

  if (wrapper) {
    const wrapperRoot = applyWrapper(article, articleRoot, wrapper)
    const headAttrs = { title: getTitle(article, wrapperRoot) }
    const layoutRoot = applyLayout(wrapper, wrapperRoot, siteData, path)
    if (layoutRoot) return renderHTML(article, layoutRoot, siteData, headAttrs, path)
    else console.log("Error")
  }
  else {
    const headAttrs = { title: getTitle(article, articleRoot) }
    const layoutRoot = applyLayout(article, articleRoot, siteData, path)
    if (layoutRoot) return renderHTML(article, layoutRoot, siteData, headAttrs, path)
    else console.log("Error")
  }
}

export default generationFuncs

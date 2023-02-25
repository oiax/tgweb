import pretty from "pretty"
import getTag from "./get_tag.mjs"
import filterArticles from "./filter_articles.mjs"
import { setAttrs } from "./set_attrs.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { makeLocalFrontMatter } from "./make_local_front_matter.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { getTitle } from "./get_title.mjs"
import { sortArticles } from "./sort_articles.mjs"
import { renderHTML } from "./render_html.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { embedArticles } from "./embed_articles.mjs"
import { embedContent } from "./embed_content.mjs"
import { embedComponents } from "./embed_components.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { applyWrapper } from "./apply_wrapper.mjs"

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

generationFuncs["page"] = (path, siteData) => {
  const relPath = path.replace(/^src\/pages\//, "")
  const page = siteData.pages.find(page => page.path == relPath)

  if (page) {
    const pageRoot = page.dom.window.document.body.cloneNode(true)
    setAttrs(pageRoot)
    expandClassAliases(page.frontMatter, pageRoot)

    embedComponents(page, pageRoot, siteData, path)
    embedArticles(pageRoot, siteData, path)
    embedArticleLists(pageRoot, siteData, path)
    embedLinksToArticles(page, pageRoot, siteData, path)

    const wrapper = getWrapper(siteData, "pages/" + page.path)

    if (wrapper) {
      const wrapperRoot = applyWrapper(page, pageRoot, wrapper)
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

const applyLayout = (template, element, siteData, path) => {
  if (template.frontMatter["layout"] === undefined) return

  const layout =
    siteData.layouts.find(layout => layout.path == template.frontMatter["layout"] + ".html")

  if (layout === undefined) return

  const layoutRoot = layout.dom.window.document.body.cloneNode(true)

  const frontMatter = makeLocalFrontMatter(template, layout)
  expandClassAliases(frontMatter, layoutRoot)
  embedContent(layoutRoot, element)
  fillInPlaceHolders(layoutRoot, element, template)
  embedComponents(template, layoutRoot, siteData, path)

  return layoutRoot
}

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

export default generationFuncs

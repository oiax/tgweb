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
import { embedContent } from "./embed_content.mjs"

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

const err = (node, siteData, message) => {
  console.log(`Error: ${message}`)
  const errorDiv = siteData.documentTemplate.window.document.createElement("div")
  errorDiv.textContent = message
  errorDiv.style = "border: solid black 0.5rem; background-color: #800; color: #fee; padding: 1rem"
  node.before(errorDiv)
}

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

const applyWrapper = (template, root, wrapper) => {
  const frontMatter = makeLocalFrontMatter(template, wrapper)
  const wrapperRoot = wrapper.dom.window.document.body.cloneNode(true)
  expandClassAliases(frontMatter, wrapperRoot)
  embedContent(wrapperRoot, root)
  fillInPlaceHolders(wrapperRoot, root, template)
  return wrapperRoot
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

const embedComponents = (template, node, siteData, path) => {
  const targets = node.querySelectorAll("tg-component")

  targets.forEach(target => {
    setAttrs(target)

    const componentName = target.attrs["name"]

    const component =
      siteData.components.find(component => component.path == componentName + ".html")

    if (component) {
      const componentRoot = component.dom.window.document.body.children[0].cloneNode(true)
      expandClassAliases(component.frontMatter, componentRoot)
      embedContent(componentRoot, target)
      embedLinksToArticles(template, componentRoot, siteData, path)
      fillInPlaceHolders(componentRoot, target, template)
      target.replaceWith(componentRoot)
    }
  })
}

const embedArticles = (node, siteData, path) => {
  const targets = node.querySelectorAll("tg-article")

  targets.forEach(target => {
    setAttrs(target)

    const article =
      siteData.articles.find(article => article.path == target.attrs["name"] + ".html")

    if (article) {
      const articleRoot = article.dom.window.document.body.cloneNode(true)

      embedComponents(article, articleRoot, siteData, path)
      embedLinksToArticles(article, articleRoot, siteData, path)

      const wrapper = getWrapper(siteData, "articles/" + article.path)

      if (wrapper) {
        const wrapperRoot = applyWrapper(article, articleRoot, wrapper)
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

const embedLinksToArticles = (template, node, siteData, path) => {
  const targets = node.querySelectorAll("tg-links")

  targets.forEach(target => {
    setAttrs(target)
    const pattern = target.attrs["pattern"]
    const tag = getTag(target)

    const articles = filterArticles(siteData.articles, pattern, tag)

    if (target.attrs["order-by"]) sortArticles(articles, target.attrs["order-by"])

    articles.forEach(article => {
      const href = `/articles/${article.path}`.replace(/\/index.html$/, "/")

      const articleRoot = article.dom.window.document.body.cloneNode(true)

      const copy = target.cloneNode(true)

      fillInPlaceHolders(copy, articleRoot, article)

      Array.from(copy.querySelectorAll("tg-link")).forEach(link => {
        if (`src/articles/${article.path}` === path) {
          const fallback = link.querySelector("tg-if-current")
          if (fallback)  {
            Array.from(fallback.childNodes).forEach(child => link.before(child))
          }
        }
        else {
          const fallback = link.querySelector("tg-if-current")
          if (fallback) fallback.remove()
          Array.from(link.querySelectorAll("a[href='#']")).forEach(a => a.href = href)
          Array.from(link.childNodes).forEach(child => link.before(child))
        }
      })

      Array.from(copy.querySelectorAll("tg-link")).forEach(link => link.remove())

      copy.querySelectorAll("a[href='#']").forEach(anchor => anchor.href = href)

      Array.from(copy.childNodes).forEach(child => target.before(child))
    })
  })

  Array.from(node.querySelectorAll("tg-links")).forEach(target => target.remove())
}

export default generationFuncs

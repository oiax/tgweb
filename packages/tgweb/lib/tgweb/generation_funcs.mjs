import * as PATH from "path"
import pretty from "pretty"
import { JSDOM } from "jsdom"
import { minimatch } from "minimatch"
import { setTgAttrs } from "./set_tg_attrs.mjs"
import { removeTgAttributes } from "./remove_tg_attributes.mjs"

const generationFuncs = {}

generationFuncs["page"] = (path, siteData) => {
  const filename = PATH.basename(path)
  const page = siteData.pages.find(page => page.path == filename)

  if (page) {
    const pageRoot = page.dom.window.document.body.children[0].cloneNode(true)
    setTgAttrs(pageRoot)
    const headAttrs = { title: getTitle(pageRoot) }

    embedComponents(pageRoot, siteData)
    embedArticles(pageRoot, siteData)
    embedArticleLists(pageRoot, siteData)
    embedLinksToArticles(pageRoot, siteData, path)

    const layoutRoot = applyLayout(pageRoot, siteData)
    if (layoutRoot) return renderHTML(layoutRoot, siteData, headAttrs)
    else return renderHTML(pageRoot, siteData, headAttrs)
  }

  return pretty(siteData.documentTemplate.serialize())
}

generationFuncs["article"] = (path, siteData) => {
  const article = siteData.articles.find(article => "src/articles/" + article.path == path)

  if (article) {
    const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
    setTgAttrs(articleRoot)

    if (articleRoot.tgAttrs["component"]) {
      const componentRoot = getComponentRoot(articleRoot, siteData)
      setTgAttrs(componentRoot)
      return renderArticle(componentRoot, siteData, path)
    }
    else {
      embedComponents(articleRoot, siteData)
      return renderArticle(articleRoot, siteData, path)
    }
  }

  return pretty(siteData.documentTemplate.serialize())
}

const renderArticle = (articleRoot, siteData, path) => {
  const headAttrs = { title: getTitle(articleRoot) }
  embedLinksToArticles(articleRoot, siteData, path)
  const layoutRoot = applyLayout(articleRoot, siteData)
  if (layoutRoot) return renderHTML(layoutRoot, siteData, headAttrs)
}

const applyLayout = (element, siteData) => {
  if (element.tgAttrs["layout"] === undefined) return

  const layout =
    siteData.layouts.find(layout => layout.path == element.tgAttrs["layout"] + ".html")

  if (layout === undefined) return

  const layoutRoot = layout.dom.window.document.body.cloneNode(true)
  embedComponents(layoutRoot, siteData)

  const target = layoutRoot.querySelector("[tg-content]")

  if (target) target.replaceWith(element)

  return layoutRoot
}

const embedComponents = (node, siteData) => {
  const targets = node.querySelectorAll("[tg-component]")

  targets.forEach(target => {
    setTgAttrs(target)
    const componentRoot = getComponentRoot(target, siteData)
    if (componentRoot) target.replaceWith(componentRoot)
  })
}

const getComponentRoot = (element, siteData) => {
  const componentName = element.tgAttrs["component"]

  const component =
    siteData.components.find(component => component.path == componentName + ".html")

  if (component) {
    const componentRoot = component.dom.window.document.body.children[0].cloneNode(true)
    const args = getArgs(element)
    embedArgs(componentRoot, args)
    return componentRoot
  }
}

const getArgs = element => {
  const args = {}
  const names = ["title", "description", "index", "date"]

  names.forEach(name => {
    if (element.tgAttrs[name]) args[name] = element.tgAttrs[name]
  })

  for (const key in element.tgAttrs.data) args[key] = element.tgAttrs.data[key]

  return args
}

const embedArticles = (node, siteData) => {
  const targets = node.querySelectorAll("[tg-article]")

  targets.forEach(target => {
    setTgAttrs(target)

    const article =
      siteData.articles.find(article => article.path == target.tgAttrs["article"] + ".html")

    if (article) {
      const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
      setTgAttrs(articleRoot)
      target.replaceWith(articleRoot)
    }
  })
}

const embedArticleLists = (node, siteData) => {
  const targets = node.querySelectorAll("[tg-articles]")

  targets.forEach(target => {
    setTgAttrs(target)
    const pattern = target.tgAttrs["articles"]
    const tag = getTag(target)
    const articles = filterArticles(siteData.articles, pattern, tag)

    if (target.tgAttrs["order-by"]) sortArticles(articles, target.tgAttrs["order-by"])

    articles.forEach(article => {
      const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
      setTgAttrs(articleRoot)
      target.before(articleRoot)
    })

    target.remove()
  })
}

const embedLinksToArticles = (node, siteData, path) => {
  const targets = node.querySelectorAll("[tg-links]")

  targets.forEach(target => {
    setTgAttrs(target)
    const pattern = target.tgAttrs["links"]
    const tag = getTag(target)

    const articles = filterArticles(siteData.articles, pattern, tag)

    if (target.tgAttrs["order-by"]) sortArticles(articles, target.tgAttrs["order-by"])

    articles.forEach(article => {
      const articleRoot = article.dom.window.document.body.children[0]
      setTgAttrs(articleRoot)
      const copy = target.cloneNode(true)

      const href = PATH.relative(PATH.dirname(path), PATH.join("src/articles", article.path))
      copy.querySelectorAll("a[href='#']").forEach(anchor => anchor.href = href)

      const args = {
        "title": getTitle(articleRoot),
        "date": articleRoot.tgAttrs["date"]
      }

      embedArgs(copy, args)

      target.before(copy)
    })

    target.remove()
  })
}

const filterArticles = (articles, pattern, tag) => {
  articles =
    articles.filter(article => {
      if (minimatch(article.path, pattern)) {
        if (tag) {
          const articleRoot = article.dom.window.document.body.children[0]
          setTgAttrs(articleRoot)

          if (articleRoot.tgAttrs["tags"]) {
            return articleRoot.tgAttrs["tags"].split(",").includes(tag)
          }
        }
        else {
          return true
        }
      }
    })

  return articles
}

const sortArticles = (articles, orderBy) => {
  const re = /^(index):(asc|desc)$/
  const md = re.exec(orderBy)

  if (md) {
    articles.sort((a, b) => {
      const c = a.dom.window.document.body.children[0]
      const d = b.dom.window.document.body.children[0]

      if (c && d) {
        setTgAttrs(c)
        setTgAttrs(d)
        const i = c.tgAttrs["index"]
        const j = d.tgAttrs["index"]

        if (i) {
          if (j) {
            if (i > j) return -1
            if (i < j) return 1
            if (a.path > b.path) return -1
            if (a.path < b.path) return 1
            return 0
          }
          else {
            return 1
          }
        }
        else {
          if (j) return -1
          else return 1
        }
      }
      else if (c) {
        return 1
      }
      else return -1
    })

    if (md[2] == "desc") articles.reverse()
  }
}

const embedArgs = (node, args) => {
  const targets = node.querySelectorAll("[tg-text]")

  targets.forEach(target => {
    setTgAttrs(target)
    const text = target.tgAttrs["text"]

    if (text.substring(0, 2) == "%{" && text.substring(text.length - 1) == "}") {
      const paramName = text.substring(2, text.length - 1)

      if (paramName in args) {
        target.innerHTML = args[paramName]
      }
    }
  })
}

const renderHTML = (root, siteData, headAttrs) => {
  const dom = new JSDOM(siteData.documentTemplate.serialize())
  removeTgAttributes(root)
  dom.window.document.body.replaceWith(root)

  if (headAttrs["title"])
    dom.window.document.head.querySelector("title").textContent = headAttrs["title"]

  return pretty(dom.serialize())
}

const getTitle = element => {
  if (element.tgAttrs["title"]) return element.tgAttrs["title"]

  const h1 = element.querySelector("h1")
  if (h1) return h1.textContent

  const h2 = element.querySelector("h2")
  if (h2) return h2.textContent

  const h3 = element.querySelector("h3")
  if (h3) return h3.textContent

  const h4 = element.querySelector("h4")
  if (h4) return h4.textContent

  const h5 = element.querySelector("h5")
  if (h5) return h5.textContent

  const h6 = element.querySelector("h6")
  if (h6) return h6.textContent
}

const getTag = element => {
  element.tgAttrs["filter"]

  if (element.tgAttrs["filter"]) {
    const re = /^(tag):(.+)$/
    const md = re.exec(element.tgAttrs["filter"])
    if (md) return md[2]
  }
}

export default generationFuncs

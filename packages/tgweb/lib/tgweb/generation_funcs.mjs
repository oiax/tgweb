import * as PATH from "path"
import pretty from "pretty"
import { JSDOM } from "jsdom"
import { minimatch } from "minimatch"
import { getTgAttributes } from "./get_tg_attributes.mjs"

const generationFuncs = {}

generationFuncs["page"] = function(path, siteData) {
  const filename = PATH.basename(path)
  const page = siteData.pages.find(page => page.path == filename)

  if (page) {
    const pageRoot = page.dom.window.document.body.children[0].cloneNode(true)
    const tgLayoutAttr = pageRoot.attributes.getNamedItem("tg-layout")
    const headAttrs = { title: getTitle(pageRoot) }

    removeSpecialAttributes(pageRoot)
    embedComponents(pageRoot, siteData)
    embedArticles(pageRoot, siteData)
    embedArticleLists(pageRoot, siteData)
    embedLinksToArticles(pageRoot, siteData, path)

    if (tgLayoutAttr) {
      const layoutName = tgLayoutAttr.value

      const layout = siteData.layouts.find(layout => layout.path == layoutName + ".html")

      if (layout) {
        const layoutRoot = layout.dom.window.document.body.cloneNode(true)
        embedComponents(layoutRoot, siteData)

        const target = layoutRoot.querySelector("[tg-content]")

        if (target) target.replaceWith(pageRoot)

        return renderHTML(layoutRoot, siteData, headAttrs)
      }
    }
    else {
      return renderHTML(pageRoot, siteData, headAttrs)
    }
  }

  return pretty(siteData.documentTemplate.serialize())
}

generationFuncs["article"] = function(path, siteData) {
  const article = siteData.articles.find(article => "src/articles/" + article.path == path)

  if (article) {
    const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
    const tgAttrs = getTgAttributes(articleRoot)

    const tgComponentAttr = articleRoot.attributes.getNamedItem("tg-component")

    if (tgComponentAttr) {
      const componentName = tgComponentAttr.value
      const args = {}

      const names = ["title", "description", "index", "date"]

      names.forEach(name => {
        if (tgAttrs[name]) args[name] = tgAttrs[name]
      })

      for (let i = 0; i < articleRoot.attributes.length; i++) {
        const attr = articleRoot.attributes.item(i)
        const parts = attr.name.split("-")

        if (parts.length == 3 && parts[0] == "tg" && parts[1] == "data") {
          args[parts[2]] = attr.value
        }
      }

      const component =
        siteData.components.find(component => component.path == componentName + ".html")

      if (component) {
        const componentRoot = component.dom.window.document.body.children[0].cloneNode(true)

        const tgLayoutAttr = componentRoot.attributes.getNamedItem("tg-layout")

        embedArgs(componentRoot, args)

        const headAttrs = { title: getTitle(componentRoot) }

        removeSpecialAttributes(componentRoot)
        embedLinksToArticles(componentRoot, siteData, path)

        if (tgLayoutAttr) {
          const layoutName = tgLayoutAttr.value

          const layout = siteData.layouts.find(layout => layout.path == layoutName + ".html")

          if (layout) {
            const layoutRoot = layout.dom.window.document.body.cloneNode(true)
            embedComponents(layoutRoot, siteData)

            const target = layoutRoot.querySelector("[tg-content]")

            if (target) target.replaceWith(componentRoot)

            return renderHTML(layoutRoot, siteData, headAttrs)
          }
        }
        else {
          return renderHTML(componentRoot, siteData, headAttrs)
        }
      }
      else {
        return ""
      }
    }
    else {
      const tgLayoutAttr = articleRoot.attributes.getNamedItem("tg-layout")
      const headAttrs = { title: getTitle(articleRoot) }

      removeSpecialAttributes(articleRoot)
      embedComponents(articleRoot, siteData)
      embedLinksToArticles(articleRoot, siteData, path)

      if (tgLayoutAttr) {
        const layoutName = tgLayoutAttr.value

        const layout = siteData.layouts.find(layout => layout.path == layoutName + ".html")

        if (layout) {
          const layoutRoot = layout.dom.window.document.body.cloneNode(true)
          embedComponents(layoutRoot, siteData)

          const target = layoutRoot.querySelector("[tg-content]")

          if (target) target.replaceWith(articleRoot)

          return renderHTML(layoutRoot, siteData, headAttrs)
        }
      }
      else {
        return renderHTML(articleRoot, siteData, headAttrs)
      }
    }
  }

  return pretty(siteData.documentTemplate.serialize())
}

const embedComponents = function(node, siteData) {
  const targets = node.querySelectorAll("[tg-component]")

  targets.forEach(target => {
    const tgComponentAttr = target.attributes.getNamedItem("tg-component")
    const componentName = tgComponentAttr.value
    const args = {}

    for (let i = 0; i < target.attributes.length; i++) {
      const attr = target.attributes.item(i)
      const parts = attr.name.split("-")

      if (parts.length == 3 && parts[0] == "tg" && parts[1] == "data") {
        args[parts[2]] = attr.value
      }
    }

    const component =
      siteData.components.find(component => component.path == componentName + ".html")

    if (component) {
      const componentRoot = component.dom.window.document.body.children[0].cloneNode(true)
      embedArgs(componentRoot, args)
      target.replaceWith(componentRoot)
    }
  })
}

const embedArticles = function(node, siteData) {
  const targets = node.querySelectorAll("[tg-article]")

  targets.forEach(target => {
    const tgArticleAttr = target.attributes.getNamedItem("tg-article")
    const articleName = tgArticleAttr.value

    const article =
      siteData.articles.find(article => article.path == articleName + ".html")

    if (article) {
      const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
      removeSpecialAttributes(articleRoot)
      target.replaceWith(articleRoot)
    }
  })
}

const embedArticleLists = function(node, siteData) {
  const targets = node.querySelectorAll("[tg-articles]")

  targets.forEach(target => {
    const pattern = target.attributes.getNamedItem("tg-articles").value
    const tag = getTag(target)
    const tgOrderByAttr = target.attributes.getNamedItem("tg-order-by")

    const articles = filterArticles(siteData.articles, pattern, tag)

    if (tgOrderByAttr) sortArticles(articles, tgOrderByAttr.value)

    articles.forEach(article => {
      const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
      removeSpecialAttributes(articleRoot)
      target.before(articleRoot)
    })

    target.remove()
  })
}

const embedLinksToArticles = function(node, siteData, path) {
  const targets = node.querySelectorAll("[tg-links]")

  targets.forEach(target => {
    const pattern = target.attributes.getNamedItem("tg-links").value
    const tag = getTag(target)
    const tgOrderByAttr = target.attributes.getNamedItem("tg-order-by")

    const articles = filterArticles(siteData.articles, pattern, tag)

    if (tgOrderByAttr) sortArticles(articles, tgOrderByAttr.value)

    articles.forEach(article => {
      const articleRoot = article.dom.window.document.body.children[0]
      const copy = target.cloneNode(true)

      const href = PATH.relative(PATH.dirname(path), PATH.join("src/articles", article.path))
      copy.querySelectorAll("a[href='#']").forEach(anchor => anchor.href = href)

      const args = {
        "title": getTitle(articleRoot),
        "date": getDate(articleRoot)
      }

      embedArgs(copy, args)

      removeSpecialAttributes(copy)

      target.before(copy)
    })

    target.remove()
  })
}

const filterArticles = function(articles, pattern, tag) {
  articles =
    articles.filter(article => {
      if (minimatch(article.path, pattern)) {
        if (tag) {
          const articleRoot = article.dom.window.document.body.children[0]
          const tgTagsAttr = articleRoot.attributes.getNamedItem("tg-tags")

          if (tgTagsAttr) {
            return tgTagsAttr.value.split(",").includes(tag)
          }
        }
        else {
          return true
        }
      }
    })

  return articles
}

const sortArticles = function(articles, orderBy) {
  const re = /^(index):(asc|desc)$/
  const md = re.exec(orderBy)

  if (md) {
    articles.sort((a, b) => {
      const c = a.dom.window.document.body.children[0]
      const d = b.dom.window.document.body.children[0]

      if (c && d) {
        const i = c.attributes.getNamedItem("tg-index")
        const j = d.attributes.getNamedItem("tg-index")

        if (i) {
          if (j) {
            if (i.value > j.value) return -1
            if (i.value < j.value) return 1
            if (i.path > j.path) return -1
            if (i.path < j.path) return 1
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

const embedArgs = function(node, args) {
  const targets = node.querySelectorAll("[tg-text]")

  targets.forEach(target => {
    const tgTextAttr = target.attributes.getNamedItem("tg-text")
    const text = tgTextAttr.value

    if (text.substring(0, 2) == "%{" && text.substring(text.length - 1) == "}") {
      const paramName = text.substring(2, text.length - 1)

      if (paramName in args) {
        target.innerHTML = args[paramName]
      }
    }

    removeSpecialAttributes(target)
  })
}

const renderHTML = function(root, siteData, headAttrs) {
  const dom = new JSDOM(siteData.documentTemplate.serialize())
  dom.window.document.body.replaceWith(root)

  if (headAttrs["title"])
    dom.window.document.head.querySelector("title").textContent = headAttrs["title"]

  return pretty(dom.serialize())
}

const removeSpecialAttributes = function(element) {
  const names = []

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i]
    if (attr.name.match(/^tg-/)) names.push(attr.name)
  }

  names.forEach(n => element.attributes.removeNamedItem(n))
}

const getTitle = function(element) {
  const title = element.attributes.getNamedItem("tg-title")
  if (title) return title.value

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

const getDate = function(element) {
  const dateAttr = element.attributes.getNamedItem("tg-date")
  if (dateAttr) return dateAttr.value
}

const getTag = function(element) {
  const tgFilterAttr = element.attributes.getNamedItem("tg-filter")

  if (tgFilterAttr) {
    const re = /^(tag):(.+)$/
    const md = re.exec(tgFilterAttr.value)
    if (md) return md[2]
  }
}

export default generationFuncs

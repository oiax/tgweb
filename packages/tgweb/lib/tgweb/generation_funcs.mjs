import * as PATH from "path"
import pretty from "pretty"
import { JSDOM } from "jsdom"
import { minimatch } from "minimatch"
import { setAttrs } from "./set_attrs.mjs"
import { removeTgAttributes } from "./remove_tg_attributes.mjs"

const generationFuncs = {}

generationFuncs["page"] = (path, siteData) => {
  const filename = PATH.basename(path)
  const page = siteData.pages.find(page => page.path == filename)

  if (page) {
    const pageRoot = page.dom.window.document.body.children[0].cloneNode(true)
    setAttrs(pageRoot)

    if (pageRoot.attrs["layout"]) {
      const headAttrs = { title: getTitle(pageRoot) }

      embedComponents(pageRoot, siteData)
      embedArticles(pageRoot, siteData)
      embedArticleLists(pageRoot, siteData)
      embedLinksToArticles(pageRoot, siteData, path)

      const layoutRoot = applyLayout(pageRoot, siteData)
      if (layoutRoot) return renderHTML(layoutRoot, siteData, headAttrs, path)
      else return renderHTML(pageRoot, siteData, headAttrs, path)
    }
    else {
      const body = page.dom.window.document.body.cloneNode(true)
      setAttrs(body)

      const headAttrs = { title: getTitle(body) }

      embedComponents(body, siteData)
      embedArticles(body, siteData)
      embedArticleLists(body, siteData)
      embedLinksToArticles(body, siteData, path)

      const layoutRoot = applyLayout(body, siteData)
      if (layoutRoot) return renderHTML(body, siteData, headAttrs, path)
      else return renderHTML(body, siteData, headAttrs, path)
    }
  }

  return pretty(siteData.documentTemplate.serialize())
}

generationFuncs["article"] = (path, siteData) => {
  const article = siteData.articles.find(article => "src/articles/" + article.path == path)

  if (article) {
    const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
    setAttrs(articleRoot)

    embedComponents(articleRoot, siteData)
    return renderArticle(articleRoot, siteData, path)
  }

  return pretty(siteData.documentTemplate.serialize())
}

const renderArticle = (articleRoot, siteData, path) => {
  const headAttrs = { title: getTitle(articleRoot) }
  embedLinksToArticles(articleRoot, siteData, path)
  const layoutRoot = applyLayout(articleRoot, siteData)
  if (layoutRoot) return renderHTML(layoutRoot, siteData, headAttrs, path)
}

const applyLayout = (element, siteData) => {
  if (element.attrs["layout"] === undefined) return

  const layout =
    siteData.layouts.find(layout => layout.path == element.attrs["layout"] + ".html")

  if (layout === undefined) return

  const layoutRoot = layout.dom.window.document.body.cloneNode(true)
  embedContent(layoutRoot, element)
  embedSlotContents(layoutRoot, element)
  embedComponents(layoutRoot, siteData)

  return layoutRoot
}

const extractSlotContents = element => {
  const slotContents =
    Array.from(element.querySelectorAll("tg-insert")).map(elem => {
      const copy = elem.cloneNode(true)
      setAttrs(copy)
      return copy
    })

  element.querySelectorAll("tg-insert").forEach(elem => elem.remove())

  return slotContents
}

const embedContent = (element, provider) => {
  const target = element.querySelector("tg-content")

  if (target) {
    const copy = provider.cloneNode(true)
    Array.from(copy.querySelectorAll("tg-insert")).map(elem => elem.remove())
    Array.from(copy.children).forEach(elem => target.before(elem))
    target.remove()
  }
}

const embedSlotContents = (element, provider) => {
  const slotContents = extractSlotContents(provider)

  element.querySelectorAll("[tg-if-complete]").forEach(wrapper => {
    const complete = Array.from(wrapper.querySelectorAll("tg-slot")).every(slot =>
      slotContents.some(c => c.getAttribute("name") == slot.getAttribute("name"))
    )

    if (complete === false) wrapper.remove()
  })

  element.querySelectorAll("tg-slot").forEach(slot => {
    const content = slotContents.find(c => c.getAttribute("name") == slot.getAttribute("name"))

    if (content) Array.from(content.childNodes).forEach(child => slot.before(child))
    else Array.from(slot.childNodes).forEach(child => slot.before(child))

    slot.remove()
  })
}

const embedComponents = (node, siteData) => {
  const targets = node.querySelectorAll("tg-component")

  targets.forEach(target => {
    setAttrs(target)
    const componentRoot = getComponentRoot(target, siteData)

    if (componentRoot) {
      embedContent(componentRoot, target)
      embedSlotContents(componentRoot, target)
      target.replaceWith(componentRoot)
    }
  })
}

const getComponentRoot = (element, siteData) => {
  const componentName = element.attrs["name"]

  const component =
    siteData.components.find(component => component.path == componentName + ".html")

  if (component) {
    return component.dom.window.document.body.children[0].cloneNode(true)
  }
}

const embedArticles = (node, siteData) => {
  const targets = node.querySelectorAll("tg-article")

  targets.forEach(target => {
    setAttrs(target)

    const article =
      siteData.articles.find(article => article.path == target.attrs["name"] + ".html")

    if (article) {
      const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
      setAttrs(articleRoot)
      embedComponents(articleRoot, siteData)
      Array.from(articleRoot.children).forEach(child => target.before(child))
    }
  })

  Array.from(node.querySelectorAll("tg-article")).forEach(target => target.remove())
}

const embedArticleLists = (node, siteData) => {
  const targets = node.querySelectorAll("tg-articles")

  targets.forEach(target => {
    setAttrs(target)
    const pattern = target.attrs["pattern"]
    const tag = getTag(target)
    const articles = filterArticles(siteData.articles, pattern, tag)

    if (target.attrs["order-by"]) sortArticles(articles, target.attrs["order-by"])

    articles.forEach(article => {
      const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
      setAttrs(articleRoot)

      embedComponents(articleRoot, siteData)

      Array.from(articleRoot.children).forEach(child => target.before(child))
    })
  })

  Array.from(node.querySelectorAll("tg-articles")).forEach(target => target.remove())
}

const embedLinksToArticles = (node, siteData, path) => {
  const targets = node.querySelectorAll("tg-links")

  targets.forEach(target => {
    setAttrs(target)
    const pattern = target.attrs["pattern"]
    const tag = getTag(target)

    const articles = filterArticles(siteData.articles, pattern, tag)

    if (target.attrs["order-by"]) sortArticles(articles, target.attrs["order-by"])

    articles.forEach(article => {
      const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
      setAttrs(articleRoot)

      const copy = target.cloneNode(true)
      embedSlotContents(copy, articleRoot)

      const href = PATH.relative(PATH.dirname(path), PATH.join("src/articles", article.path))
      copy.querySelectorAll("a[href='#']").forEach(anchor => anchor.href = href)

      Array.from(copy.children).forEach(child => target.before(child))
    })
  })

  Array.from(node.querySelectorAll("tg-links")).forEach(target => target.remove())
}

const filterArticles = (articles, pattern, tag) => {
  articles =
    articles.filter(article => {
      if (minimatch(article.path, pattern)) {
        if (tag) {
          const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
          setAttrs(articleRoot)

          if (articleRoot.attrs["tags"]) {
            return articleRoot.attrs["tags"].split(",").includes(tag)
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
        setAttrs(c)
        setAttrs(d)
        const i = c.attrs["index"]
        const j = d.attrs["index"]

        if (i) {
          if (j) {
            if (i > j) return 1
            if (i < j) return -1
            if (a.path > b.path) return 1
            if (a.path < b.path) return -1
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

const renderHTML = (root, siteData, headAttrs, path) => {
  const dom = new JSDOM(siteData.documentTemplate.serialize())
  processTgLinks(root, siteData, path)
  removeTgAttributes(root)
  dom.window.document.body.replaceWith(root)

  if (headAttrs["title"])
    dom.window.document.head.querySelector("title").textContent = headAttrs["title"]

  return pretty(dom.serialize())
}

const processTgLinks = (root, siteData, path) => {
  const currentPath = path.replace(/^src\//, "").replace(/^pages\//, "")

  Array.from(root.querySelectorAll("tg-link[href]")).forEach(link => {
    const href = link.getAttribute("href")
    const label = link.getAttribute("label") || ""

    const componentName = link.getAttribute("component")

    if (componentName) {
      const component =
        siteData.components.find(component => component.path == componentName + ".html")

      if (component) {
        link.innerHTML = ""

        Array.from(component.dom.window.document.body.children).forEach(child => {
          link.appendChild(child.cloneNode(true))
        })
      }
    }

    Array.from(link.querySelectorAll("tg-label")).forEach(e => e.replaceWith(label))

    if (href === `/${currentPath}`) {
      const fallback = link.querySelector("[tg-if-current]")
      if (fallback) link.before(fallback)
    }
    else {
      const fallback = link.querySelector("[tg-if-current]")
      if (fallback) fallback.remove()
      const adjusted = href.replace(/\/index.html$/, "/")
      Array.from(link.querySelectorAll("a[href='#']")).forEach(a => a.href = adjusted)
      Array.from(link.children).forEach(child => link.before(child))
    }
  })

   Array.from(root.querySelectorAll("tg-link[href]")).forEach(link => link.remove())
}

const getTitle = element => {
  if (element.attrs["title"]) return element.attrs["title"]

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
  element.attrs["filter"]

  if (element.attrs["filter"]) {
    const re = /^(tag):(.+)$/
    const md = re.exec(element.attrs["filter"])
    if (md) return md[2]
  }
}

export default generationFuncs

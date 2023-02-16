import * as PATH from "path"
import pretty from "pretty"
import { JSDOM } from "jsdom"
import { minimatch } from "minimatch"
import { setAttrs } from "./set_attrs.mjs"
import { removeTgAttributes } from "./remove_tg_attributes.mjs"

const generationFuncs = {}

generationFuncs["page"] = (path, siteData) => {
  const relPath = path.replace(/^src\/pages\//, "")
  const page = siteData.pages.find(page => page.path == relPath)

  if (page) {
    const pageRoot = page.dom.window.document.body.children[0].cloneNode(true)
    setAttrs(pageRoot)

    const dirname = PATH.dirname(relPath)
    const dirParts = dirname.split(PATH.sep)

    let wrapper = undefined

    for(let i = dirParts.length; i > 0; i--) {
      const dir = dirParts.slice(0, i).join(PATH.sep)
      const wrapperPath = PATH.join("pages", dir, "_wrapper.html")
      wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)
      if (wrapper) break
    }

    let layoutRoot

    if (wrapper) {
      const wrapperRoot = wrapper.dom.window.document.body.children[0].cloneNode(true)
      setAttrs(wrapperRoot)
      embedSlotContents(wrapperRoot, pageRoot)

      embedComponents(pageRoot, siteData, path)
      embedArticles(pageRoot, siteData, path)
      embedArticleLists(pageRoot, siteData, path)
      embedLinksToArticles(pageRoot, siteData, path)

      embedContent(wrapperRoot, pageRoot)

      const headAttrs = { title: getTitle(wrapperRoot) }

      layoutRoot = applyLayout(wrapperRoot, siteData, path)
      if (layoutRoot) return renderHTML(layoutRoot, siteData, headAttrs, path)
      else console.log("Error")
    }
    else if (pageRoot.attrs["layout"]) {
      const headAttrs = { title: getTitle(pageRoot) }

      embedComponents(pageRoot, siteData, path)
      embedArticles(pageRoot, siteData, path)
      embedArticleLists(pageRoot, siteData, path)
      embedLinksToArticles(pageRoot, siteData, path)

      layoutRoot = applyLayout(pageRoot, siteData, path)
      if (layoutRoot) return renderHTML(layoutRoot, siteData, headAttrs, path)
      else return renderHTML(pageRoot, siteData, headAttrs, path)
    }
    else {
      const body = page.dom.window.document.body.cloneNode(true)
      setAttrs(body)

      const headAttrs = { title: getTitle(body) }

      embedComponents(body, siteData, path)
      embedArticles(body, siteData, path)
      embedArticleLists(body, siteData, path)
      embedLinksToArticles(body, siteData, path)

      const layoutRoot = applyLayout(body, siteData, path)
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

    embedComponents(articleRoot, siteData, path)
    return renderArticle(articleRoot, siteData, path)
  }

  return pretty(siteData.documentTemplate.serialize())
}

const renderArticle = (articleRoot, siteData, path) => {
  const relPath = path.replace(/^src\/articles\//, "")
  const dirname = PATH.dirname(relPath)
  const dirParts = dirname.split(PATH.sep)

  let wrapper = undefined

  for(let i = dirParts.length; i > 0; i--) {
    const dir = dirParts.slice(0, i).join(PATH.sep)
    const wrapperPath = PATH.join("articles", dir, "_wrapper.html")
    wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)
    if (wrapper) break
  }

  if (wrapper) {
    embedComponents(articleRoot, siteData, path)
    embedLinksToArticles(articleRoot, siteData, path)

    const wrapperRoot = wrapper.dom.window.document.body.children[0].cloneNode(true)
    setAttrs(wrapperRoot)

    embedContent(wrapperRoot, articleRoot)
    embedSlotContents(wrapperRoot, articleRoot)

    const headAttrs = { title: getTitle(wrapperRoot) }

    const layoutRoot = applyLayout(wrapperRoot, siteData, path)
    if (layoutRoot) return renderHTML(layoutRoot, siteData, headAttrs, path)
    else console.log("Error")
  }
  else {
    const headAttrs = { title: getTitle(articleRoot) }
    embedLinksToArticles(articleRoot, siteData, path)
    const layoutRoot = applyLayout(articleRoot, siteData, path)
    if (layoutRoot) return renderHTML(layoutRoot, siteData, headAttrs, path)
    else console.log("Error")
  }
}

const applyLayout = (element, siteData, path) => {
  if (element.attrs["layout"] === undefined) return

  const layout =
    siteData.layouts.find(layout => layout.path == element.attrs["layout"] + ".html")

  if (layout === undefined) return

  const layoutRoot = layout.dom.window.document.body.cloneNode(true)

  embedContent(layoutRoot, element)
  embedSlotContents(layoutRoot, element)
  embedComponents(layoutRoot, siteData, path)

  return layoutRoot
}

const extractSlotContents = element => {
  const slotContents =
    Array.from(element.querySelectorAll("tg-insert")).map(elem => {
      const copy = elem.cloneNode(true)
      setAttrs(copy)
      return copy
    })

  return slotContents
}

const embedContent = (element, provider) => {
  const target =
    Array.from(element.childNodes).find(child =>
      child.nodeType === 1 && child.nodeName == "TG-CONTENT"
    )

  if (target) {
    const copy = provider.cloneNode(true)
    Array.from(copy.querySelectorAll("tg-insert")).map(elem => elem.remove())
    Array.from(copy.childNodes).forEach(c => element.insertBefore(c, target))
    element.removeChild(target)
  }
  else {
    element.childNodes.forEach(child => embedContent(child, provider))
  }
}

const embedSlotContents = (element, provider) => {
  const slotContents = extractSlotContents(provider)

  element.querySelectorAll("tg-if-complete").forEach(wrapper => {
    const complete = Array.from(wrapper.querySelectorAll("tg-slot")).every(slot => {
      setAttrs(slot)

      return slotContents.some(c => {
        setAttrs(c)
        return c.attrs["name"] == slot.attrs["name"]
      })
    })

    if (complete) {
      wrapper.childNodes.forEach(child => element.insertBefore(child.cloneNode(true), wrapper))
    }
  })

  element.querySelectorAll("tg-if-complete").forEach(wrapper => wrapper.remove())

  element.querySelectorAll("tg-slot").forEach(slot => {
    setAttrs(slot)
    const content = slotContents.find(c => c.attrs["name"] == slot.attrs["name"])

    if (content) Array.from(content.cloneNode(true).childNodes).forEach(child => slot.before(child))
    else Array.from(slot.childNodes).forEach(child => slot.before(child))
  })

  element.querySelectorAll("tg-slot").forEach(slot => slot.remove())
}

const embedComponents = (node, siteData, path) => {
  const targets = node.querySelectorAll("tg-component")

  targets.forEach(target => {
    setAttrs(target)
    const componentRoot = getComponentRoot(target, siteData)

    if (componentRoot) {
      embedContent(componentRoot, target)
      embedLinksToArticles(componentRoot, siteData, path)
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

const embedArticles = (node, siteData, path) => {
  const targets = node.querySelectorAll("tg-article")

  targets.forEach(target => {
    setAttrs(target)

    const article =
      siteData.articles.find(article => article.path == target.attrs["name"] + ".html")

    if (article) {
      const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
      setAttrs(articleRoot)
      embedComponents(articleRoot, siteData, path)
      Array.from(articleRoot.children).forEach(child => target.before(child))
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
      const dirParts = article.path.split(PATH.sep)
      dirParts.pop()

      let wrapper = undefined

      for(let i = dirParts.length; i > 0; i--) {
        const dir = dirParts.slice(0, i).join(PATH.sep)
        const wrapperPath = PATH.join("articles", dir, "_wrapper.html")

        wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)
        if (wrapper) break
      }

      const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
      setAttrs(articleRoot)

      if (wrapper) {
        const wrapperRoot = wrapper.dom.window.document.body.children[0].cloneNode(true)
        setAttrs(wrapperRoot)
        embedSlotContents(wrapperRoot, articleRoot)

        embedComponents(articleRoot, siteData, path)
        embedLinksToArticles(articleRoot, siteData, path)

        embedContent(wrapperRoot, articleRoot)

        Array.from(wrapperRoot.childNodes).forEach(child => target.before(child))
      }
      else {
        embedComponents(articleRoot, siteData, path)

        Array.from(articleRoot.childNodes).forEach(child => target.before(child))
      }
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
      const href = `/articles/${article.path}`.replace(/\/index.html$/, "/")

      const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
      setAttrs(articleRoot)

      const copy = target.cloneNode(true)

      embedSlotContents(copy, articleRoot)

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

  return pretty(dom.serialize(), {ocd: true})
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
        const componentRoot = component.dom.window.document.body.childNodes[0]
        link.innerHTML = ""
        Array.from(componentRoot.childNodes).forEach(child => link.appendChild(child))
      }
    }

    Array.from(link.querySelectorAll("tg-label")).forEach(e => e.replaceWith(label))

    if (href === `/${currentPath}`) {
      const fallback = link.querySelector("tg-if-current")

      if (fallback) {
        Array.from(fallback.childNodes).forEach(child => link.before(child))
      }
    }
    else {
      const fallback = link.querySelector("tg-if-current")
      if (fallback) fallback.remove()
      const adjusted = href.replace(/\/index.html$/, "/")
      Array.from(link.querySelectorAll("a[href='#']")).forEach(a => a.href = adjusted)
      Array.from(link.childNodes).forEach(child => link.before(child))
    }

    link.remove()
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

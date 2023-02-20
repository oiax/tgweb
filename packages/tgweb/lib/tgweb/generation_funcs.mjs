import * as PATH from "path"
import pretty from "pretty"
import { JSDOM } from "jsdom"
import { minimatch } from "minimatch"
import { setAttrs } from "./set_attrs.mjs"
import { removeTgAttributes } from "./remove_tg_attributes.mjs"

const generationFuncs = {}

const dbg = element => {
  console.log("<<<<")
  console.log(pretty(element.outerHTML, {ocd: true}))
  console.log(">>>>")
}

// Prevent warnings when function dbg is not used.
if (dbg === undefined) { dbg() }

generationFuncs["page"] = (path, siteData) => {
  const relPath = path.replace(/^src\/pages\//, "")
  const page = siteData.pages.find(page => page.path == relPath)

  if (page) {
    const pageRoot = page.dom.window.document.body.cloneNode(true)
    setAttrs(pageRoot)
    expandClassAliases(page.frontMatter, pageRoot)

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
      const frontMatter = makeLocalFrontMatter(page, wrapper)
      const wrapperRoot = wrapper.dom.window.document.body.cloneNode(true)
      expandClassAliases(frontMatter, wrapperRoot)
      fillInPlaceHolders(wrapperRoot, pageRoot, page)
      embedComponents(page, pageRoot, siteData, path)
      embedArticles(pageRoot, siteData, path)
      embedArticleLists(pageRoot, siteData, path)
      embedLinksToArticles(page, pageRoot, siteData, path)
      embedContent(wrapperRoot, pageRoot)

      const headAttrs = { title: getTitle(page, wrapperRoot) }

      layoutRoot = applyLayout(wrapper, wrapperRoot, siteData, path)
      if (layoutRoot) return renderHTML(page, layoutRoot, siteData, headAttrs, path)
      else console.log("Error")
    }
    else if (page.frontMatter["layout"]) {
      const headAttrs = { title: getTitle(page, pageRoot) }

      embedComponents(page, pageRoot, siteData, path)
      embedArticles(pageRoot, siteData, path)
      embedArticleLists(pageRoot, siteData, path)
      embedLinksToArticles(page, pageRoot, siteData, path)

      layoutRoot = applyLayout(page, pageRoot, siteData, path)
      if (layoutRoot) return renderHTML(page, layoutRoot, siteData, headAttrs, path)
      else return renderHTML(page, pageRoot, siteData, headAttrs, path)
    }
    else {
      const body = page.dom.window.document.body.cloneNode(true)
      setAttrs(body)

      const headAttrs = { title: getTitle(page, body) }

      embedComponents(page, body, siteData, path)
      embedArticles(body, siteData, path)
      embedArticleLists(body, siteData, path)
      embedLinksToArticles(page, body, siteData, path)

      const layoutRoot = applyLayout(page, body, siteData, path)
      if (layoutRoot) return renderHTML(page, body, siteData, headAttrs, path)
      else return renderHTML(page, body, siteData, headAttrs, path)
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
    embedComponents(article, articleRoot, siteData, path)
    embedLinksToArticles(article, articleRoot, siteData, path)

    const frontMatter = makeLocalFrontMatter(article, wrapper)
    const wrapperRoot = wrapper.dom.window.document.body.cloneNode(true)
    expandClassAliases(frontMatter, wrapperRoot)
    embedContent(wrapperRoot, articleRoot)
    fillInPlaceHolders(wrapperRoot, articleRoot, article)

    const headAttrs = { title: getTitle(article, wrapperRoot) }

    const layoutRoot = applyLayout(wrapper, wrapperRoot, siteData, path)
    if (layoutRoot) return renderHTML(article, layoutRoot, siteData, headAttrs, path)
    else console.log("Error")
  }
  else {
    const headAttrs = { title: getTitle(article, articleRoot) }
    embedLinksToArticles(article, articleRoot, siteData, path)
    const layoutRoot = applyLayout(article, articleRoot, siteData, path)
    if (layoutRoot) return renderHTML(article, layoutRoot, siteData, headAttrs, path)
    else console.log("Error")
  }
}

const makeLocalFrontMatter = (template, wrapperOrLayout) => {
  const frontMatter = {}

  Object.keys(template.frontMatter).forEach(key => {
    if (Object.hasOwn(template.frontMatter, key)) {
      frontMatter[key] = template.frontMatter[key]
    }
  })

  Object.keys(wrapperOrLayout.frontMatter).forEach(key => {
    if (Object.hasOwn(wrapperOrLayout.frontMatter, key) && !Object.hasOwn(frontMatter, key)) {
      frontMatter[key] = wrapperOrLayout.frontMatter[key]
    }
  })

  return frontMatter
}

const expandClassAliases = (frontMatter, root) => {
  if (root.className) doExpandClassAliases(frontMatter, root)

  root.querySelectorAll("[class]").forEach(elem => {
    doExpandClassAliases(frontMatter, elem)
  })
}

const doExpandClassAliases = (frontMatter, elem) => {
  const htmlClass = elem.getAttribute("class")

  const expanded = htmlClass.replaceAll(/\$\{(\w+(?:-\w+)*)\}/g, (_, alias) => {
    const key = `class-${alias}`
    if (Object.hasOwn(frontMatter, key)) return frontMatter[key]
    else return `\${${alias}}`
  })

  elem.setAttribute("class", expanded)
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

const fillInPlaceHolders = (element, provider, template) => {
  const slotContents = extractSlotContents(provider)

  element.querySelectorAll("tg-if-complete").forEach(envelope => {
    const placeholders = Array.from(envelope.querySelectorAll("tg-slot, tg-data, tg-prop"))

    const complete = placeholders.every(placeholder => {
      setAttrs(placeholder)

      if (placeholder.tagName == "TG-PROP") {
        return Object.hasOwn(template.frontMatter, placeholder.attrs["name"])
      }
      else if (placeholder.tagName == "TG-DATA") {
        return Object.hasOwn(template.frontMatter, "data-" + placeholder.attrs["name"])
      }
      else if (placeholder.tagName == "TG-SLOT") {
        return slotContents.some(c => c.attrs["name"] == placeholder.attrs["name"])
      }
    })

    if (complete) {
      envelope.childNodes.forEach(child =>
        envelope.parentNode.insertBefore(child.cloneNode(true), envelope)
      )
    }
  })

  element.querySelectorAll("tg-if-complete").forEach(wrapper => wrapper.remove())

  element.querySelectorAll("tg-slot, tg-data, tg-prop").forEach(placeholder => {
    setAttrs(placeholder)

    if (placeholder.tagName == "TG-PROP") {
      const value = template.frontMatter[placeholder.attrs["name"]]
      if (value) placeholder.before(value)
    }
    else if (placeholder.tagName == "TG-DATA") {
      const value = template.frontMatter["data-" + placeholder.attrs["name"]]
      if (value) placeholder.before(value)
    }
    else if (placeholder.tagName == "TG-SLOT") {
      const content = slotContents.find(c => c.attrs["name"] == placeholder.attrs["name"])

      if (content)
        Array.from(content.cloneNode(true).childNodes).forEach(child => placeholder.before(child))
      else
        Array.from(placeholder.childNodes).forEach(child => placeholder.before(child))
    }
  })

  element.querySelectorAll("tg-slot, tg-data, tg-prop").forEach(slot => slot.remove())
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

      const articleRoot = article.dom.window.document.body.cloneNode(true)

      if (wrapper) {
        const wrapperRoot = wrapper.dom.window.document.body.cloneNode(true)
        fillInPlaceHolders(wrapperRoot, articleRoot, article)

        embedComponents(article, articleRoot, siteData, path)
        embedLinksToArticles(article, articleRoot, siteData, path)

        embedContent(wrapperRoot, articleRoot)

        Array.from(wrapperRoot.childNodes).forEach(child => target.before(child))
      }
      else {
        embedComponents(article, articleRoot, siteData, path)

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

const filterArticles = (articles, pattern, tag) => {
  articles =
    articles.filter(article => {
      if (minimatch(article.path, pattern)) {
        if (tag) {
          if (article.frontMatter["tags"]) {
            return article.frontMatter["tags"].split(/, */).includes(tag)
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
      const i = a.frontMatter["index"]
      const j = b.frontMatter["index"]

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
    })

    if (md[2] == "desc") articles.reverse()
  }
}

const renderHTML = (template, root, siteData, headAttrs, path) => {
  const dom = new JSDOM(siteData.documentTemplate.serialize())

  processTgLinks(root, siteData, path)
  removeTgAttributes(root)

  dom.window.document.body.replaceWith(root)

  if (headAttrs["title"])
    dom.window.document.head.querySelector("title").textContent = headAttrs["title"]

  const link = dom.window.document.head.querySelector("link")

  Object.keys(template.frontMatter).forEach(key => {
    if (key.startsWith("meta-")) {
      const name = key.slice(5)
      const content = template.frontMatter[key]
      const meta = dom.window.document.createElement("meta")
      meta.setAttribute("name", name)
      meta.setAttribute("content", content)
      link.before(meta)
    }
  })

  Object.keys(template.frontMatter).forEach(key => {
    if (key.startsWith("http-equiv-")) {
      const name = key.slice(11)
      const content = template.frontMatter[key]
      const meta = dom.window.document.createElement("meta")
      meta.setAttribute("http-equiv", name)
      meta.setAttribute("content", content)
      link.before(meta)
    }
  })

  Object.keys(template.frontMatter).forEach(key => {
    if (key.startsWith("property-")) {
      const name = key.slice(9)
      const content = template.frontMatter[key]

      const converted = content.replaceAll(/\$\{([^}]+)\}/g, (_, propName) => {
        if (Object.hasOwn(template.frontMatter, propName)) {
          return template.frontMatter[propName]
        }
        else {
          `\${${propName}}`
        }
      })

      const meta = dom.window.document.createElement("meta")
      meta.setAttribute("property", name)
      meta.setAttribute("content", converted)
      link.before(meta)
    }
  })

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

        if (componentRoot.tagName === "TG-LINK") {
          link.innerHTML = ""
          Array.from(componentRoot.childNodes).forEach(child => link.appendChild(child))
        }
        else {
          console.log("Error.")
        }
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

const getTitle = (template, element) => {
  if (template.frontMatter["title"]) return template.frontMatter["title"]

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

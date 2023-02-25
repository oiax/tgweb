import pretty from "pretty"
import { JSDOM } from "jsdom"
import getTag from "./get_tag.mjs"
import filterArticles from "./filter_articles.mjs"
import { setAttrs } from "./set_attrs.mjs"
import { removeTgAttributes } from "./remove_tg_attributes.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { makeLocalFrontMatter } from "./make_local_front_matter.mjs"
import { processTgLinks } from "./process_tg_links.mjs"

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

const sortArticles = (articles, orderBy) => {
  const re = /^(title|index):(asc|desc)$/
  const md = re.exec(orderBy)
  const criteria = md[1]
  const direction = md[2]

  if (criteria === undefined) return

  if (criteria === "title") {
    articles.sort((a, b) => {
      const titleA = getTitle(a, a.dom.window.document.body)
      const titleB = getTitle(b, b.dom.window.document.body)

      if (titleA > titleB) return 1
      if (titleA < titleB) return -1
      return 0
    })
  }
  else if (criteria === "index") {
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
  }

  if (direction === "desc") articles.reverse()
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

  Object.keys(template.frontMatter).forEach(key => {
    if (key.startsWith("link-")) {
      const rel = key.slice(5)
      if (rel == "stylesheet") return
      const href = template.frontMatter[key]
      const newLink = dom.window.document.createElement("link")
      newLink.setAttribute("rel", rel)
      newLink.setAttribute("href", href)
      link.before(newLink)
    }
  })

  return pretty(dom.serialize(), {ocd: true})
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

export default generationFuncs

import * as PATH from "path"
import pretty from "pretty"
import { JSDOM } from "jsdom"

const generationFuncs = {}

generationFuncs["page"] = function(path, siteData) {
  const filename = PATH.basename(path)
  const page = siteData.pages.find(page => page.filename == filename)

  if (page) {
    const pageRoot = page.dom.window.document.body.children[0].cloneNode(true)
    const tgLayoutAttr = pageRoot.attributes.getNamedItem("tg-layout")
    const headAttrs = { title: getTitle(pageRoot) }

    removeSpecialAttributes(pageRoot)
    embedComponents(pageRoot, siteData)

    if (tgLayoutAttr) {
      const layoutName = tgLayoutAttr.value

      const layout = siteData.layouts.find(layout => layout.filename == layoutName + ".html")

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
  const filename = PATH.basename(path)
  const article = siteData.articles.find(article => article.filename == filename)

  if (article) {
    const articleRoot = article.dom.window.document.body.children[0].cloneNode(true)
    const tgLayoutAttr = articleRoot.attributes.getNamedItem("tg-layout")
    const headAttrs = { title: getTitle(articleRoot) }

    removeSpecialAttributes(articleRoot)
    embedComponents(articleRoot, siteData)

    if (tgLayoutAttr) {
      const layoutName = tgLayoutAttr.value

      const layout = siteData.layouts.find(layout => layout.filename == layoutName + ".html")

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
      siteData.components.find(component => component.filename == componentName + ".html")

    if (component) {
      const componentRoot = component.dom.window.document.body.children[0].cloneNode(true)
      embedArgs(componentRoot, args)
      target.replaceWith(componentRoot)
    }
  })
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

export default generationFuncs

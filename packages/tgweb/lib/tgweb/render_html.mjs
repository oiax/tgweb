import { JSDOM } from "jsdom"
import pretty from "pretty"
import { processTgLinks } from "./process_tg_links.mjs"
import { removeTgAttributes } from "./remove_tg_attributes.mjs"
import { setUrlProperty } from "./set_url_property.mjs"
import { expandPaths } from "./expand_paths.mjs"

const renderHTML = (root, siteData, documentProperties, headAttrs, path) => {
  setUrlProperty(documentProperties, siteData, path)
  expandPaths(documentProperties)
  const dom = new JSDOM(siteData.documentTemplate.serialize())

  processTgLinks(root, siteData, path)
  removeTgAttributes(root)

  dom.window.document.body.replaceWith(root)

  if (headAttrs["title"])
    dom.window.document.head.querySelector("title").textContent = headAttrs["title"]

  const link = dom.window.document.head.querySelector("link")

  Object.keys(documentProperties).forEach(key => {
    if (key.startsWith("meta-")) {
      const name = key.slice(5)
      const content = documentProperties[key]
      const meta = dom.window.document.createElement("meta")
      meta.setAttribute("name", name)
      meta.setAttribute("content", content)
      link.before(meta)
    }
  })

  Object.keys(documentProperties).forEach(key => {
    if (key.startsWith("http-equiv-")) {
      const name = key.slice(11)
      const content = documentProperties[key]
      const meta = dom.window.document.createElement("meta")
      meta.setAttribute("http-equiv", name)
      meta.setAttribute("content", content)
      link.before(meta)
    }
  })

  Object.keys(documentProperties).forEach(key => {
    if (key.startsWith("property-")) {
      const name = key.slice(9)
      const content = documentProperties[key]

      const converted = content.replaceAll(/\$\{([^}]+)\}/g, (_, propName) => {
        if (Object.hasOwn(documentProperties, propName)) {
          return documentProperties[propName]
        }
        else {
          return `\${${propName}}`
        }
      })

      const meta = dom.window.document.createElement("meta")
      meta.setAttribute("property", name)
      meta.setAttribute("content", converted)
      link.before(meta)
    }
  })

  Object.keys(documentProperties).forEach(key => {
    if (key.startsWith("link-")) {
      const rel = key.slice(5)
      if (rel == "stylesheet") return
      const href = documentProperties[key]
      const newLink = dom.window.document.createElement("link")
      newLink.setAttribute("rel", rel)
      newLink.setAttribute("href", href)
      link.before(newLink)
    }
  })

  if (siteData.properties["font-material-symbols"] === true) {
    const newLink = dom.window.document.createElement("link")
    newLink.setAttribute("rel", "stylesheet")
    newLink.setAttribute("href", "/css/material-symbols/index.css")
    link.before(newLink)
  }

  return pretty(dom.serialize(), {ocd: true})
}

export { renderHTML }

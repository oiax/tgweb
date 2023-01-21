import * as PATH from "path"
import pretty from "pretty"

const generationFuncs = {}

generationFuncs["page"] = function(path, siteData) {
  const filename = PATH.basename(path)
  const page = siteData.pages.find(page => page.filename == filename)

  if (page) {
    const pageRoot = page.dom.window.document.body.children[0]
    embedComponents(pageRoot, siteData)

    const tgLayoutAttr = pageRoot.attributes.getNamedItem("tg-layout")

    if (tgLayoutAttr) {
      const layoutName = tgLayoutAttr.value

      const layout = siteData.layouts.find(layout => layout.filename == layoutName + ".html")

      if (layout) {
        const layoutRoot = layout.dom.window.document.body
        embedComponents(layoutRoot, siteData)

        const target = layoutRoot.querySelector("[tg-content]")
        if (target) target.replaceWith(pageRoot)

        siteData.documentTemplate.window.document.body.replaceWith(layoutRoot)
      }
    }
    else {
      siteData.documentTemplate.window.document.body.replaceWith(pageRoot)
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
      const componentRoot = component.dom.window.document.body.children[0]
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

    target.attributes.removeNamedItem("tg-text")
  })
}

export default generationFuncs

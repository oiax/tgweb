import { setAttrs } from "./set_attrs.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { embedContent } from "./embed_content.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { err } from "./err.mjs"

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
      embedLinksToArticles(componentRoot, siteData, path)
      fillInPlaceHolders(componentRoot, target, template)
      target.replaceWith(componentRoot)
    }
    else {
      err(target, siteData, `No component named ${target.attrs["name"]} exists.`)
      target.remove()
    }
  })
}

export { embedComponents }

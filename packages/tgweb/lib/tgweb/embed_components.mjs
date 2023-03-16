import { setAttrs } from "./set_attrs.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { embedContent } from "./embed_content.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { mergeProperties } from "./merge_properties.mjs"
import { err } from "./err.mjs"

const embedComponents = (container, documentProperties, siteData, path) => {
  const targets = container.querySelectorAll("tg-component")

  targets.forEach(target => {
    setAttrs(target)

    const componentName = target.attrs["name"]

    const component =
      siteData.components.find(component => component.path == componentName + ".html")

    if (component) {
      const properties = mergeProperties(component.frontMatter, documentProperties)
      const componentRoot = component.dom.window.document.body.children[0].cloneNode(true)
      expandClassAliases(componentRoot, component.frontMatter)
      embedContent(componentRoot, target)
      embedLinksToArticles(componentRoot, siteData, path)
      fillInPlaceHolders(componentRoot, target, properties)
      target.replaceWith(componentRoot)
    }
    else {
      err(target, siteData, `No component named ${target.attrs["name"]} exists.`)
      target.remove()
    }
  })
}

export { embedComponents }

import { setAttrs } from "./set_attrs.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { expandCustomProperties } from "./expand_custom_properties.mjs"
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
      let properties = {}

      Object.keys(target.attrs.data).forEach(key => {
        properties[`data-${key}`] = target.attrs.data[key]
      })

      properties = mergeProperties(properties, documentProperties)
      properties = mergeProperties(component.frontMatter, properties)

      const componentRoot = component.dom.window.document.body.cloneNode(true)
      embedLinksToArticles(componentRoot, component.frontMatter, siteData, path)
      expandClassAliases(componentRoot, component.frontMatter)
      expandCustomProperties(componentRoot, properties)
      embedContent(componentRoot, target)
      fillInPlaceHolders(componentRoot, target, properties)

      Array.from(componentRoot.childNodes).forEach(child => target.before(child))
    }
    else {
      err(target, siteData, `No component named ${target.attrs["name"]} exists.`)
    }
  })

  targets.forEach(target => target.remove())
}

export { embedComponents }

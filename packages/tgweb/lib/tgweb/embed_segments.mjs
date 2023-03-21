import { setAttrs } from "./set_attrs.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { expandCustomProperties } from "./expand_custom_properties.mjs"
import { embedContent } from "./embed_content.mjs"
import { embedComponents } from "./embed_components.mjs"
import { embedArticles } from "./embed_articles.mjs"
import { embedArticleLists } from "./embed_article_lists.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { mergeProperties } from "./merge_properties.mjs"
import { err } from "./err.mjs"

const embedSegments = (container, documentProperties, siteData, path) => {
  const targets = container.querySelectorAll("tg-segment")

  targets.forEach(target => {
    setAttrs(target)

    const segmentName = target.attrs["name"]

    const segment =
      siteData.segments.find(segment => segment.path == segmentName + ".html")

    if (segment) {
      let properties = {}

      Object.keys(target.attrs.data).forEach(key => {
        properties[`data-${key}`] = target.attrs.data[key]
      })

      properties = mergeProperties(properties, documentProperties)
      properties = mergeProperties(segment.frontMatter, properties)

      const segmentRoot = segment.dom.window.document.body.cloneNode(true)
      embedLinksToArticles(segmentRoot, segment.frontMatter, siteData, path)
      expandClassAliases(segmentRoot, segment.frontMatter)
      expandCustomProperties(segmentRoot, properties)
      embedContent(segmentRoot, target)
      embedComponents(segmentRoot, properties, siteData, path)
      embedArticles(segmentRoot, siteData, path)
      embedArticleLists(segmentRoot, siteData, path)
      fillInPlaceHolders(segmentRoot, target, properties)

      Array.from(segmentRoot.childNodes).forEach(child => target.before(child))
    }
    else {
      err(target, siteData, `No segment named ${target.attrs["name"]} exists.`)
    }
  })

  targets.forEach(target => target.remove())
}

export { embedSegments }

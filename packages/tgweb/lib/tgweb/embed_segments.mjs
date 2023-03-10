import { setAttrs } from "./set_attrs.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { embedContent } from "./embed_content.mjs"
import { embedComponents } from "./embed_components.mjs"
import { embedArticles } from "./embed_articles.mjs"
import { embedArticleLists } from "./embed_article_lists.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { err } from "./err.mjs"

const embedSegments = (template, node, siteData, path) => {
  const targets = node.querySelectorAll("tg-segment")

  targets.forEach(target => {
    setAttrs(target)

    const segmentName = target.attrs["name"]

    const segment =
      siteData.segments.find(segment => segment.path == segmentName + ".html")

    if (segment) {
      const segmentRoot = segment.dom.window.document.body.children[0].cloneNode(true)
      expandClassAliases(segment.frontMatter, segmentRoot)
      embedContent(segmentRoot, target)
      embedComponents(segment, segmentRoot, siteData, path)
      embedArticles(segmentRoot, siteData, path)
      embedArticleLists(segmentRoot, siteData, path)
      embedLinksToArticles(segmentRoot, siteData, path)
      fillInPlaceHolders(segmentRoot, target, template)
      target.replaceWith(segmentRoot)
    }
    else {
      err(target, siteData, `No segment named ${target.attrs["name"]} exists.`)
      target.remove()
    }
  })
}

export { embedSegments }

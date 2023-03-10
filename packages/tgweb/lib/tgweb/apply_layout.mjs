import { makeLocalFrontMatter } from "./make_local_front_matter.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { embedContent } from "./embed_content.mjs"
import { embedArticles } from "./embed_articles.mjs"
import { embedArticleLists } from "./embed_article_lists.mjs"
import { embedLinksToArticles } from "./embed_links_to_articles.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { embedSegments } from "./embed_segments.mjs"
import { embedComponents } from "./embed_components.mjs"

const applyLayout = (template, templateRoot, siteData, path) => {
  if (template.frontMatter["layout"] === undefined) return templateRoot

  const layout =
    siteData.layouts.find(layout => layout.path == template.frontMatter["layout"] + ".html")

  if (layout === undefined) return templateRoot

  const layoutRoot = layout.dom.window.document.body.cloneNode(true)

  const frontMatter = makeLocalFrontMatter(template, layout)
  expandClassAliases(frontMatter, layoutRoot)
  embedContent(layoutRoot, templateRoot)
  embedComponents(template, layoutRoot, siteData, path)
  embedSegments(template, layoutRoot, siteData, path)
  embedArticles(layoutRoot, siteData, path)
  embedArticleLists(layoutRoot, siteData, path)
  embedLinksToArticles(layoutRoot, siteData, path)
  fillInPlaceHolders(layoutRoot, templateRoot, template)

  return layoutRoot
}

export { applyLayout }

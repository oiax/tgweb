import { makeLocalFrontMatter } from "./make_local_front_matter.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { embedContent } from "./embed_content.mjs"
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
  fillInPlaceHolders(layoutRoot, templateRoot, template)
  embedSegments(template, layoutRoot, siteData, path)
  embedComponents(template, layoutRoot, siteData, path)

  return layoutRoot
}

export { applyLayout }

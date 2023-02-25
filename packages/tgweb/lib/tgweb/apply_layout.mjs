import { makeLocalFrontMatter } from "./make_local_front_matter.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { embedContent } from "./embed_content.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { embedComponents } from "./embed_components.mjs"

const applyLayout = (template, element, siteData, path) => {
  if (template.frontMatter["layout"] === undefined) return

  const layout =
    siteData.layouts.find(layout => layout.path == template.frontMatter["layout"] + ".html")

  if (layout === undefined) return

  const layoutRoot = layout.dom.window.document.body.cloneNode(true)

  const frontMatter = makeLocalFrontMatter(template, layout)
  expandClassAliases(frontMatter, layoutRoot)
  embedContent(layoutRoot, element)
  fillInPlaceHolders(layoutRoot, element, template)
  embedComponents(template, layoutRoot, siteData, path)

  return layoutRoot
}

export { applyLayout }

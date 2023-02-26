import { makeLocalFrontMatter } from "./make_local_front_matter.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { embedContent } from "./embed_content.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { embedComponents } from "./embed_components.mjs"

const applyWrapper = (template, templateRoot, wrapper, siteData, path) => {
  const frontMatter = makeLocalFrontMatter(template, wrapper)
  const wrapperRoot = wrapper.dom.window.document.body.cloneNode(true)
  expandClassAliases(frontMatter, wrapperRoot)
  embedContent(wrapperRoot, templateRoot)
  fillInPlaceHolders(wrapperRoot, templateRoot, template)
  embedComponents(template, wrapperRoot, siteData, path)
  return wrapperRoot
}

export { applyWrapper }

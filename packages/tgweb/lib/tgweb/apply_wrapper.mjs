import { makeLocalFrontMatter } from "./make_local_front_matter.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { embedContent } from "./embed_content.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"

const applyWrapper = (template, root, wrapper) => {
  const frontMatter = makeLocalFrontMatter(template, wrapper)
  const wrapperRoot = wrapper.dom.window.document.body.cloneNode(true)
  expandClassAliases(frontMatter, wrapperRoot)
  embedContent(wrapperRoot, root)
  fillInPlaceHolders(wrapperRoot, root, template)
  return wrapperRoot
}

export { applyWrapper }

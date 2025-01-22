import { mergeProperties } from "./merge_properties.mjs"

const getDocumentProperties = (mainTemplate, wrapper, layout, siteProperties) => {
  let documentProperties = mergeProperties({plugins: {}}, siteProperties)
  if (layout) documentProperties = mergeProperties(layout.frontMatter, documentProperties)
  if (wrapper) documentProperties = mergeProperties(wrapper.frontMatter, documentProperties)
  return mergeProperties(mainTemplate.frontMatter, documentProperties)
}

export { getDocumentProperties }

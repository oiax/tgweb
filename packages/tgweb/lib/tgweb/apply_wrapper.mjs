import { expandClassAliases } from "./expand_class_aliases.mjs"
import { embedContent } from "./embed_content.mjs"
import { fillInPlaceHolders } from "./fill_in_place_holders.mjs"
import { embedComponents } from "./embed_components.mjs"
import { mergeProperties } from "./merge_properties.mjs"

const applyWrapper = (template, templateRoot, wrapper, siteData, path) => {
  const wrapperRoot = wrapper.dom.window.document.body.cloneNode(true)
  const layoutName = template.frontMatter["layout"] || wrapper.frontMatter["layout"]

  if (template.type === "page") {
    if (layoutName) {
      expandClassAliases(wrapper.frontMatter, wrapperRoot)
      embedContent(wrapperRoot, templateRoot)

      const layout = siteData.layouts.find(layout => layout.path == layoutName + ".html")

      if (layout) {
        const properties =
          mergeProperties(
            mergeProperties(template.frontMatter, wrapper.frontMatter),
            layout.frontMatter
          )

        fillInPlaceHolders(wrapperRoot, templateRoot, properties)
        embedComponents(template, wrapperRoot, siteData, path)
        return wrapperRoot
      }
      else {
        const properties = mergeProperties(template.frontMatter, wrapper.frontMatter)

        fillInPlaceHolders(wrapperRoot, templateRoot, properties)
        embedComponents(template, wrapperRoot, siteData, path)
        return wrapperRoot

      }
    }
    else {
      expandClassAliases(wrapper.frontMatter, wrapperRoot)
      embedContent(wrapperRoot, templateRoot)
      fillInPlaceHolders(wrapperRoot, templateRoot, template.frontMatter)
      embedComponents(template, wrapperRoot, siteData, path)
      return wrapperRoot
    }
  }
  else {
    if (path.startsWith("src/articles/")) {
      expandClassAliases(wrapper.frontMatter, wrapperRoot)
      embedContent(wrapperRoot, templateRoot)

      if (layoutName) {
        const layout = siteData.layouts.find(layout => layout.path == layoutName + ".html")

        if (layout) {
          const properties =
            mergeProperties(
              mergeProperties(template.frontMatter, wrapper.frontMatter),
              layout.frontMatter
            )

          fillInPlaceHolders(wrapperRoot, templateRoot, properties)
        }
        else {
          const properties = mergeProperties(template.frontMatter, wrapper.frontMatter)

          fillInPlaceHolders(wrapperRoot, templateRoot, properties)
        }

        embedComponents(template, wrapperRoot, siteData, path)
        return wrapperRoot
      }
      else {
        expandClassAliases(wrapper.frontMatter, wrapperRoot)
        embedContent(wrapperRoot, templateRoot)
        fillInPlaceHolders(wrapperRoot, templateRoot, template.frontMatter)
        embedComponents(template, wrapperRoot, siteData, path)
        return wrapperRoot
      }
    }
    else {
      expandClassAliases(wrapper.frontMatter, wrapperRoot)
      embedContent(wrapperRoot, templateRoot)
      fillInPlaceHolders(wrapperRoot, templateRoot, template.frontMatter)
      embedComponents(template, wrapperRoot, siteData, path)
      return wrapperRoot
    }
  }
}

export { applyWrapper }

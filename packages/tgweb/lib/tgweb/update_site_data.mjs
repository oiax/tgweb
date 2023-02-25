import getType from "./get_type.mjs"
import { getSiteData } from "./get_site_data.mjs"
import { mergeProperties } from "./merge_properties.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { setDependencies } from "./set_dependencies.mjs"
import { setUrlProperty } from "./set_url_property.mjs"
import { expandPaths } from "./expand_paths.mjs"
import { getTemplate } from "./get_template.mjs"

const updateSiteData = (siteData, path) => {
  const type = getType(path)

  if (type == "site.yml") {
    const newSiteData = getSiteData(process.cwd())
    siteData.properties = newSiteData.properties
    siteData.pages = newSiteData.pages
    siteData.articles = newSiteData.articles
    siteData.components = newSiteData.components
    siteData.layouts = newSiteData.layouts
    siteData.wrappers = newSiteData.wrappers
  }
  else if (type == "component") {
    siteData.components.forEach(component => {
      if ("src/components/" + component.path == path) {
        updateTemplate(component, path)
        mergeProperties(component.frontMatter, siteData.properties)
      }
    })
  }
  else if (type == "layout") {
    siteData.layouts.forEach(layout => {
      if ("src/layouts/" + layout.path == path) {
        updateTemplate(layout, path)
        mergeProperties(layout.frontMatter, siteData.properties)
        setDependencies(layout, siteData)
      }
    })
  }
  else if (type == "article") {
    siteData.articles.forEach(article => {
      if ("src/articles/" + article.path == path) {
        updateTemplate(article, path)
        setUrlProperty(article.frontMatter, siteData, "articles/" + path)

        const wrapper = getWrapper(siteData, "articles/" + article.path)

        if (wrapper)
          mergeProperties(article.frontMatter, wrapper.frontMatter)
        else
          mergeProperties(article.frontMatter, siteData.properties)

        expandPaths(article.frontMatter)
        setDependencies(article, siteData)
      }
    })
  }
  else if (type == "page") {
    siteData.pages.forEach(page => {
      if ("src/pages/" + page.path == path) {
        updateTemplate(page, path)
        setUrlProperty(page.frontMatter, siteData, path)

        const wrapper = getWrapper(siteData, "pages/" + page.path)

        if (wrapper)
          mergeProperties(page.frontMatter, wrapper.frontMatter)
        else
          mergeProperties(page.frontMatter, siteData.properties)

        expandPaths(page.frontMatter)
        setDependencies(page, siteData)
      }
    })
  }
  else if (type == "wrapper") {
    siteData.wrappers.forEach(wrapper => {
      if ("src/" + wrapper.path == path) {
        updateTemplate(wrapper, path)
        mergeProperties(wrapper.frontMatter, siteData.properties)
        setDependencies(wrapper, siteData)
      }
    })
  }
}

const updateTemplate = (template, path) => {
  const newTemplate = getTemplate(path)
  template.frontMatter = newTemplate.frontMatter
  template.dom = newTemplate.dom
}

export { updateSiteData }

import * as PATH from "path"
import fs from "fs"
import getType from "./get_type.mjs"
import { getSiteData } from "./get_site_data.mjs"
import { setDependencies } from "./set_dependencies.mjs"
import { setUrlProperty } from "./set_url_property.mjs"
import { getTemplate } from "./get_template.mjs"
import { updateDependencies } from "./update_dependencies.mjs"

const updateSiteData = (siteData, path) => {
  let type = getType(path)

  if (type === "front_matter_file") {
    path = path.replace(/\.toml$/, ".html")

    if (!fs.existsSync(path)) return

    type = getType(path)
  }

  if (type === "site.toml") {
    const newSiteData = getSiteData(process.cwd())
    updateDependencies(newSiteData)
    siteData.properties = newSiteData.properties
    siteData.pages = newSiteData.pages
    siteData.segments = newSiteData.segments
    siteData.articles = newSiteData.articles
    siteData.components = newSiteData.components
    siteData.sharedComponents = newSiteData.sharedComponents
    siteData.layouts = newSiteData.layouts
    siteData.wrappers = newSiteData.wrappers
    siteData.sharedWrappers = newSiteData.sharedWrappers
  }
  else if (type === "component") {
    const component = siteData.components.find(c => `src/${c.path}` === path)

    if (component) {
      updateTemplate(component, path, "component", siteData.properties)
    }
    else {
      siteData.components.push(getTemplate(path, "component"))
    }
  }
  else if (type === "shared_component") {
    const component = siteData.sharedComponents.find(c => `src/${c.path}` === path)

    if (component) {
      updateTemplate(component, path, "shared_component", siteData.properties)
    }
    else {
      siteData.sharedComponents.push(getTemplate(path, "shared_component"))
    }
  }
  else if (type === "segment") {
    const segment = siteData.segments.find(s => `src/${s.path}` === path)

    if (segment) {
      updateTemplate(segment, path, "segment", siteData.properties)
    }
    else {
      siteData.segments.push(getTemplate(path, "segment"))
    }
  }
  else if (type === "layout") {
    const layout = siteData.layouts.find(l => `src/${l.path}` === path)

    if (layout) {
      updateTemplate(layout, path, "layout", siteData.properties)
      setDependencies(layout, siteData)
    }
    else {
      siteData.layouts.push(getTemplate(path, "layout"))
    }
  }
  else if (type === "article") {
    const article = siteData.articles.find(a => `src/${a.path}` === path)

    if (article) {
      updateTemplate(article, path, "article", siteData.properties)
      setUrlProperty(article.frontMatter, siteData, article.path)
    }
    else {
      const newArticle = getTemplate(path, "article", siteData.properties)

      setUrlProperty(newArticle.frontMatter, siteData, newArticle.path)
      siteData.articles.push(newArticle)
    }
  }
  else if (type === "page") {
    const page = siteData.pages.find(p => `src/${p.path}` === path)

    if (page) {
      updateTemplate(page, path, "page", siteData.properties)
      setUrlProperty(page.frontMatter, siteData, path)
      setDependencies(page, siteData)
    }
    else {
      siteData.pages.push(getTemplate(path, "page", siteData.properties))
    }
  }
  else if (type === "wrapper") {
    const wrapper = siteData.wrappers.find(w => `src/${w.path}` === path)

    if (wrapper) {
      updateTemplate(wrapper, path, "wrapper", siteData.properties)
      setDependencies(wrapper, siteData)
    }
    else {
      const wrapper = getTemplate(path, "wrapper")
      setDependencies(wrapper, siteData)
      siteData.wrappers.push(wrapper)

      const wrapperName = wrapper.path.replace(/\.html$/, "")

      if (wrapper.path.startsWith("pages/")) {
        siteData.pages.forEach(page => {
          if (page.path.includes("/")) {
            const dir = PATH.dirname(page.path)

            if (wrapper.path === `${dir}/_wrapper.html`) {
              replaceWrapper(page, wrapperName)
            }
          }
          else {
            if (wrapper.path === "pages/_wrapper.html") {
              replaceWrapper(page, wrapperName)
            }
          }
        })
      }
      else if (wrapper.path.startsWith("articles/")) {
        siteData.articles.forEach(article => {
          if (article.path.includes("/")) {
            const dir = PATH.dirname(article.path)

            if (wrapper.path === `${dir}/_wrapper.html`) {
              replaceWrapper(article, wrapperName)
            }
          }
          else {
            if (wrapper.path === "articles/_wrapper.html") {
              replaceWrapper(article, wrapperName)
            }
          }
        })
      }
    }
  }
  else if (type === "shared_wrapper") {
    siteData.wrappers.forEach(wrapper => {
      updateTemplate(wrapper, path, "wrapper", siteData.properties)
      setDependencies(wrapper, siteData)
    })
  }
}

const updateTemplate = (template, path, type, siteProperties) => {
  const newTemplate = getTemplate(path, type, siteProperties)
  template.frontMatter = newTemplate.frontMatter
  template.inserts = newTemplate.inserts
  template.dom = newTemplate.dom
}

const replaceWrapper = (template, wrapperName) => {
  template.dependencies = template.dependencies.filter(dep => dep.endsWith("/_wrapper.html"))
  template.dependencies.push(wrapperName)
}

export { updateSiteData }

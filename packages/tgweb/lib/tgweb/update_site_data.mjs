import * as PATH from "path"
import { dbg } from "./debugging.mjs"
import getType from "./get_type.mjs"
import { getSiteData } from "./get_site_data.mjs"
import { mergeProperties } from "./merge_properties.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { setDependencies } from "./set_dependencies.mjs"
import { setUrlProperty } from "./set_url_property.mjs"
import { expandPaths } from "./expand_paths.mjs"
import { getTemplate } from "./get_template.mjs"

if (dbg === undefined) dbg(undefined)

const updateSiteData = (siteData, path) => {
  const cwd = process.cwd()
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
    const component = siteData.components.find(c => "src/components/" + c.path == path)

    if (component) {
      siteData.components.forEach(component => {
        if ("src/components/" + component.path == path) {
          updateTemplate(component, path)
          mergeProperties(component.frontMatter, siteData.properties)
        }
      })
    }
    else {
      process.chdir("src/components")
      const shortPath = path.replace(/^src\/components\//, "")
      siteData.components.push(getTemplate(shortPath, "component"))
    }
  }
  else if (type == "layout") {
    const layout = siteData.layouts.find(l => "src/layouts/" + l.path == path)

    if (layout) {
      siteData.layouts.forEach(layout => {
        if ("src/layouts/" + layout.path == path) {
          updateTemplate(layout, path)
          mergeProperties(layout.frontMatter, siteData.properties)
          setDependencies(layout, siteData)
        }
      })
    }
    else {
      process.chdir("src/layouts")
      const shortPath = path.replace(/^src\/layouts\//, "")
      siteData.layouts.push(getTemplate(shortPath, "layout"))
    }
  }
  else if (type == "article") {
    const article = siteData.articles.find(a => "src/articles/" + a.path == path)

    if (article) {
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
    else {
      process.chdir("src/articles")
      const shortPath = path.replace(/^src\/articles\//, "")
      siteData.articles.push(getTemplate(shortPath, "article"))
    }
  }
  else if (type == "page") {
    const page = siteData.pages.find(p => "src/pages/" + p.path == path)

    if (page) {
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
    else {
      process.chdir("src/pages")
      const shortPath = path.replace(/^src\/pages\//, "")
      siteData.pages.push(getTemplate(shortPath, "page"))
    }
  }
  else if (type == "wrapper") {
    const wrapper = siteData.wrappers.find(w => "src/" + w.path == path)

    if (wrapper) {
      siteData.wrappers.forEach(wrapper => {
        if ("src/" + wrapper.path == path) {
          updateTemplate(wrapper, path)
          mergeProperties(wrapper.frontMatter, siteData.properties)
          setDependencies(wrapper, siteData)
        }
      })
    }
    else {
      process.chdir("src")
      const shortPath = path.replace(/^src\//, "")
      const wrapper = getTemplate(shortPath, "wrapper")
      mergeProperties(wrapper.frontMatter, siteData.properties)
      setDependencies(wrapper, siteData)
      siteData.wrappers.push(wrapper)

      const wrapperName = wrapper.path.replace(/\.html$/, "")

      if (wrapper.path.startsWith("pages/")) {
        siteData.pages.forEach(page => {
          if (page.path.includes("/")) {
            const dir = PATH.dirname(page.path)

            if (wrapper.path === PATH.join("pages", dir, "_wrapper.html")) {
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

            if (wrapper.path === PATH.join("articles", dir, "_wrapper.html")) {
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

  process.chdir(cwd)
}

const updateTemplate = (template, path) => {
  const newTemplate = getTemplate(path)
  template.frontMatter = newTemplate.frontMatter
  template.dom = newTemplate.dom
}

const replaceWrapper = (template, wrapperName) => {
  template.dependencies = template.dependencies.filter(dep => dep.endsWith("/_wrapper.html"))
  template.dependencies.push(wrapperName)
}

export { updateSiteData }

import * as PATH from "path"
import { slash } from "./slash.mjs"
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
  const posixPath = slash(path)

  if (type == "site.yml") {
    const newSiteData = getSiteData(process.cwd())
    siteData.properties = newSiteData.properties
    siteData.pages = newSiteData.pages
    siteData.segments = newSiteData.segments
    siteData.articles = newSiteData.articles
    siteData.components = newSiteData.components
    siteData.layouts = newSiteData.layouts
    siteData.wrappers = newSiteData.wrappers
  }
  else if (type === "component") {
    const component = siteData.components.find(c => "src/components/" + c.path === posixPath)

    if (component) {
      siteData.components.forEach(component => {
        if ("src/components/" + component.path === posixPath) {
          updateTemplate(component, path)
          component.frontMatter = mergeProperties(component.frontMatter, siteData.properties)
        }
      })
    }
    else {
      process.chdir("src/components")
      const shortPath = posixPath.replace(/^src\/components\//, "")
      siteData.components.push(getTemplate(shortPath, "component"))
    }
  }
  else if (type === "segment") {
    const segment = siteData.segments.find(s => "src/segments/" + s.path === posixPath)

    if (segment) {
      siteData.segments.forEach(segment => {
        if ("src/segments/" + segment.path === posixPath) {
          updateTemplate(segment, path)
          segment.frontMatter = mergeProperties(segment.frontMatter, siteData.properties)
        }
      })
    }
    else {
      process.chdir("src/segments")
      const shortPath = posixPath.replace(/^src\/segments\//, "")
      siteData.segments.push(getTemplate(shortPath, "segment"))
    }
  }
  else if (type === "layout") {
    const layout = siteData.layouts.find(l => "src/layouts/" + l.path === posixPath)

    if (layout) {
      siteData.layouts.forEach(layout => {
        if ("src/layouts/" + layout.path == posixPath) {
          updateTemplate(layout, path)
          layout.frontMatter = mergeProperties(layout.frontMatter, siteData.properties)
          setDependencies(layout, siteData)
        }
      })
    }
    else {
      process.chdir("src/layouts")
      const shortPath = posixPath.replace(/^src\/layouts\//, "")
      siteData.layouts.push(getTemplate(shortPath, "layout"))
    }
  }
  else if (type === "article") {
    const article = siteData.articles.find(a => "src/articles/" + a.path === posixPath)

    if (article) {
      siteData.articles.forEach(article => {
        if ("src/articles/" + article.path == posixPath) {
          updateTemplate(article, path)
          setUrlProperty(article.frontMatter, siteData, "articles/" + posixPath)

          const wrapper = getWrapper(siteData, "articles/" + article.path)

          if (wrapper)
            article.frontMatter = mergeProperties(article.frontMatter, wrapper.frontMatter)
          else
            article.frontMatter = mergeProperties(article.frontMatter, siteData.properties)

          expandPaths(article.frontMatter)
          setDependencies(article, siteData)
        }
      })
    }
    else {
      process.chdir("src/articles")
      const shortPath = posixPath.replace(/^src\/articles\//, "")
      const newArticle = getTemplate(shortPath, "article")

      setUrlProperty(newArticle.frontMatter, siteData, "articles/" + newArticle.path)

      const wrapper = getWrapper(siteData, "articles/" + newArticle.path)

      if (wrapper)
        newArticle.frontMatter = mergeProperties(newArticle.frontMatter, wrapper.frontMatter)
      else
        newArticle.frontMatter = mergeProperties(newArticle.frontMatter, siteData.properties)

      expandPaths(newArticle.frontMatter)
      setDependencies(newArticle, siteData)

      siteData.articles.push(newArticle)

      siteData.pages.forEach(p => setDependencies(p, siteData))

      siteData.articles.forEach(a => {
        if (a.path !== shortPath) setDependencies(a, siteData)
      })
    }
  }
  else if (type === "page") {
    const page = siteData.pages.find(p => "src/pages/" + p.path === posixPath)

    if (page) {
      siteData.pages.forEach(page => {
        if ("src/pages/" + page.path == posixPath) {
          updateTemplate(page, path)
          setUrlProperty(page.frontMatter, siteData, posixPath)

          const wrapper = getWrapper(siteData, "pages/" + page.path)

          if (wrapper)
            page.frontMatter = mergeProperties(page.frontMatter, wrapper.frontMatter)
          else
            page.frontMatter = mergeProperties(page.frontMatter, siteData.properties)

          expandPaths(page.frontMatter)
          setDependencies(page, siteData)
        }
      })
    }
    else {
      process.chdir("src/pages")
      const shortPath = posixPath.replace(/^src\/pages\//, "")
      siteData.pages.push(getTemplate(shortPath, "page"))
    }
  }
  else if (type === "wrapper") {
    const wrapper = siteData.wrappers.find(w => "src/" + w.path === posixPath)

    if (wrapper) {
      siteData.wrappers.forEach(wrapper => {
        if ("src/" + wrapper.path == posixPath) {
          updateTemplate(wrapper, path)
          wrapper.frontMatter = mergeProperties(wrapper.frontMatter, siteData.properties)
          setDependencies(wrapper, siteData)
        }
      })
    }
    else {
      process.chdir("src")
      const shortPath = posixPath.replace(/^src\//, "")
      const wrapper = getTemplate(shortPath, "wrapper")
      wrapper.frontMatter = mergeProperties(wrapper.frontMatter, siteData.properties)
      setDependencies(wrapper, siteData)
      siteData.wrappers.push(wrapper)

      const wrapperName = wrapper.path.replace(/\.html$/, "")

      if (wrapper.path.startsWith("pages/")) {
        siteData.pages.forEach(page => {
          if (page.path.includes("/")) {
            const dir = PATH.dirname(page.path)

            if (wrapper.path === slash(PATH.join("pages", dir, "_wrapper.html"))) {
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

            if (wrapper.path === slash(PATH.join("articles", dir, "_wrapper.html"))) {
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

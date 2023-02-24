import fs from "fs"
import YAML from "js-yaml"
import * as PATH from "path"
import glob from "glob"
import { JSDOM } from "jsdom"
import { fileURLToPath } from "url";
import { dirname } from "path";
import getType from "./get_type.mjs"
import getTag from "./get_tag.mjs"
import filterArticles from "./filter_articles.mjs"
import { setAttrs } from "./set_attrs.mjs"

const dbg = arg => console.log(arg)

// Prevent warnings when function d is not used.
if (dbg === undefined) { dbg() }

const getSiteData = directory => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const cwd = process.cwd()

  const siteData = {
    pages: [],
    layouts: [],
    wrappers: [],
    articles: [],
    components: [],
    properties: {
      scheme: "http",
      host: "localhost",
      port: 3000
    }
  }

  const htmlPath = PATH.resolve(__dirname, "../../resources/document_template.html")
  const documentTemplate = getTemplate(htmlPath, "document")
  siteData.documentTemplate = documentTemplate.dom

  const site_yaml_path = PATH.join(directory, "src", "site.yml")

  if (fs.existsSync(site_yaml_path)) {
    const source = fs.readFileSync(site_yaml_path)
    mergeProperties(siteData.properties, YAML.load(source))
    normalizeFrontMatter(siteData.properties)
  }

  process.chdir(directory + "/src")

  siteData.wrappers =
    glob.sync("@(pages|articles)/**/_wrapper.html").map(path => {
      const wrapper = getTemplate(path, "wrapper")
      mergeProperties(wrapper.frontMatter, siteData.properties)
      return wrapper
    })

  siteData.wrappers.map(wrapper => setDependencies(wrapper, siteData))

  if (fs.existsSync(directory + "/src/components")) {
    process.chdir(directory + "/src/components")
    siteData.components = glob.sync("*.html").map(path => getTemplate(path, "component"))
  }

  if (fs.existsSync(directory + "/src/layouts")) {
    process.chdir(directory + "/src/layouts")
    siteData.layouts = glob.sync("*.html").map(path => getTemplate(path, "layout"))
    siteData.layouts.map(layout => setDependencies(layout, siteData))
  }

  if (fs.existsSync(directory + "/src/articles")) {
    process.chdir(directory + "/src/articles")

    siteData.articles =
      glob.sync("**/!(_wrapper).html").map(path => {
        const article = getTemplate(path, "article")
        setUrlProperty(article.frontMatter, siteData, "articles/" + path)

        const wrapper = getWrapper(article, siteData)

        if (wrapper)
          mergeProperties(article.frontMatter, wrapper.frontMatter)
        else
          mergeProperties(article.frontMatter, siteData.properties)

        expandPaths(article.frontMatter)
        return article
      })

    siteData.articles.map(article => setDependencies(article, siteData))
  }

  if (fs.existsSync(directory + "/src/pages")) {
    process.chdir(directory + "/src/pages")

    siteData.pages =
      glob.sync("**/!(_wrapper).html").map(path => {
        const page = getTemplate(path, "page")
        setUrlProperty(page.frontMatter, siteData, path)

        const wrapper = getWrapper(page, siteData)

        if (wrapper)
          mergeProperties(page.frontMatter, wrapper.frontMatter)
        else
          mergeProperties(page.frontMatter, siteData.properties)

        expandPaths(page.frontMatter)
        return page
      })

    siteData.pages.map(page => setDependencies(page, siteData))
  }

  process.chdir(cwd)

  return siteData
}

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

        const wrapper = getWrapper(article, siteData)

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
        setUrlProperty(page.frontMatter, siteData, path)

        const wrapper = getWrapper(page, siteData)

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

const setDependencies = (object, siteData) => {
  const body = object.dom.window.document.body
  object.dependencies = []

  const componentRefs = body.querySelectorAll("tg-component")

  componentRefs.forEach(ref => {
    setAttrs(ref)
    const componentName = ref.attrs["name"]
    object.dependencies.push("components/" + componentName)
  })

  const articleRefs = body.querySelectorAll("tg-article")

  articleRefs.forEach(ref => {
    setAttrs(ref)
    const articleName = ref.attrs["name"]
    object.dependencies.push("articles/" + articleName)
  })

  const articleListRefs = body.querySelectorAll("tg-articles")

  articleListRefs.forEach(ref => {
    setAttrs(ref)
    const pattern = ref.attrs["pattern"]
    const tag = getTag(ref)
    const articles = filterArticles(siteData.articles, pattern, tag)

    articles.forEach(article => {
      const articleName = "articles/" + article.path.replace(/\.html$/, "")
      object.dependencies.push(articleName)
    })
  })

  const linkListRefs = body.querySelectorAll("tg-links")

  linkListRefs.forEach(ref => {
    setAttrs(ref)
    const pattern = ref.attrs["pattern"]
    const tag = getTag(ref)
    const articles = filterArticles(siteData.articles, pattern, tag)

    articles.forEach(article => {
      const articleName = "articles/" + article.path.replace(/\.html$/, "")
      object.dependencies.push(articleName)
    })
  })

  const layoutName = object.frontMatter["layout"]

  if (layoutName) {
    object.dependencies.push("layouts/" + layoutName)

    const layout = siteData.layouts.find(layout => layout.path === layoutName + ".html")
    if (layout) layout.dependencies.forEach(dep => object.dependencies.push(dep))
  }

  if (object.type === "page" || object.type === "article") {
    const wrapper = getWrapper(object, siteData)

    if (wrapper) {
      object.dependencies.push(wrapper.path.replace(/\.html$/, ""))

      wrapper.dependencies.forEach(dep => {
        if (! object.dependencies.includes(dep)) object.dependencies.push(dep)
      })
    }
  }
}

const getWrapper = (template, siteData) => {
  const parts = template.path.split(PATH.sep)
  parts.pop()

  for(let i = parts.length; i >= 0; i--) {
    const dir = parts.slice(i).join(PATH.sep)
    const parentDir = template.type === "page" ? "pages" : "articles"
    const wrapperPath = PATH.join(parentDir, dir, "_wrapper.html")
    const wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)
    if (wrapper) return wrapper
  }
}

const separatorRegex = new RegExp("^---\\n", "m")

const getTemplate = (path, type) => {
  const source = fs.readFileSync(path)
  const parts = source.toString().split(separatorRegex)

  if (parts[0] === "" && parts[1] !== undefined) {
    const frontMatter = YAML.load(parts[1])
    normalizeFrontMatter(frontMatter)
    const html = parts.slice(2).join("---\n")
    const dom = new JSDOM(html)

    return { path, type, frontMatter, dom }
  }
  else {
    const frontMatter = {}
    const dom = new JSDOM(source.toString())

    return { path, frontMatter, dom }
  }
}

const updateTemplate = (template, path) => {
  const newTemplate = getTemplate(path)
  template.frontMatter = newTemplate.frontMatter
  template.dom = newTemplate.dom
}

const mergeProperties = (target, source) => {
  Object.keys(source).forEach(key => {
    if (!Object.hasOwn(target, key)) target[key] = source[key]
  })
}

const normalizeFrontMatter = frontMatter => {
  Object.keys(frontMatter).forEach(key => {
    if (key.startsWith("class-")) {
      const value = frontMatter[key]

      if (Array.isArray(value)) {
        frontMatter[key] = value.join(" ")
      }
    }
  })
}

const setUrlProperty = (frontMatter, siteData, path) => {
  const scheme = siteData.properties["scheme"]
  const host = siteData.properties["host"]
  const port = siteData.properties["port"]

  let converted = path
  if (path === "index.html") converted = ""
  converted = converted.replace(/\/index.html$/, "/")

  if (scheme === "http") {
    if (port === 80) {
      frontMatter.url = `http://${host}/${converted}`
    }
    else {
      frontMatter.url = `http://${host}:${port}/${converted}`
    }
  }
  else if (scheme === "https") {
    if (port === 443) {
      frontMatter.url = `https://${host}/${converted}`
    }
    else {
      frontMatter.url = `https://${host}:${port}/${converted}`
    }
  }
}

const expandPaths = frontMatter => {
  Object.keys(frontMatter).forEach(key => {
    const value = frontMatter[key]

    if (typeof value === "string") {
      const converted = value.replaceAll(/%\{([^}]+)\}/g, (_, path) =>
        getUrlPrefix(frontMatter) + path
      )

      frontMatter[key] = converted
    }
  })
}

const getUrlPrefix = (frontMatter) => {
  const scheme = frontMatter["scheme"]
  const host = frontMatter["host"]
  const port = frontMatter["port"]

  if (scheme === "http") {
    if (port === 80) {
      return `http://${host}`
    }
    else {
      return `http://${host}:${port}`
    }
  }
  else if (scheme === "https") {
    if (port === 443) {
      return `https://${host}`
    }
    else {
      return `https://${host}:${port}`
    }
  }
}

export { getSiteData, updateSiteData }

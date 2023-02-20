import fs from "fs"
import YAML from "js-yaml"
import * as PATH from "path"
import glob from "glob"
import { JSDOM } from "jsdom"
import { fileURLToPath } from "url";
import { dirname } from "path";
import getType from "./get_type.mjs"
import { setAttrs } from "./set_attrs.mjs"

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
  const documentTemplate = getDom(htmlPath)
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
      const wrapper = getDom(path)
      mergeProperties(wrapper.frontMatter, siteData.properties)
      return wrapper
    })

  siteData.wrappers.map(wrapper => setDependencies(wrapper, siteData))

  if (fs.existsSync(directory + "/src/components")) {
    process.chdir(directory + "/src/components")
    siteData.components = glob.sync("*.html").map(getDom)
  }

  if (fs.existsSync(directory + "/src/layouts")) {
    process.chdir(directory + "/src/layouts")
    siteData.layouts = glob.sync("*.html").map(getDom)
    siteData.layouts.map(layout => setDependencies(layout, siteData))
  }

  if (fs.existsSync(directory + "/src/articles")) {
    process.chdir(directory + "/src/articles")

    siteData.articles =
      glob.sync("**/!(_wrapper).html").map(path => {
        const article = getDom(path)
        setUrlProperty(article.frontMatter, siteData, "articles/" + path)

        const wrapper = getArticleWrapper(article, siteData)

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
        const page = getDom(path)
        setUrlProperty(page.frontMatter, siteData, path)

        const wrapper = getPageWrapper(page, siteData)

        if (wrapper)
          mergeProperties(page.frontMatter, wrapper.frontMatter)
        else
          mergeProperties(page.frontMatter, siteData.properties)

        expandPaths(page.frontMatter)
        return page
      })

    siteData.pages.map(page => setDependencies(page, siteData))
  }

  addPageWrapperDepdencies(siteData)
  addArticleWrapperDepdencies(siteData)

  process.chdir(cwd)

  return siteData
}

const updateSiteData = (siteData, path) => {
  const type = getType(path)

  if (type == "component") {
    siteData.components.forEach(component => {
      if ("src/components/" + component.path == path) {
        const html = fs.readFileSync(path)
        component.dom = new JSDOM(html)
      }
    })
  }
  else if (type == "layout") {
    siteData.layouts.forEach(layout => {
      if ("src/layouts/" + layout.path == path) {
        const html = fs.readFileSync(path)
        layout.dom = new JSDOM(html)
      }
    })
  }
  else if (type == "article") {
    siteData.articles.forEach(article => {
      if ("src/articles/" + article.path == path) {
        const html = fs.readFileSync(path)
        article.dom = new JSDOM(html)
      }
    })
  }
  else if (type == "page") {
    siteData.pages.forEach(page => {
      if ("src/pages/" + page.path == path) {
        const html = fs.readFileSync(path)
        page.dom = new JSDOM(html)
      }
    })
  }
  else if (type == "wrapper") {
    siteData.wrappers.forEach(wrapper => {
      if ("src/" + wrapper.path == path) {
        const html = fs.readFileSync(path)
        wrapper.dom = new JSDOM(html)
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

  const layoutName = object.frontMatter["layout"]

  if (layoutName) {
    object.dependencies.push("layouts/" + layoutName)

    const layout = siteData.layouts.find(layout => layout.path == layoutName + ".html")
    if (layout) layout.dependencies.forEach(dep => object.dependencies.push(dep))
  }
}

const addPageWrapperDepdencies = siteData => {
  const pages =
    siteData.pages.map(page => {
      const wrapper = getPageWrapper(page, siteData)

      if (wrapper) {
        page.dependencies.push(wrapper.path.replace(/\.html$/, ""))

        wrapper.dependencies.forEach(dep => {
          if (! page.dependencies.includes(dep)) page.dependencies.push(dep)
        })
      }

      return page
    })

  siteData.pages = pages
}

const addArticleWrapperDepdencies = siteData => {
  const articles =
    siteData.articles.map(article => {
      const wrapper = getArticleWrapper(article, siteData)

      if (wrapper) {
        article.dependencies.push(wrapper.path.replace(/\.html$/, ""))

        wrapper.dependencies.forEach(dep => {
          if (! article.dependencies.includes(dep)) article.dependencies.push(dep)
        })
      }

      return article
    })

  siteData.articles = articles
}

const getPageWrapper = (page, siteData) => {
  const parts = page.path.split(PATH.sep)
  parts.pop()

  for(let i = parts.length; i >= 0; i--) {
    const dir = parts.slice(i).join(PATH.sep)
    const wrapperPath = PATH.join("pages", dir, "_wrapper.html")
    const wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)
    if (wrapper) return wrapper
  }
}

const getArticleWrapper = (article, siteData) => {
  const parts = article.path.split(PATH.sep)
  parts.pop()

  for(let i = parts.length; i >= 0; i--) {
    const dir = parts.slice(i).join(PATH.sep)
    const wrapperPath = PATH.join("articles", dir, "_wrapper.html")
    const wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)
    if (wrapper) return wrapper
  }
}

const separatorRegex = new RegExp("^---\\n", "m")

const getDom = path => {
  const source = fs.readFileSync(path)
  const parts = source.toString().split(separatorRegex)

  if (parts[0] === "" && parts[1] !== undefined) {
    const frontMatter = YAML.load(parts[1])
    normalizeFrontMatter(frontMatter)
    const html = parts.slice(2).join("---\n")
    const dom = new JSDOM(html)

    return { path, frontMatter, dom }
  }
  else {
    const frontMatter = {}
    const dom = new JSDOM(source)

    return { path, frontMatter, dom }
  }
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

import fs from "fs"
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
    components: []
  }

  const htmlPath = PATH.resolve(__dirname, "../../resources/document_template.html")
  const documentTemplate = getDom(htmlPath)
  siteData.documentTemplate = documentTemplate.dom

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
    siteData.articles = glob.sync("**/!(_wrapper).html").map(getDom)
    siteData.articles.map(article => setDependencies(article, siteData))
  }

  if (fs.existsSync(directory + "/src/pages")) {
    process.chdir(directory + "/src/pages")
    siteData.pages = glob.sync("**/!(_wrapper).html").map(getDom)
    siteData.pages.map(page => setDependencies(page, siteData))
  }

  process.chdir(directory + "/src")
  siteData.wrappers = glob.sync("@(pages|articles)/**/_wrapper.html").map(getDom)

  addWrapperDepdencies(siteData)

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
  const componentRefs = body.querySelectorAll("tg-component")
  const layoutRef = body.querySelector("[layout]")

  object.dependencies = []

  componentRefs.forEach(ref => {
    setAttrs(ref)
    const componentName = ref.attrs["name"]
    object.dependencies.push("components/" + componentName)
  })

  if (layoutRef) {
    setAttrs(layoutRef)
    const layoutName = layoutRef.attrs["layout"]
    object.dependencies.push("layouts/" + layoutName)

    const layout = siteData.layouts.find(layout => layout.path == layoutName + ".html")
    if (layout) layout.dependencies.forEach(dep => object.dependencies.push(dep))
  }
}

const addWrapperDepdencies = siteData => {
  const pages =
    siteData.pages.map(page => {
      const parts = page.path.split(PATH.sep)
      parts.pop()

      for(let i = parts.length; i >= 0; i--) {
        const dir = parts.slice(i).join(PATH.sep)
        const wrapperPath = PATH.join("pages", dir, "_wrapper.html")
        const wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)

        if (wrapper) {
          page.dependencies.push(PATH.join("pages", dir, "_wrapper"))

          const wrapperRoot = wrapper.dom.window.document.body.childNodes[0]
          setAttrs(wrapperRoot)
          const layoutName = wrapperRoot.attrs["layout"]

          if (layoutName) {
            const layout = siteData.layouts.find(layout => layout.path === `${layoutName}.html`)

            if (layout) {
              page.dependencies.push(PATH.join("layouts", layoutName))
              layout.dependencies.forEach(dep => page.dependencies.push(dep))
            }
          }

          break
        }
      }

      return page
    })

  siteData.pages = pages
}

const getDom = path => {
  const html = fs.readFileSync(path)
  const dom = new JSDOM(html)

  return { path, dom }
}

export { getSiteData, updateSiteData }

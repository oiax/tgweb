import fs from "fs"
import * as PATH from "path"
import glob from "glob"
import { JSDOM } from "jsdom"
import { fileURLToPath } from "url";
import { dirname } from "path";
import getType from "./get_type.mjs"

const getSiteData = function(directory) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const siteData = {
    pages: [],
    layouts: [],
    articles: [],
    components: []
  }

  const htmlPath = PATH.resolve(__dirname, "../../resources/document_template.html")
  const documentTemplate = getDom(htmlPath)
  siteData.documentTemplate = documentTemplate.dom

  if (fs.existsSync(directory + "/src/components")) {
    siteData.components = glob.sync(directory + "/src/components/*.html").map(getDom)
  }

  if (fs.existsSync(directory + "/src/layouts")) {
    siteData.layouts = glob.sync(directory + "/src/layouts/*.html").map(getDom)
    siteData.layouts.map(layout => setDependencies(layout, siteData))
  }

  if (fs.existsSync(directory + "/src/articles")) {
    siteData.articles = glob.sync(directory + "/src/articles/*.html").map(getDom)
    siteData.articles.map(article => setDependencies(article, siteData))
  }

  if (fs.existsSync(directory + "/src")) {
    siteData.pages = glob.sync(directory + "/src/*.html").map(getDom)
    siteData.pages.map(page => setDependencies(page, siteData))
  }

  return siteData
}

const updateSiteData = function(siteData, path) {
  const type = getType(PATH.dirname(path))
  const filename = PATH.basename(path)

  if (type == "component") {
    siteData.components.forEach(component => {
      if (component.filename == filename) {
        const html = fs.readFileSync(path)
        component.dom = new JSDOM(html)
      }
    })
  }
  else if (type == "layout") {
    siteData.layouts.forEach(layout => {
      if (layout.filename == filename) {
        const html = fs.readFileSync(path)
        layout.dom = new JSDOM(html)
      }
    })
  }
  else if (type == "article") {
    siteData.articles.forEach(article => {
      if (article.filename == filename) {
        const html = fs.readFileSync(path)
        article.dom = new JSDOM(html)
      }
    })
  }
  else if (type == "page") {
    siteData.pages.forEach(page => {
      if (page.filename == filename) {
        const html = fs.readFileSync(path)
        page.dom = new JSDOM(html)
      }
    })
  }
}

const setDependencies = function(object, siteData) {
  const body = object.dom.window.document.body
  const componentRefs = body.querySelectorAll("[tg-component]")
  const layoutRef = body.querySelector("[tg-layout]")

  object.dependencies = []

  componentRefs.forEach(ref => {
    const componentName = ref.getAttribute("tg-component")
    object.dependencies.push("components/" + componentName)
  })

  if (layoutRef) {
    const layoutName = layoutRef.getAttribute("tg-layout")
    object.dependencies.push("layouts/" + layoutName)

    const layout = siteData.layouts.find(layout => layout.filename == layoutName + ".html")
    if (layout) layout.dependencies.forEach(dep => object.dependencies.push(dep))
  }
}

const getDom = function(path) {
  const filename = PATH.basename(path)
  const html = fs.readFileSync(path)
  const dom = new JSDOM(html)

  return { filename, dom }
}

export { getSiteData, updateSiteData }

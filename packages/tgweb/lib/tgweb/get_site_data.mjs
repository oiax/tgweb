import fs from "fs"
import YAML from "js-yaml"
import * as PATH from "path"
import glob from "glob"
import { fileURLToPath } from "url";
import { dirname } from "path";
import { getTemplate } from "./get_template.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { normalizeFrontMatter } from "./normalize_front_matter.mjs"
import { mergeProperties } from "./merge_properties.mjs"
import { setUrlProperty } from "./set_url_property.mjs"
import { setDependencies } from "./set_dependencies.mjs"
import { expandPaths } from "./expand_paths.mjs"

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

  process.chdir(PATH.join(directory, "/src"))

  siteData.wrappers =
    glob.sync("@(pages|articles)/**/_wrapper.html").map(path => {
      const wrapper = getTemplate(path, "wrapper")
      mergeProperties(wrapper.frontMatter, siteData.properties)
      return wrapper
    })

  siteData.wrappers.map(wrapper => setDependencies(wrapper, siteData))

  const componentsDir = PATH.join(directory, "src", "components")

  if (fs.existsSync(componentsDir)) {
    process.chdir(componentsDir)
    siteData.components = glob.sync("*.html").map(path => getTemplate(path, "component"))
  }

  const layoutsDir = PATH.join(directory, "src", "layouts")

  if (fs.existsSync(layoutsDir)) {
    process.chdir(layoutsDir)
    siteData.layouts = glob.sync("*.html").map(path => getTemplate(path, "layout"))
    siteData.layouts.map(layout => setDependencies(layout, siteData))
  }

  const articlesDir = PATH.join(directory, "src", "articles")

  if (fs.existsSync(articlesDir)) {
    process.chdir(articlesDir)

    siteData.articles =
      glob.sync("**/!(_wrapper).html").map(path => {
        const article = getTemplate(path, "article")
        setUrlProperty(article.frontMatter, siteData, "articles/" + path)

        const wrapper = getWrapper(siteData, "articles/" + path)

        if (wrapper)
          mergeProperties(article.frontMatter, wrapper.frontMatter)
        else
          mergeProperties(article.frontMatter, siteData.properties)

        expandPaths(article.frontMatter)
        return article
      })

    siteData.articles.map(article => setDependencies(article, siteData))
  }

  const pagesDir = PATH.join(directory, "src", "pages")

  if (fs.existsSync(pagesDir)) {
    process.chdir(pagesDir)

    siteData.pages =
      glob.sync("**/!(_wrapper).html").map(path => {
        const page = getTemplate(path, "page")
        setUrlProperty(page.frontMatter, siteData, path)

        const wrapper = getWrapper(siteData, "pages/" + path)

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

export { getSiteData }

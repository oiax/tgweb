import fs from "fs"
import YAML from "js-yaml"
import * as PATH from "path"
import glob from "glob"
import { fileURLToPath } from "url";
import { dirname } from "path";
import { getTemplate } from "./get_template.mjs"
import { normalizeFrontMatter } from "./normalize_front_matter.mjs"
import { mergeProperties } from "./merge_properties.mjs"
import { setUrlProperty } from "./set_url_property.mjs"
import { setDependencies } from "./set_dependencies.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { JSDOM } from "jsdom"

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
    segments: [],
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
  const source = fs.readFileSync(htmlPath).toString().replaceAll(/\r/g, "")
  siteData.documentTemplate = new JSDOM(source)

  const site_yaml_path = PATH.join(directory, "src", "site.yml")

  if (fs.existsSync(site_yaml_path)) {
    const source = fs.readFileSync(site_yaml_path)
    siteData.properties = mergeProperties(siteData.properties, YAML.load(source))
    normalizeFrontMatter(siteData.properties)
  }

  const componentsDir = PATH.join(directory, "src", "components")

  if (fs.existsSync(componentsDir)) {
    process.chdir(componentsDir)
    siteData.components = glob.sync("**/*.html").map(path =>
      getTemplate(path, "component", siteData.properties)
    )
  }

  const segmentsDir = PATH.join(directory, "src", "segments")

  if (fs.existsSync(segmentsDir)) {
    process.chdir(segmentsDir)
    siteData.segments = glob.sync("**/*.html").map(path => {
      const segment = getTemplate(path, "segment", siteData.properties)
      segment.frontMatter = mergeProperties(segment.frontMatter, siteData.properties)
      return segment
    })
  }

  const layoutsDir = PATH.join(directory, "src", "layouts")

  if (fs.existsSync(layoutsDir)) {
    process.chdir(layoutsDir)

    siteData.layouts = glob.sync("**/*.html").map(path => {
      const layout = getTemplate(path, "layout", siteData.properties)
      layout.frontMatter = mergeProperties(layout.frontMatter, siteData.properties)
      return layout
    })
    siteData.layouts.map(layout => setDependencies(layout, siteData))
  }

  process.chdir(PATH.join(directory, "/src"))

  siteData.wrappers =
    glob.sync("@(pages|articles)/**/_wrapper.html").map(path =>
      getTemplate(path, "wrapper", siteData.properties)
    )

  siteData.wrappers.map(wrapper => setDependencies(wrapper, siteData))

  const articlesDir = PATH.join(directory, "src", "articles")

  if (fs.existsSync(articlesDir)) {
    process.chdir(articlesDir)

    siteData.articles =
      glob.sync("**/!(_wrapper).html").map(path => {
        const wrapper = getWrapper(siteData, "articles/" + path)

        if (wrapper) {
          const frontMatter = mergeProperties(wrapper.frontMatter, siteData.properties)
          const article = getTemplate(path, "article", frontMatter)
          setUrlProperty(article.frontMatter, siteData, "articles/" + path)
          return article
        }
        else {
          const article = getTemplate(path, "article", siteData.properties)
          setUrlProperty(article.frontMatter, siteData, "articles/" + path)
          return article
        }
      })

    siteData.articles.map(article => setDependencies(article, siteData))
  }

  const pagesDir = PATH.join(directory, "src", "pages")

  if (fs.existsSync(pagesDir)) {
    process.chdir(pagesDir)

    siteData.pages =
      glob.sync("**/!(_wrapper).html").map(path => {
        const wrapper = getWrapper(siteData, "pages/" + path)

        if (wrapper) {
          const frontMatter = mergeProperties(wrapper.frontMatter, siteData.properties)
          const page = getTemplate(path, "page", frontMatter)
          setUrlProperty(page.frontMatter, siteData, path)
          return page
        }
        else {
          const page = getTemplate(path, "page", siteData.properties)
          setUrlProperty(page.frontMatter, siteData, path)
          return page
        }
      })

    siteData.pages.map(page => setDependencies(page, siteData))
  }

  process.chdir(cwd)

  return siteData
}

export { getSiteData }

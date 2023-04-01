import fs from "fs"
import YAML from "js-yaml"
import * as PATH from "path"
import glob from "glob"
import { getTemplate } from "./get_template.mjs"
import { normalizeFrontMatter } from "./normalize_front_matter.mjs"
import { mergeProperties } from "./merge_properties.mjs"

const dbg = arg => console.log(arg)

// Prevent warnings when function d is not used.
if (dbg === undefined) { dbg() }

const getSiteData = directory => {
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

  const site_yaml_path = PATH.join(directory, "src", "site.yml")

  if (fs.existsSync(site_yaml_path)) {
    const source = fs.readFileSync(site_yaml_path)
    siteData.properties = mergeProperties(siteData.properties, YAML.load(source))
    normalizeFrontMatter(siteData.properties)
  }

  process.chdir(directory + "/src")

  const componentsDir = PATH.join(directory, "src", "components")

  if (fs.existsSync(componentsDir)) {
    siteData.components =
      glob.sync("components/**/*.html").map(path => getTemplate(path, "component"))
  }

  siteData.wrappers =
    glob.sync("@(pages|articles)/**/_wrapper.html").map(path => getTemplate(path, "wrapper"))

  const articlesDir = PATH.join(directory, "src", "articles")

  if (fs.existsSync(articlesDir)) {
    siteData.articles =
      glob.sync("articles/**/!(_wrapper).html").map(path => getTemplate(path, "article"))
  }

  const segmentsDir = PATH.join(directory, "src", "segments")

  if (fs.existsSync(segmentsDir)) {
    siteData.segments = glob.sync("segments/**/*.html").map(path =>
      getTemplate(path, "segment")
    )
  }

  const layoutsDir = PATH.join(directory, "src", "layouts")

  if (fs.existsSync(layoutsDir)) {
    siteData.layouts = glob.sync("layouts/**/*.html").map(path => getTemplate(path, "layout"))
  }

  const pagesDir = PATH.join(directory, "src", "pages")

  if (fs.existsSync(pagesDir)) {
    siteData.pages =
      glob.sync("pages/**/!(_wrapper).html").map(path => getTemplate(path, "page"))
  }

  process.chdir(cwd)

  return siteData
}

export { getSiteData }

import fs from "fs"
import YAML from "js-yaml"
import glob from "glob"
import { getTemplate } from "./get_template.mjs"
import { normalizeFrontMatter } from "./normalize_front_matter.mjs"
import { mergeProperties } from "./merge_properties.mjs"

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

  process.chdir(directory)

  const site_yaml_path = "src/site.yml"

  if (fs.existsSync(site_yaml_path)) {
    const source = fs.readFileSync(site_yaml_path)
    siteData.properties = mergeProperties(siteData.properties, YAML.load(source))
    normalizeFrontMatter(siteData.properties)
  }

  if (fs.existsSync("src/components")) {
    siteData.components =
      glob.sync("src/components/**/*.html").map(path => getTemplate(path, "component"))
  }

  siteData.wrappers =
    glob.sync("src/@(pages|articles)/**/_wrapper.html").map(path => getTemplate(path, "wrapper"))

  if (fs.existsSync("src/articles")) {
    siteData.articles =
      glob.sync("src/articles/**/!(_wrapper).html").map(path => getTemplate(path, "article"))
  }

  if (fs.existsSync("src/segments")) {
    siteData.segments = glob.sync("src/segments/**/*.html").map(path =>
      getTemplate(path, "segment")
    )
  }

  if (fs.existsSync("src/layouts")) {
    siteData.layouts = glob.sync("src/layouts/**/*.html").map(path => getTemplate(path, "layout"))
  }

  if (fs.existsSync("src/pages")) {
    siteData.pages =
      glob.sync("src/pages/**/!(_wrapper).html").map(path => getTemplate(path, "page"))
  }

  process.chdir(cwd)

  return siteData
}

export { getSiteData }

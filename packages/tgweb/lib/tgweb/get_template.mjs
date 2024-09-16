import fs from "fs"
import TOML from "@ltd/j-toml"
import { parseDocument } from "htmlparser2"
import { expandClassAliases } from "./expand_class_aliases.mjs"
import { showTomlSytaxError } from "./show_toml_syntax_error.mjs"
import { normalizeFrontMatter } from "./normalize_front_matter.mjs"

const separatorRegex = new RegExp("^---\\n", "m")

const getTemplate = (path, type, siteProperties) => {
  const tomlPath = path.replace(/\.html$/, ".toml")
  let frontMatter

  if (fs.existsSync(tomlPath)) {
    const tomlData = fs.readFileSync(tomlPath)

    try {
      frontMatter = TOML.parse(tomlData, {joiner: "\n", bigint: false})
      normalizeFrontMatter(frontMatter)
    }
    catch (error) {
      showTomlSytaxError(tomlPath, tomlData, error)
      frontMatter = normalizeFrontMatter({})
    }
  }

  const source = fs.readFileSync(path).toString().replaceAll(/\r/g, "")
  const parts = source.split(separatorRegex)

  if (frontMatter == undefined && parts[0] === "" && parts[1] !== undefined) {
    try {
      frontMatter = TOML.parse(parts[1], {joiner: "\n", bigint: false})
      normalizeFrontMatter(frontMatter)
    }
    catch (error) {
      showTomlSytaxError(path, parts[1], error)
      frontMatter = normalizeFrontMatter({})
    }

    const html = parts.slice(2).join("---\n")
    return createTemplate(path, type, html, frontMatter, siteProperties)
  }
  else {
    frontMatter = frontMatter || normalizeFrontMatter({})
    return createTemplate(path, type, source, frontMatter, siteProperties)
  }
}

const createTemplate = (path, type, html, frontMatter, siteProperties) => {
  const dom = parseDocument(html)
  dom.children.forEach(child => expandClassAliases(child, frontMatter))
  const inserts = extractInserts(dom)
  const shortPath = path.replace(/^src\//, "")

  if (type === "page" || type === "article" && frontMatter.main["embedded-only"] !== true) {
    const canonicalPath =
      shortPath.replace(/^pages\//, "").replace(/\/index.html$/, "/").replace(/^index.html$/, "")

    frontMatter.main.url = siteProperties.main["root-url"] + canonicalPath
  }

  return { path: shortPath, type, frontMatter, dom, inserts, dependencies: [] }
}

const extractInserts = (dom) => {
  const inserts = {}

  dom.children
    .filter(child => child.constructor.name === "Element" && child.name === "tg:insert")
    .forEach(child => {
      const name = child.attribs.name

      if (name) inserts[name] = child
    })

  dom.children =
    dom.children.filter(child =>
      child.constructor.name !== "Element" || child.name !== "tg:insert"
    )

  return inserts
}

export { getTemplate }

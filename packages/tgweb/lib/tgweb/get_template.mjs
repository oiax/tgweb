import fs from "fs"
import YAML from "js-yaml"
import { parseDocument } from "htmlparser2"
import { normalizeFrontMatter } from "./normalize_front_matter.mjs"
import { expandClassAliases } from "./expand_class_aliases.mjs"

const separatorRegex = new RegExp("^---\\n", "m")

const getTemplate = (path, type) => {
  const source = fs.readFileSync(path).toString().replaceAll(/\r/g, "")
  const parts = source.split(separatorRegex)

  if (parts[0] === "" && parts[1] !== undefined) {
    const frontMatter = YAML.load(parts[1])
    normalizeFrontMatter(frontMatter)
    const html = parts.slice(2).join("---\n")
    const dom = parseDocument(html)
    dom.children.forEach(child => expandClassAliases(child, frontMatter))
    const inserts = extractInserts(dom)

    return { path, type, frontMatter, dom, inserts, dependencies: [] }
  }
  else {
    const frontMatter = {}
    const dom = parseDocument(source)
    const inserts = extractInserts(dom)

    return { path, type, frontMatter, dom, inserts, dependencies: [] }
  }
}

const extractInserts = (dom) => {
  const inserts = {}

  dom.children
    .filter(child => child.constructor.name === "Element" && child.name === "tg-insert")
    .forEach(child => {
      const name = child.attribs.name

      if (name) inserts[name] = child
    })

  dom.children =
    dom.children.filter(child =>
      child.constructor.name !== "Element" || child.name !== "tg-insert"
    )

  return inserts
}

export { getTemplate }

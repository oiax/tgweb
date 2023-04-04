import fs from "fs"
import toml from "toml"
import { parseDocument } from "htmlparser2"
import { expandClassAliases } from "./expand_class_aliases.mjs"

const separatorRegex = new RegExp("^---\\n", "m")

const getTemplate = (path, type) => {
  const source = fs.readFileSync(path).toString().replaceAll(/\r/g, "")
  const parts = source.split(separatorRegex)

  if (parts[0] === "" && parts[1] !== undefined) {
    try {
      const frontMatter = toml.parse(parts[1])
      const html = parts.slice(2).join("---\n")
      return createTemplate(path, type, html, frontMatter)
    }
    catch (error) {
      console.error(`Could not parse the front matter: ${path}`)
      console.error(error)

      const frontMatter = {}
      const html = parts.slice(2).join("---\n")
      return createTemplate(path, type, html, frontMatter)
    }
  }
  else {
    return createTemplate(path, type, source, {})
  }
}

const createTemplate = (path, type, html, frontMatter) => {
  const dom = parseDocument(html)
  dom.children.forEach(child => expandClassAliases(child, frontMatter))
  const inserts = extractInserts(dom)
  const shortPath = path.replace(/^src\//, "")

  return { path: shortPath, type, frontMatter, dom, inserts, dependencies: [] }
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

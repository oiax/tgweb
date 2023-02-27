import fs from "fs"
import YAML from "js-yaml"
import { JSDOM } from "jsdom"
import { normalizeFrontMatter } from "./normalize_front_matter.mjs"

const separatorRegex = new RegExp("^---\\n", "m")

const getTemplate = (path, type) => {
  const source = fs.readFileSync(path)
  const parts = source.toString().split(separatorRegex)

  if (parts[0] === "" && parts[1] !== undefined) {
    const frontMatter = YAML.load(parts[1])
    normalizeFrontMatter(frontMatter)
    const html = parts.slice(2).join("---\n")
    const dom = new JSDOM(html)

    return { path, type, frontMatter, dom }
  }
  else {
    const frontMatter = {}
    const dom = new JSDOM(source.toString())

    return { path, type, frontMatter, dom }
  }
}

export { getTemplate }

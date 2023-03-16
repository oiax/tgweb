import fs from "fs"
import YAML from "js-yaml"
import { JSDOM } from "jsdom"
import { normalizeFrontMatter } from "./normalize_front_matter.mjs"
import { mergeProperties } from "./merge_properties.mjs"
import { expandPaths } from "./expand_paths.mjs"

const separatorRegex = new RegExp("^---\\n", "m")

const getTemplate = (path, type, properties) => {
  const source = fs.readFileSync(path).toString().replaceAll(/\r/g, "")
  const parts = source.split(separatorRegex)

  if (parts[0] === "" && parts[1] !== undefined) {
    const frontMatter = mergeProperties(YAML.load(parts[1]), properties)
    normalizeFrontMatter(frontMatter)
    expandPaths(frontMatter)
    const html = parts.slice(2).join("---\n")
    const dom = new JSDOM(html)

    return { path, type, frontMatter, dom }
  }
  else {
    const frontMatter = mergeProperties({}, properties)
    expandPaths(frontMatter)
    const dom = new JSDOM(source)

    return { path, type, frontMatter, dom }
  }
}

export { getTemplate }

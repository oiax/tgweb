import * as PATH from "path"
import { slash } from "./slash.mjs"

const getType = path => {
  const dirname = slash(PATH.dirname(path))
  const filename = PATH.basename(path)

  if (filename === "_wrapper.html") return "wrapper"
  else if (dirname === "src/components") return "component"
  else if (dirname === "src/layouts") return "layout"
  else if (dirname === "src/articles") return "article"
  else if (dirname.startsWith("src/articles/")) return "article"
  else if (dirname === "src/pages") return "page"
  else if (dirname.startsWith("src/pages/")) return "page"
  else if (filename === "site.yml") return "site.yml"
  else return "unkown"
}

export default getType

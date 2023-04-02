import * as PATH from "path"

const getType = path => {
  const dirname = PATH.dirname(path)
  const filename = PATH.basename(path)
  const shortDirname = dirname.split("/").slice(0, 2).join("/")

  if (filename === "_wrapper.html") return "wrapper"
  else if (shortDirname === "src/segments") return "segment"
  else if (shortDirname === "src/components") return "component"
  else if (shortDirname === "src/layouts") return "layout"
  else if (shortDirname === "src/articles") return "article"
  else if (shortDirname === "src/pages") return "page"
  else if (filename === "site.yml") return "site.yml"
  else if (filename === "color_scheme.yml") return "color_scheme.yml"
  else return "unkown"
}

export default getType

import * as PATH from "path"

const getType = path => {
  const dirname = PATH.dirname(path)
  const filename = PATH.basename(path)
  const ext = PATH.extname(path)
  const shortDirname = dirname.split("/").slice(0, 2).join("/")

  if (filename === "_wrapper.html") return "wrapper"
  else if (shortDirname === "src/segments" && ext === ".html") return "segment"
  else if (shortDirname === "src/components" && ext === ".html") return "component"
  else if (shortDirname === "src/shared_components" && ext === ".html") return "shared_component"
  else if (shortDirname === "src/shared_wrappers" && ext === ".html") return "shared_wrapper"
  else if (shortDirname === "src/layouts" && ext === ".html") return "layout"
  else if (shortDirname === "src/articles" && ext === ".html") return "article"
  else if (shortDirname === "src/pages" && ext === ".html") return "page"
  else if (shortDirname === "src" && filename === "site.toml") return "site.toml"
  else if (shortDirname === "src" && filename === "color_scheme.toml") return "color_scheme.toml"
  else if (ext === ".toml") return "front_matter_file"
  else return "unkown"
}

export default getType

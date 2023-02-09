const getType = dirname => {
  if (dirname === "src/components") return "component"
  else if (dirname === "src/layouts") return "layout"
  else if (dirname === "src/articles") return "article"
  else if (dirname.startsWith("src/articles/")) return "article"
  else if (dirname === "src/pages") return "page"
  else if (dirname.startsWith("src/pages/")) return "page"
  else return "unkown"
}

export default getType

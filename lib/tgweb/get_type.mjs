const getType = function(dirname) {
  if (dirname === "src/components") return "component"
  else if (dirname === "src/layouts") return "layout"
  else if (dirname === "src/articles") return "article"
  else if (dirname === "src") return "page"
  else return "unkown"
}

export default getType

const getType = function(dirname) {
  if (dirname === "src") return "page"
  else if (dirname === "src/layouts") return "layout"
  else return "unkown"
}

export default getType

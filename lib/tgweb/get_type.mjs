const getType = function(dirname) {
  if (dirname === "src") return "page"
  else return "unkown"
}

export default getType

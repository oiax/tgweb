const inspectDom = (node, depth) => {
  depth = depth || 0

  if (node === undefined) {
    console.log("[undefined]")
  }
  else if (Array.isArray(node)) {
    console.log("[array]")
  }
  else if (node.constructor.name === "Document") {
    console.log("root")
    if (node.children !== undefined) node.children.forEach(c => inspectDom(c, 1))
    else console.log(node)
  }
  else if (node.constructor.name === "Element") {
    console.log("  ".repeat(depth) + node.name + " " + JSON.stringify(node.attribs))
    if (node.children !== undefined) node.children.forEach(c => inspectDom(c, depth + 1))
    else console.log(node)
  }
  else if (node.constructor.name === "Text") {
    const text = node.data.trim()
    if (text !== "") console.log("  ".repeat(depth) + `'${node.data.trim()}'`)
  }
  else {
    console.log(node.constructor.name)
  }
}

export { inspectDom }

const extractInserts = (node) => {
  const inserts = {}

  node.children
    .filter(child => child.constructor.name === "Element" && child.name === "tg-insert")
    .forEach(child => {
      const name = child.attribs.name

      if (name) inserts[name] = child
    })

  node.children =
    node.children.filter(child =>
      child.constructor.name !== "Element" || child.name !== "tg-insert"
    )

  return inserts
}

export { extractInserts }

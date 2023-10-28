import { DomUtils } from "htmlparser2"

const getTitle = (documentProperties, element) => {
  if (documentProperties.main.title) return documentProperties.main.title

  const h1 = DomUtils.findOne((elem) => elem.name == "h1", element.children, true)
  if (h1) return DomUtils.textContent(h1)

  const h2 = DomUtils.findOne((elem) => elem.name == "h2", element.children, true)
  if (h2) return DomUtils.textContent(h2)

  const h3 = DomUtils.findOne((elem) => elem.name == "h3", element.children, true)
  if (h3) return DomUtils.textContent(h3)

  const h4 = DomUtils.findOne((elem) => elem.name == "h4", element.children, true)
  if (h4) return DomUtils.textContent(h4)

  const h5 = DomUtils.findOne((elem) => elem.name == "h5", element.children, true)
  if (h5) return DomUtils.textContent(h5)

  const h6 = DomUtils.findOne((elem) => elem.name == "h6", element.children, true)
  if (h6) return DomUtils.textContent(h6)
}

export { getTitle }

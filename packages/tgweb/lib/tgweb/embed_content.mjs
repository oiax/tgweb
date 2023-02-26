const embedContent = (element, provider) => {
  const target =
    Array.from(element.childNodes).find(child =>
      child.nodeType === 1 && child.nodeName == "TG-CONTENT"
    )

  if (target) {
    const copy = provider.cloneNode(true)
    Array.from(copy.querySelectorAll("tg-insert")).map(elem => elem.remove())
    Array.from(copy.childNodes).forEach(c => element.insertBefore(c, target))
    element.removeChild(target)
  }
  else {
    element.childNodes.forEach(child => embedContent(child, provider))
  }
}

export { embedContent }

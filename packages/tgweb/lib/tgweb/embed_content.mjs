const embedContent = (container, innercontent) => {
  const target =
    Array.from(container.childNodes).find(child =>
      child.nodeType === 1 && child.nodeName == "TG-CONTENT"
    )

  if (target) {
    const copy = innercontent.cloneNode(true)
    Array.from(copy.querySelectorAll("tg-insert")).map(elem => elem.remove())
    Array.from(copy.childNodes).forEach(c => container.insertBefore(c, target))
    container.removeChild(target)
  }
  else {
    container.childNodes.forEach(child => embedContent(child, innercontent))
  }
}

export { embedContent }

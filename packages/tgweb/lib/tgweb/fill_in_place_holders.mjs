import { setAttrs } from "./set_attrs.mjs"

const fillInPlaceHolders = (element, provider, frontMatter) => {
  const slotContents = extractSlotContents(provider)

  element.querySelectorAll("tg-if-complete").forEach(envelope => {
    const placeholders = Array.from(envelope.querySelectorAll("tg-slot, tg-data, tg-prop"))

    const complete = placeholders.every(placeholder => {
      setAttrs(placeholder)

      if (placeholder.tagName == "TG-PROP") {
        return Object.hasOwn(frontMatter, placeholder.attrs["name"])
      }
      else if (placeholder.tagName == "TG-DATA") {
        return Object.hasOwn(frontMatter, "data-" + placeholder.attrs["name"])
      }
      else if (placeholder.tagName == "TG-SLOT") {
        return slotContents.some(c => c.attrs["name"] == placeholder.attrs["name"])
      }
    })

    if (complete) {
      envelope.childNodes.forEach(child =>
        envelope.parentNode.insertBefore(child.cloneNode(true), envelope)
      )
    }
  })

  element.querySelectorAll("tg-if-complete").forEach(wrapper => wrapper.remove())

  element.querySelectorAll("tg-slot, tg-data, tg-prop").forEach(placeholder => {
    setAttrs(placeholder)

    if (placeholder.tagName == "TG-PROP") {
      const value = frontMatter[placeholder.attrs["name"]]
      if (value) placeholder.before(value)
    }
    else if (placeholder.tagName == "TG-DATA") {
      const value = frontMatter["data-" + placeholder.attrs["name"]]
      if (value) placeholder.before(value)
    }
    else if (placeholder.tagName == "TG-SLOT") {
      const content = slotContents.find(c => c.attrs["name"] == placeholder.attrs["name"])

      if (content)
        Array.from(content.cloneNode(true).childNodes).forEach(child => placeholder.before(child))
      else
        Array.from(placeholder.childNodes).forEach(child => placeholder.before(child))
    }
  })

  element.querySelectorAll("tg-slot, tg-data, tg-prop").forEach(slot => slot.remove())
}

const extractSlotContents = element => {
  const slotContents =
    Array.from(element.querySelectorAll("tg-insert")).map(elem => {
      const copy = elem.cloneNode(true)
      setAttrs(copy)
      return copy
    })

  return slotContents
}

export { fillInPlaceHolders }

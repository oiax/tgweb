import { slash } from "./slash.mjs"

const processTgLinks = (root, siteData, path) => {
  const currentPath = slash(path).replace(/^src\//, "").replace(/^pages\//, "")

  Array.from(root.querySelectorAll("tg-link[href]")).forEach(link => {
    const href = link.getAttribute("href")
    const label = link.getAttribute("label") || ""

    const componentName = link.getAttribute("component")

    if (componentName) {
      const component =
        siteData.components.find(component => component.path == componentName + ".html")

      if (component) {
        const componentRoot = component.dom.window.document.body.childNodes[0]

        if (componentRoot.tagName === "TG-LINK") {
          link.innerHTML = ""
          Array.from(componentRoot.childNodes).forEach(child => link.appendChild(child))
        }
        else {
          console.log("Error.")
        }
      }
    }

    Array.from(link.querySelectorAll("tg-label")).forEach(e => e.replaceWith(label))

    if (href === `/${currentPath}`) {
      const fallback = link.querySelector("tg-if-current")

      if (fallback) {
        Array.from(fallback.childNodes).forEach(child => link.before(child))
      }
    }
    else {
      const fallback = link.querySelector("tg-if-current")
      if (fallback) fallback.remove()
      const adjusted = href.replace(/\/index.html$/, "/")
      Array.from(link.querySelectorAll("a[href='#']")).forEach(a => a.href = adjusted)
      Array.from(link.childNodes).forEach(child => link.before(child))
    }

    link.remove()
  })

  Array.from(root.querySelectorAll("tg-link[href]")).forEach(link => link.remove())
}

export { processTgLinks }

import { DomUtils } from "htmlparser2"
import { getWrapper } from "./get_wrapper.mjs"
import { getLayout } from "./get_layout.mjs"
import { filterArticles } from "./filter_articles.mjs"

const setDependencies = (object, siteData, deep) => {
  object.dependencies = []

  DomUtils.find(
    node => node.constructor.name === "Element" && node.name === "tg:component",
    object.dom.children,
    true
  )
  .forEach(ref => {
    if (ref.attribs.name) object.dependencies.push(`components/${ref.attribs.name}`)
  })

  DomUtils.find(
    node => node.constructor.name === "Element" && node.name === "tg:segment",
    object.dom.children,
    true
  )
  .forEach(ref => {
    if (ref.attribs.name === undefined) return

    const segment = siteData.segments.find(s => s.path === `segments/${ref.attribs.name}.html`)

    if (segment) {
      object.dependencies.push(`segments/${ref.attribs.name}`)
      segment.dependencies.forEach(dep => object.dependencies.push(dep))
    }
  })

  DomUtils.find(
    node => node.constructor.name === "Element" && node.name === "tg:article",
    object.dom.children,
    true
  )
  .forEach(ref => {
    if (ref.attribs.name === undefined) return

    const article = siteData.articles.find(a => a.path === `articles/${ref.attribs.name}.html`)

    if (article === undefined) return

    object.dependencies.push(`articles/${ref.attribs.name}`)
    article.dependencies.forEach(dep => object.dependencies.push(dep))

    const wrapper = getWrapper(siteData, article.path)

    if (wrapper) {
      object.dependencies.push(wrapper.path.replace(/\.html$/, ""))
      wrapper.dependencies.forEach(dep => object.dependencies.push(dep))
    }
  })

  DomUtils.find(
    node => node.constructor.name === "Element" && node.name === "tg:articles",
    object.dom.children,
    true
  )
  .forEach(ref => {
    const pattern = ref.attribs.pattern
    const tag = getTag(ref.attribs.filter)

    const articles = filterArticles(siteData.articles, pattern, tag)

    articles.forEach(article => {
      object.dependencies.push(article.path.replace(/\.html$/, ""))

      const wrapper = getWrapper(siteData, article.path)

      if (wrapper) {
        object.dependencies.push(wrapper.path.replace(/\.html$/, ""))
        wrapper.dependencies.forEach(dep => object.dependencies.push(dep))
      }
    })
  })

  DomUtils.find(
    node =>
      node.constructor.name === "Element" && node.name === "tg:link" && node.attribs.component,
    object.dom.children,
    true
  )
  .forEach(ref => object.dependencies.push(`components/${ref.attribs.component}`))

  DomUtils.find(
    node => node.constructor.name === "Element" && node.name === "tg:links",
    object.dom.children,
    true
  )
  .forEach(ref => {
    if (ref.attribs.component !== undefined)
      object.dependencies.push(`components/${ref.attribs.component}`)

    const pattern = ref.attribs.pattern
    const tag = getTag(ref.attribs.filter)

    const articles = filterArticles(siteData.articles, pattern, tag)

    articles.forEach(
      article => object.dependencies.push(article.path.replace(/\.html$/, ""))
    )
  })

  if (object.type === "page") {
    const wrapper = getWrapper(siteData, object.path)
    const layout = getLayout(siteData, object, wrapper)

    if (layout) {
      const layoutName = layout.path.replace(/\.html$/, "")
      object.dependencies.push(layoutName)
      layout.dependencies.forEach(dep => object.dependencies.push(dep))
    }

    if (wrapper) {
      const wrapperName = wrapper.path.replace(/\.html$/, "")
      object.dependencies.push(wrapperName)
      wrapper.dependencies.forEach(dep => object.dependencies.push(dep))
    }
  }

  if (object.type === "article") {
    const wrapper = getWrapper(siteData, object.path)

    if (deep) {
      const layout = getLayout(siteData, object, wrapper)

      if (layout) {
        const layoutName = layout.path.replace(/\.html$/, "")
        object.dependencies.push(layoutName)
        layout.dependencies.forEach(dep => object.dependencies.push(dep))
      }

      if (wrapper) {
        const wrapperName = wrapper.path.replace(/\.html$/, "")
        object.dependencies.push(wrapperName)
        wrapper.dependencies.forEach(dep => object.dependencies.push(dep))
      }
    }
    else if (wrapper) {
      const wrapperName = wrapper.path.replace(/\.html$/, "")
      object.dependencies.push(wrapperName)
      wrapper.dependencies.forEach(dep => object.dependencies.push(dep))
    }
  }

  object.dependencies = Array.from(new Set(object.dependencies)).sort()
}

const getTag = filter_attr => {
  if (filter_attr) {
    const re = /^(tag):(.+)$/
    const md = re.exec(filter_attr)
    if (md) return md[2]
  }
}

export { setDependencies }

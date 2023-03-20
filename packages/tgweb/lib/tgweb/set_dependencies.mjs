import * as PATH from "path"
import { setAttrs } from "./set_attrs.mjs"
import getTag from "./get_tag.mjs"
import filterArticles from "./filter_articles.mjs"
import { getWrapper } from "./get_wrapper.mjs"
import { getLayout } from "./get_layout.mjs"

const setDependencies = (object, siteData) => {
  const body = object.dom.window.document.body
  object.dependencies = []

  const componentRefs = body.querySelectorAll("tg-component")

  componentRefs.forEach(ref => {
    setAttrs(ref)
    const componentName = "components/" + ref.attrs["name"]
    object.dependencies.push(componentName)
  })

  const segmentRefs = body.querySelectorAll("tg-segment")

  segmentRefs.forEach(ref => {
    setAttrs(ref)
    const segmentName = "segments/" + ref.attrs["name"]
    object.dependencies.push(segmentName)
  })

  const articleRefs = body.querySelectorAll("tg-article")

  articleRefs.forEach(ref => {
    setAttrs(ref)
    const articleName = "articles/" + ref.attrs["name"]
    object.dependencies.push(articleName)

    const article = siteData.articles.find(a => a.path === ref.attrs["name"] + ".html")

    if (article) {
      article.dependencies.forEach(dep => {
        if (dep.startsWith("layouts/")) return
        if (dep.startsWith("segments/")) return
        object.dependencies.push(dep)
      })
    }
  })

  const articleListRefs = body.querySelectorAll("tg-articles")

  articleListRefs.forEach(ref => {
    setAttrs(ref)
    const pattern = ref.attrs["pattern"]
    const tag = getTag(ref)
    const articles = filterArticles(siteData.articles, pattern, tag)

    articles.forEach(article => {
      const articleName = "articles/" + article.path.replace(/\.html$/, "")
      object.dependencies.push(articleName)

      article.dependencies.forEach(dep => {
        if (dep.startsWith("layouts/")) return
        if (dep.startsWith("segments/")) return
        object.dependencies.push(dep)
      })
    })
  })

  const linkListRefs = body.querySelectorAll("tg-links")

  linkListRefs.forEach(ref => {
    setAttrs(ref)
    const pattern = ref.attrs["pattern"]
    const tag = getTag(ref)
    const articles = filterArticles(siteData.articles, pattern, tag)

    articles.forEach(article => {
      const articleName = "articles/" + article.path.replace(/\.html$/, "")
      object.dependencies.push(articleName)
    })
  })

  if (object.type === "page" || object.type === "article") {
    const parentDir = object.type === "page" ? "pages" : "articles"
    const wrapper = getWrapper(siteData, PATH.join(parentDir, object.path))
    const layout = getLayout(siteData, object, wrapper)

    if (layout) {
      const layoutName = layout.path.replace(/\.html$/, "")
      object.dependencies.push("layouts/" + layoutName)
      layout.dependencies.forEach(dep => object.dependencies.push(dep))
    }

    if (wrapper) {
      const wrapperName = wrapper.path.replace(/\.html$/, "")
      object.dependencies.push(wrapperName)
      wrapper.dependencies.forEach(dep => object.dependencies.push(dep))
    }
  }

  object.dependencies = Array.from(new Set(object.dependencies)).sort()
}

export { setDependencies }

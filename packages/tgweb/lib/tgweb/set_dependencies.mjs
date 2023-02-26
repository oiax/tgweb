import * as PATH from "path"
import { setAttrs } from "./set_attrs.mjs"
import getTag from "./get_tag.mjs"
import filterArticles from "./filter_articles.mjs"
import { getWrapper } from "./get_wrapper.mjs"

const setDependencies = (object, siteData) => {
  const body = object.dom.window.document.body
  object.dependencies = []

  const componentRefs = body.querySelectorAll("tg-component")

  componentRefs.forEach(ref => {
    setAttrs(ref)
    const componentName = "components/" + ref.attrs["name"]
    object.dependencies.push(componentName)
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

  const layoutName = object.frontMatter["layout"]

  if (layoutName) {
    object.dependencies.push("layouts/" + layoutName)

    const layout = siteData.layouts.find(layout => layout.path === layoutName + ".html")
    if (layout) layout.dependencies.forEach(dep => object.dependencies.push(dep))
  }

  if (object.type === "page" || object.type === "article") {
    const parentDir = object.type === "page" ? "pages" : "articles"
    const wrapper = getWrapper(siteData, PATH.join(parentDir, object.path))

    if (wrapper) {
      const wrapperName = wrapper.path.replace(/\.html$/, "")
      object.dependencies.push(wrapperName)
      wrapper.dependencies.forEach(dep => object.dependencies.push(dep))
    }
  }

  object.dependencies = Array.from(new Set(object.dependencies)).sort()
}

export { setDependencies }

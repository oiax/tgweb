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
    const componentName = ref.attrs["name"]
    object.dependencies.push("components/" + componentName)
  })

  const articleRefs = body.querySelectorAll("tg-article")

  articleRefs.forEach(ref => {
    setAttrs(ref)
    const articleName = ref.attrs["name"]
    object.dependencies.push("articles/" + articleName)
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
    const wrapper = getWrapper(object, siteData)

    if (wrapper) {
      object.dependencies.push(wrapper.path.replace(/\.html$/, ""))

      wrapper.dependencies.forEach(dep => {
        if (! object.dependencies.includes(dep)) object.dependencies.push(dep)
      })
    }
  }
}

export { setDependencies }

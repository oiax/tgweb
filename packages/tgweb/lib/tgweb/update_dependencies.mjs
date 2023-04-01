import { setDependencies } from "./set_dependencies.mjs"

const updateDependencies = (siteData) => {
  siteData.wrappers.forEach(w => setDependencies(w, siteData))
  siteData.articles.forEach(a => setDependencies(a, siteData))
  siteData.segments.forEach(s => setDependencies(s, siteData))
  siteData.layouts.forEach(l => setDependencies(l, siteData))
  siteData.pages.forEach(p => setDependencies(p, siteData))
  siteData.articles.forEach(a => setDependencies(a, siteData, true))
}

export { updateDependencies }

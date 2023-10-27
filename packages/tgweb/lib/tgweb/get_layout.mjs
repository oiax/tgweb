const getLayout = (siteData, mainTemplate, wrapper) => {
  const layoutName =
    mainTemplate.frontMatter.main.layout ||
      (wrapper && wrapper.frontMatter.main.layout) ||
      siteData.properties.main.layout

  return siteData.layouts.find(layout => layout.path === `layouts/${layoutName}.html`)
}

export { getLayout }

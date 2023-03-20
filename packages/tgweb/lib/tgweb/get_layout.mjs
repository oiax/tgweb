const getLayout = (siteData, mainTemplate, wrapper) => {
  const layoutName =
    mainTemplate.frontMatter["layout"] ||
    (wrapper && wrapper.frontMatter["layout"]) ||
    siteData.properties["layout"]

  return siteData.layouts.find(layout => layout.path === `${layoutName}.html`)
}

export { getLayout }

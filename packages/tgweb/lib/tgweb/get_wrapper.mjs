import { parseDocument } from "htmlparser2"

const getWrapper = (siteData, path) => {
  const dirParts = path.split("/")
  dirParts.pop()

  for(let i = dirParts.length; i > 0; i--) {
    const dir = dirParts.slice(0, i).join("/")
    const wrapperPath = `${dir}/_wrapper.html`

    const wrapper = siteData.wrappers.find(wrapper => wrapper.path === wrapperPath)

    if (wrapper) {
      if ("shared-wrapper" in wrapper.frontMatter.main) {
        const sharedWrapperName = wrapper.frontMatter.main["shared-wrapper"]

        const sharedWrapper =
          siteData.sharedWrappers.find(sw =>
            sw.path === `shared_wrappers/${sharedWrapperName}.html`
          )

        if (sharedWrapper) {
          return sharedWrapper
        }
        else {
          wrapper.dom =
            parseDocument(`<div class='bg-error text-black m-1 py-1 px-2'>${message}</div>"`)

          return wrapper
        }
      }

      return wrapper
    }
  }
}

export { getWrapper }

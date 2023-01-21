import fs from "fs"
import * as PATH from "path"
import glob from "glob"
import { JSDOM } from "jsdom"
import { fileURLToPath } from "url";
import { dirname } from "path";

const getSiteData = function (directory) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const siteData = {
    pages: [],
    layouts: [],
    articles: [],
    components: []
  }

  const htmlPath = PATH.resolve(__dirname, "../../resources/document_template.html")
  const documentTemplate = getDom(htmlPath)
  siteData.documentTemplate = documentTemplate.dom

  if (fs.existsSync(directory + "/src")) {
    siteData.pages = glob.sync(directory + "/src/*.html").map(getDom)
  }

  if (fs.existsSync(directory + "/src/layouts")) {
    siteData.layouts = glob.sync(directory + "/src/layouts/*.html").map(getDom)
  }

  if (fs.existsSync(directory + "/src/articles")) {
    siteData.articles = glob.sync(directory + "/src/articles/*.html").map(getDom)
  }

  if (fs.existsSync(directory + "/src/components")) {
    siteData.components = glob.sync(directory + "/src/components/*.html").map(getDom)
  }

  return siteData
}

const getDom = function (path) {
  const filename = PATH.basename(path)
  const html = fs.readFileSync(path)
  const dom = new JSDOM(html)
  return { filename, dom }
}

export default getSiteData

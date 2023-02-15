import assert from "node:assert/strict"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import generateHTML from "../../lib/tgweb/generate_html.mjs"
import { JSDOM } from "jsdom"
import { fileURLToPath } from "url";
import * as PATH from "path"
import pretty from "pretty"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

describe("generateHTML", () => {
  it("should embed the given page into the document template", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/pages/about.html", siteData)
    const dom = new JSDOM(html)

    const head = dom.window.document.head

    const title = head.querySelector("title")
    assert.equal(title.textContent, "About Us")

    const script = head.querySelector("script")
    assert.equal(script.attributes.getNamedItem("src").value, "/reload/reload.js")
    assert.equal(script.attributes.getNamedItem("defer").value, "")
  })

  it("should embed the given page into the specified layout", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/pages/index.html", siteData)
    const dom = new JSDOM(html)

    const head = dom.window.document.head

    const title = head.querySelector("title")
    assert.equal(title.textContent, "Home")

    const body = dom.window.document.body
    const div0 = body.children[0]
    assert.equal(div0.attributes.length, 1)

    const h3 = body.querySelector("h3")
    assert.equal(h3.textContent, "Greeting")
  })

  it("should embed contents into slots within a layout", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/pages/product1.html", siteData)
    const dom = new JSDOM(html)
    const lines = pretty(dom.window.document.body.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<body class="p-2">',
      '  <div>',
      '    <h1>Product 1</h1>',
      '    <p>Description</p>',
      '  </div>',
      '  <div class="border-2 border-black border-solid p-2">',
      '    This product is very fragile.',
      '  </div>',
      '  <div><span>A</span><span>B</span></div>',
      '</body>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should omit a <tg-if-complete> element if all slots receives an insert", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/pages/product2.html", siteData)
    const dom = new JSDOM(html)
    const lines = pretty(dom.window.document.body.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<body class="p-2">',
      '  <div>',
      '    <h1>Product 2</h1>',
      '    <p>Description</p>',
      '  </div>',
      '  <div>*</div>',
      '</body>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should merge a layout, a page and components", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/pages/index.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body

    const h3 = body.querySelector("h3")
    assert.equal(h3.textContent, "FizzBuzz")

    const p1 = body.querySelector("div.grid > div > p")
    assert.equal(p1.textContent, "Hello, world!")

    const p2 = body.querySelector("div.grid > div:nth-child(2) > p")
    assert.equal(p2.textContent, "I am a computer.")

    const nav = body.querySelector("main > div:nth-child(1) > nav")
    const nav_lines = pretty(nav.outerHTML, {ocd: true}).split("\n")

    const nav_expected = [
      '<nav>',
      '  <ul>',
      '    <li>',
      '      <a href="/articles/blog/a.html">A</a>',
      '      (<span>2022-12-31</span>)',
      '    </li>',
      '    <li>',
      '      <a href="/articles/blog/c.html">C</a>',
      '      (<span>2023-01-02</span>)',
      '    </li>',
      '    <li>',
      '      <a href="/articles/blog/d.html">D</a>',
      '      (<span>2023-01-03</span>)',
      '    </li>',
      '  </ul>',
      '</nav>'
    ]

    nav_lines.forEach((line, index) =>
      assert.equal(line, nav_expected[index], `Line: ${index + 1}`)
    )

    const main = body.querySelector("main")

    const tech1 = main.children[1]
    assert.equal(tech1.children[0].textContent.trim(), "A")

    const tech2 = main.children[2]
    assert.equal(tech2.children[0].textContent.trim(), "D")

    const tech3 = main.children[3]
    assert.equal(tech3.children[0].textContent.trim(), "C")
  })

  it("should generate a link list", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/articles/technology.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body
    const list = body.querySelector("nav > ul")

    assert.equal(list.children.length, 3)

    const link0 = list.children[0].children[0]

    assert.equal(link0.href, "/articles/blog/a.html")
    assert.equal(link0.textContent, "A")
    assert.equal(link0.attributes.getNamedItem("tg-text"), null)
  })

  it("should generate a link", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/articles/blog/a.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body
    const footer = body.querySelector("footer")
    const lines = pretty(footer.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<footer>',
      '  <a href="/about.html">About</a>',
      '</footer>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should merge attributes of article and component", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/articles/blog/b.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body

    const h3 = body.querySelector("h3")

    assert.equal(h3.textContent.trim(), "B")

    const p = body.children[1].children[0].children[1]
    assert.equal(p.tagName, "P")
    assert.equal(p.textContent, "This is B.")

    const dateDiv = body.children[1].children[0].children[2]
    assert.equal(dateDiv.textContent, "2023-01-01")
  })

  it("should render <tg-link> correctly when href is not current", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/pages/index.html", siteData)
    const dom = new JSDOM(html)
    const nav = dom.window.document.body.querySelector("nav")
    const lines = pretty(nav.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<nav>',
      '  <span class="font-bold">Home</span>',
      '  <a href="/about.html" class="underline text-blue-500">About Us</a>',
      '</nav>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should render <tg-link> correctly when href is current", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/pages/about.html", siteData)
    const dom = new JSDOM(html)
    const nav = dom.window.document.body.querySelector("nav")
    const lines = pretty(nav.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<nav>',
      '  <a href="/" class="underline text-blue-500">Home</a>',
      '  <span class="font-bold">About Us</span>',
      '</nav>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should render <tg-link> correctly within <tg-links>", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/articles/blog/c.html", siteData)
    const dom = new JSDOM(html)
    const nav = dom.window.document.body.querySelector("nav")
    const lines = pretty(nav.outerHTML, {ocd: true}).split("\n")

    const expected = [
        '<nav>',
        '  <ul>',
        '    <li>',
        '      <a href="/articles/blog/a.html">A</a>',
        '      (<span>2022-12-31</span>)',
        '    </li>',
        '    <li>',
        '      <a href="/articles/blog/b.html">B</a>',
        '      (<span>2023-01-01</span>)',
        '    </li>',
        '    <li>',
        '      <span class="font-bold">C</span>',
        '      (<span>2023-01-02</span>)',
        '    </li>',
        '    <li>',
        '      <a href="/articles/blog/d.html">D</a>',
        '      (<span>2023-01-03</span>)',
        '    </li>',
        '  </ul>',
        '</nav>'
      ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })
})

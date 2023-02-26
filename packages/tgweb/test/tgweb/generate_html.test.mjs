import assert from "node:assert/strict"
import { getSiteData } from "../../lib/tgweb/get_site_data.mjs"
import generateHTML from "../../lib/tgweb/generate_html.mjs"
import { JSDOM } from "jsdom"
import { fileURLToPath } from "url";
import * as PATH from "path"
import pretty from "pretty"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url))

const pp = element => {
  console.log("<<<<")
  console.log(pretty(element.outerHTML, {ocd: true}))
  console.log(">>>>")
}

// Prevent warnings when function pp is not used.
if (pp === undefined) { pp() }

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

  it("should generate <meta> and <link> tags", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_0")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/pages/index.html", siteData)
    const dom = new JSDOM(html)

    const head = dom.window.document.head
    const lines = pretty(head.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<head>',
      '  <meta charset="utf-8">',
      '  <title>Home</title>',
      '  <meta name="viewport" content="width=device-width, initial-scale=1">',
      `  <meta http-equiv="content-security-policy" content="default-src 'self'">`,
      '  <meta property="fb:app_id" content="0123456789abced">',
      '  <meta property="og:type" content="website">',
      '  <meta property="og:url" content="http://localhost:3000/">',
      '  <meta property="og:title" content="Home">',
      '  <meta property="og:image" content="http://localhost:3000/images/icons/default.png">',
      '  <link rel="canonical" href="http://localhost:3000/">',
      '  <link rel="stylesheet" href="/css/tailwind.css">',
      '  <script src="/reload/reload.js" defer=""></script>',
      '</head>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
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

  it("should omit a <tg-if-complete> element if all slots receive an insert", () => {
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

  it("should merge a layout, a wrapper, a page and components", () => {
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
      '      <a href="/articles/blog/d.html">X</a>',
      '      (<span>2023-01-03</span>)',
      '      <span>New</span>',
      '    </li>',
      '    <li>',
      '      <a href="/articles/blog/a.html">Y</a>',
      '      (<span>2022-12-31</span>)',
      '    </li>',
      '    <li>',
      '      <a href="/articles/blog/c.html">Z</a>',
      '      (<span>2023-01-02</span>)',
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

    const e = main.children[4]
    const e_lines = pretty(e.outerHTML, {ocd: true}).split("\n")

    const e_expected = [
      '<div class="bg-gray-100 py-2">',
      '  <h3 class="font-bold text-lg ml-2">',
      '    E',
      '  </h3>',
      '  <p>This is E.</p>',
      '</div>'
    ]

    e_lines.forEach((line, index) =>
      assert.equal(line, e_expected[index], `Line: ${index + 1}`)
    )
  })

  it("should embed a custom property to a layout", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/pages/index.html", siteData)
    const dom = new JSDOM(html)

    const footer = dom.window.document.body.querySelector("footer")

    assert.equal(footer.innerHTML.trim(), "© 2023 Example Inc.")
  })

  it("should apply a wrapper to a page in a subdirectory", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/pages/etc/about.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body
    const lines = pretty(body.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<body class="p-2">',
      '  <header>HEADER</header>',
      '  <nav><a href="/">Index</a></nav>',
      '  <main class="bg-gray-100 py-2">',
      '    <h3 class="font-bold text-lg ml-2">About us</h3>',
      '    <p class="mb-4 text-gray-900">We are ...</p>',
      '    <p class="mb-4 text-gray-900">Our goal is ...</p>',
      '  </main>',
      '  <footer>FOOTER</footer>',
      '</body>'
    ]

    lines.forEach((line, index) =>
      assert.equal(line, expected[index], `Line: ${index + 1}`)
    )
  })

  it("should apply a wrapper to an article in a subdirectory", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/articles/foo/bar/baz.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body

    const lines = pretty(body.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<body class="p-2">',
      '  <header>HEADER</header>',
      '  <nav><a href="/">Index</a></nav>',
      '  <main class="bg-green-100 py-2">',
      '    <h3 class="font-bold text-lg ml-2">BAZ</h3>',
      '    <p class="text-red-500">Baz baz baz ...</p>',
      '  </main>',
      '  <footer>FOOTER</footer>',
      '</body>'
    ]

    lines.forEach((line, index) =>
      assert.equal(line, expected[index], `Line: ${index + 1}`)
    )
  })

  it("should generate a link list", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)

    const html = generateHTML("src/articles/technology.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body
    const list = body.querySelector("nav > ul")

    const lines = pretty(list.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<ul>',
      '  <li>',
      '    <a href="/articles/blog/d.html">X</a>',
      '    (<span>2023-01-03</span>)',
      '    <span>New</span>',
      '  </li>',
      '  <li>',
      '    <a href="/articles/blog/a.html">Y</a>',
      '    (<span>2022-12-31</span>)',
      '  </li>',
      '  <li>',
      '    <a href="/articles/blog/c.html">Z</a>',
      '    (<span>2023-01-02</span>)',
      '  </li>',
      '</ul>'
    ]

    lines.forEach((line, index) =>
      assert.equal(line, expected[index], `Line: ${index + 1}`)
    )
  })

  it("should generate a single link", () => {
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

  it("should embed the value of a custom property into <tg-if-complete> envelope", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/articles/blog/b.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body
    const main = body.querySelector("main")

    const lines = pretty(main.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<main>',
      '  <div class="bg-gray-100 py-2">',
      '    <h3 class="font-bold text-lg ml-2">',
      '      B',
      '    </h3>',
      '    <p>This is B.</p>',
      '    <div>2023-01-01</div>',
      '  </div>',
      '</main>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should not embed undefined value of a custom property into <tg-if-complete> envelope", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/articles/blog/e.html", siteData)
    const dom = new JSDOM(html)

    const body = dom.window.document.body
    const main = body.querySelector("main")

    const lines = pretty(main.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<main>',
      '  <div class="bg-gray-100 py-2">',
      '    <h3 class="font-bold text-lg ml-2">',
      '      E',
      '    </h3>',
      '    <p>This is E.</p>',
      '  </div>',
      '</main>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
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
        '    <li>',
        '      <a href="/articles/blog/e.html">E</a>',
        '    </li>',
        '  </ul>',
        '</nav>'
      ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should embed a component into a wrapper", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_1")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/pages/index.html", siteData)
    const dom = new JSDOM(html)
    const body = dom.window.document.body
    const aside = body.querySelector("aside")

    const lines = pretty(aside.outerHTML, {ocd: true}).split("\n")
    const expected = [ '<aside>', '  <div>Special Content</div>', '</aside>' ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should expand class aliases in a page", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/pages/index.html", siteData)
    const dom = new JSDOM(html)
    const body = dom.window.document.body
    const lines = pretty(body.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<body class="p-2">',
      '  <header>HEADER</header>',
      '  <nav><a href="/etc/about.html">About</a></nav>',
      '  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">',
      '    <div class="bg-gray-100 py-2">',
      '      <h3 class="font-bold text-lg ml-2">Greeting</h3>',
      '      <div class="flex justify-center">',
      '        Hello, world!',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <footer>FOOTER</footer>',
      '</body>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should expand class aliases in a layout", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/pages/a.html", siteData)
    const dom = new JSDOM(html)
    const body = dom.window.document.body
    const lines = pretty(body.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<body class="p-2">',
      '  <header class="bg-green-500">HEADER</header>',
      '  <nav><a href="/">Index</a></nav>',
      '  <div class="">',
      '    <div class="bg-gray-100 py-2">',
      '      <h3>A</h3>',
      '      <div class="flex justify-center">',
      '        Hello, world!',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <footer class="bg-red-700">FOOTER</footer>',
      '</body>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should expand class aliases in a wrapper", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/articles/foo/bar/baz.html", siteData)
    const dom = new JSDOM(html)
    const body = dom.window.document.body
    const lines = pretty(body.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<body class="p-2">',
      '  <header>HEADER</header>',
      '  <nav><a href="/">Index</a></nav>',
      '  <main class="bg-green-100 py-2">',
      '    <h3 class="font-bold text-lg ml-2">BAZ</h3>',
      '    <p class="text-red-500">Baz baz baz ...</p>',
      '  </main>',
      '  <footer>FOOTER</footer>',
      '</body>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should expand class aliases in a component", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/pages/b.html", siteData)
    const dom = new JSDOM(html)
    const body = dom.window.document.body

    const lines = pretty(body.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<body class="p-2">',
      '  <header>HEADER</header>',
      '  <nav><a href="/">Index</a></nav>',
      '  <div>',
      '    <h3>B</h3>',
      '    <div class="w-24 h-24 bg-pink-700">',
      '      BOX',
      '    </div>',
      '  </div>',
      '  <footer>FOOTER</footer>',
      '</body>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })

  it("should render a page with Japanese text", () => {
    const wd = PATH.resolve(__dirname, "../examples/site_2")
    const siteData = getSiteData(wd)
    const html = generateHTML("src/pages/index_ja.html", siteData)
    const dom = new JSDOM(html)
    const body = dom.window.document.body

    const lines = pretty(body.outerHTML, {ocd: true}).split("\n")

    const expected = [
      '<body class="p-2">',
      '  <header>HEADER</header>',
      '  <nav><a href="/etc/about.html">About</a></nav>',
      '  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">',
      '    <div class="bg-gray-100 py-2">',
      '      <h3 class="font-bold text-lg ml-2">挨拶</h3>',
      '      <div class="flex justify-center">',
      '        こんにちは、世界よ！',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <footer>FOOTER</footer>',
      '</body>'
    ]

    lines.forEach((line, index) => assert.equal(line, expected[index], `Line: ${index + 1}`))
  })
})

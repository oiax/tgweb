# tgweb - Teamgenik Website Builder Offline Tool

## Table of Contents

* [Requirements](#requirements)
* [Getting Started](#getting-started)
* [Directory Structure](#directory-structure)
* [Pages](#pages)
* [Images](#images)
* [Audios](#audios)
* [Layouts](#layouts)
* [Components](#components)
* [Articles](#articles)
* [Tags](#tags)
* [Tailwind CSS](#tailwind-css)
* [Alpine.js](#alpinejs)
* [Managing the Contents of the `<head>` Element](#managing-the-contents-of-the-head-element)
* [License](#license)

## Directory structure

## Requirements

* Node.js: 16.12 or higher
* npm: 8.0 or higher

## Getting Started

### Installation

Install with npm:

```bash
npm install tgweb
```

### Create a site

To create a website named `example`, run the following command:

```bash
npx tgweb-init example
```

This command creates `example` directory in the `sites` directory.

Henceforth we will refer to this directory as the _working directory_.

In addition, this command creates `src` and `dist` directory under the woking directory.

### Add content

Create `index.html` in the `src/pages` subdirectory with the following content:

```html
<body>
  <div class="bg-red-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

Note that the `body` element should not be surrounded by `<html>` and `</html>`.

### Start the tgweb server

To start the tgweb server, run the following command:

```bash
npx tgweb-server example
```

Then, open `http://localhost:3000` with your browser.

Make sure that the text "Hello, world!" appears in the red background area.

The class tokens `bg-red-300` and `p-4` specified in the `class` attribute of the `<div>`
element are provided by [Tailwind CSS](https://tailwindcss.com/).

The token `bg-red-300` specifies light red as the background color of `<div>` element,
and the token `p-4` sets a padding of 16 pixels to it.

Also verify that a file named `index.html` has been created in the `dist` directory.
The contents of that file should be a complete HTML document that contains
the `<html>` and `<head>` elements.

In addition, **tgweb** generates a file named `tailwind.css` under the `dist/css` directory
with the help of Tailwind CSS.

You may have noticed that the content of the `<title>` element of `index.html` is "No Title".
How to deal with this problem is described later.

### Modify content

Edit `index.html` as follows:

```html
<body>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

Confirm that the browser screen is automatically redrawn and the background color of
"Hello, world!" changes to green.

### Stop the tgweb server

Presse `Ctrl + C` to stop the tgweb server.

## Directory Structure

Running `npx tgweb-init example` from the command line creates a directory structure with the
following elements:

```plain
example/
├── dist
├── src
│   ├── articles
│   ├── audios
│   ├── components
│   ├── images
│   ├── layouts
│   ├── pages
│   └── tags
├── tailwind.config.js
└── tailwind.css
```

Please note the following:

* **tgweb** scans the contents of the `src` directory, generates HTML files, CSS files, etc., and
  writes them into the `dist` directory.
* It makes no sense for the user to rewrite the contents of the `dist` directory.
* Users are not allowed to change `tailwind.config.js` and `tailwind.css`.
* Users are not allowed to add their own CSS files to the website.
* Users are not allowed to add their own javascript files to the website.

## Pages

### What is a page

In **tgweb**, the HTML documents that make up a website are generated from a combination of
template files. A _page_ is a type of such template file.
Pages are placed in the `src/pages` subdirectory under the working directory.

It is possible to create a subdirectory under the `src/pages` directory and place pages under it.
However, it is not possible to create a subdirectory directly under the `src/pages` directory with
the following names:

* `articles`
* `audios`
* `images`
* `tags`
* `videos`

Every website must have a page named `index.html`.
From this page, the _home page_ of the website is generated.

### Adding a simple page

Pages to which a [layout](#Layouts) is not applied are called "simple pages".

The following is an example of a simple page:

```html
<body>
  <h1 class="text-2xl font-bold">Greeting</h1>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

Note that the top-level element of a page is the `<body>` element.
The top-level element of a normal HTML page is the `<html>` element, under which are
the `<head>` element and the `<body>` element.

The pages will be converted into a complete HTML document and written to the `dist` directory.

For example, `src/pages/index.html` is converted to `dist/index.html` and
`src/pages/shops/new_york.html` is converted to `dist/shops/new_york.html`.

The content of the `<head>` element is automatically generated.
See [below](#managing-the-contents-of-the-head-element) for details.

## Images

Image files are placed in the `src/images` subdirectory under the working directory.

There are two ways to embed images in a page.
One is to use the `<img>` element, and the other is to set it as the background of an element.

Teamgenik supports image files in the following formats:

* AVIF ('.avif')
* BMP ('.bmp')
* GIF ('.gif')
* JPEG ('.jpg', '.jpeg')
* PNG ('.png')
* WEBP ('.webp')

### `<img>` element

If the `src` attribute of the `<img>` element contains the relative path of the image file,
the image will be embedded in the page.

```html
<img src="../images/smile.png" alt="Smile face">
```

You do not need to write the width and height attributes in the img tag,
because Teamgenik will automatically specify them for you.

Note that the value of the `src` attribute is a relative path from the page file to the image file.
When you embed `src/images/smile.png` into `src/pages/foo/bar.html`,
you must specify `../../images/smile.png` in the `src` attribute of the `<img>` element.

Note also that Teamgenik does not allow the `<img>` element to reference an external URL.

#### Hints

If you want to resize an image to fit the size of the image container, use the following class
tokens provided by Tailwind CSS:

* `object-cover`: resizes an image to cover its container
* `object-contain`: resizes an image to stay contained within its container
* `object-fill`: stretches an image to fit its container
* `object-scale-down`: display an image at its original size but scale it down to fit its
  container if necessary

For more information, see [Object Fit](https://tailwindcss.com/docs/object-fit) subsection of
the Tailwind CSS Documentation.

### Background images

You can embed `images/smile.png` as a background image for a `<div>` element by writing like this:

```html
<div class="bg-[url(../images/smile.png)]"></div>
```

Tailwind CSS will detect this `class` attribute and write the appropriate CSS fragment to
`dist/css/tailwind.css`.

Note that inside the parentheses is the relative path from `css/tailwind.css` to the image file.
Even if you embed `src/images/smile.png` into `src/pages/foo/bar.html`,
specify `../images/smile.png` instead of `../../images/smile.png` inside the parentheses
if you embed it as a background image.

#### Hints

If you want to adjust the rendering of a background image, use the following class
tokens provided by Tailwind CSS:

* `bg-center`: centers the background image on the background layer
* `bg-repeat`: repeats the background image both vertically and horizontally
* `bg-repeat-x`: repeats the background image horizontally
* `bg-repeat-y`: repeats the background image vertically
* `bg-cover`: scales the background image until it fills the background layer
* `bg-contain`: scales the background image to the outer edges without cropping or stretching

For more information, see [Background Position](https://tailwindcss.com/docs/background-position),
[Background Repeat](https://tailwindcss.com/docs/background-repeat) and
[Background Size](https://tailwindcss.com/docs/background-size) subsections of
the Tailwind CSS Documentation.

## Audios

Audio files are placed in the `src/audio` subdirectory under the working directory.

Teamgenik supports audio files in the following formats:

* AAC ('.m4a')
* MP3 ('.mp3')
* Ogg Vorbis (`.ogg`)
* WAV (`.wav`)

### `<audio>` element

You can embed a UI object to play an audio content with the `<audio>` element.

There are two ways to construct the `<audio>` element.

One is to specify the relative path to the audio file in the `src` attribute of the `<audio>`
element itself.

```html
<audio controls src="../audio/theme.mp3">
  <a href="../audio/theme.mp3">Download</a>
</audio>
```

The content of the `<audio>` element will be shown when thw browser does not support the `<audio>`
element.

The other is to place one or more `<source>` elements inside the `<audio>` element and specify
the relative path to the audio file in their `src` attribute.

```html
<audio controls>
  <source src="./audio/theme.ogg" type="audio/ogg">
  <source src="./audio/theme.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
```

Note that Teamgenik does not allow the `<audio>` and `<source>` elements to reference an external
URL.

## Layouts

### What is a layout

Typically, the pages of a website have a set of areas that share most of the same content:
header, sidebar, footer, etc.

Separating this set of areas from the page as a single template makes the website easier to manage.
We call this separated template a "layout".

### Adding a layout

Layouts are HTML files placed in the `src/layouts` subdirectory under the working directory.

A layout must satisfy the following three conditions:

1. There is only one top-level element.
2. The top-level element is a `<body>` element.
3. The top-level element contains only one `<tg-content>` element within its descendant elements.

The `<tg-content>` element indicates where in the layout the page will be inserted.

#### Example

`src/layouts/common.html`

```html
<body>
  <header>
    <div>Example</div>
  </header>
  <main>
    <tg-content></tg-content>
  </main>
  <footer>&copy; Example Inc. 2023</footer>
</body>
```

Note that you _cannot_ write `<tg-content />` instead of `<tg-content></tg-content>`.

### Applying this layout to a page

To apply this layout to a page, specify the name of the layout in the `tg-layout` attribute of the
top-level element of the page.

The name of the layout is the file name of the layout minus its extension (`.html`).
In this case, `common` is the name of the layout.

The top-level element of the page to which a layout is applied must be a `<tg-template>` element
rather than the `<body>` element.

#### Example

`src/pages/index.html`

```html
<tg-template tg-layout="common">
  <h1>Welcome!</h1>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</tg-template>
```

When the layout `common` shown in the previous example is applied to this page file,
the following HTML document is generated:

```html
<html>
  <head>
    ...
  </head>
  <body>
    <header>
      <div>Example</div>
    </header>
    <main>
      <h1>Welcome!</h1>
      <div class="bg-green-300 p-4">
        <p>Hello, world!</p>
      </div>
    </main>
    <footer>&copy; Example Inc. 2023</footer>
  </body>
</html>
```

### Embedding contents into slots within a layout

The `<tg-slot>` element is a place holder inside a layout that you can fill with a content
specified within a page.
A `name` attribute must be specified for the `<tg-slot>` element.

To insert content into a slot in a layout, place an element with the `tg-slot` attribute on the
page where the layout is to be applied.

The tag name of the element with the `tg-slot` attribute is meaningless and can be anything,
but `<div>` or `<span>` is recommended.

If you specify the name of the slot as the value of the `tg-slot` attribute,
the slot will be replaced with the element's content.

When page content is inserted into a `<tg-content>` element in a layout,
all elements with the `tg-slot` attribute are removed from the page content.

#### Example

`src/layouts/product.html`

```html
<body class="p-2">
  <tg-content></tg-content>
  <div class="border-2 border-black border-solid p-2">
    <tg-slot name="remarks"></tg-slot>
  </div>
  <div><tg-slot name="badges"></tg-slot></div>
</body>
```

`src/pages/product1.html`

```html
<tg-template tg-layout="product" tg-title="Product 1">
  <div>
    <h1>Product 1</h1>
    <p>Description</p>
  </div>
  <span tg-slot="remarks">This product is very fragile.</span>
  <span tg-slot="badges"><span>A</span><span>B</span></span>
</tg-template>
```

When the layout `product` is applied to the page `product1.html`,
the following HTML document is generated:

```html
<html>
  <head>
    ...
  </head>
  <body class="p-2">
    <div>
      <h1>Product 1</h1>
      <p>Description</p>
    </div>
    <div class="border-2 border-black border-solid p-2">
      This product is very fragile.
    </div>
    <div><span>A</span><span>B</span></div>
  </body>
</html>
```

### Fallback content of slot

If the content to be inserted into the slot is not defined, the content of the `<tg-slot>` element
is used as a fallback content.

#### Example

`src/layouts/message.html`

```html
<body class="p-2">
  <tg-content></tg-content>
  <div><tg-slot name="message">No message.</tg-slot></div>
</body>
```

`src/pages/home.html`

```html
<tg-template tg-layout="message" tg-title="Home">
  <h1>Home</h1>
</tg-template>
```

When the layout `message` is applied to the page `home.html`,
the following HTML document is generated:

```html
<html>
  <head>
    ...
  </head>
  <body class="p-2">
    <h1>Home</h1>
    <div>No message.</div>
  </body>
</html>
```

### `tg-if-complete` attribute

When an element in a layout has the `tg-if-complete` attribute, it is deleted unless the content
to be inserted is defined for all slots in that element.

If no single slot exists in an element with the `tg-if-complete` attribute, the element is
retained.

#### Example

`src/layouts/message.html`

```html
<body class="p-2">
  <tg-content></tg-content>
  <div tg-if-complete>
    <div>To: <tg-slot name="name"></tg-slot></div>
    <div><tg-slot name="message"></tg-slot></div>
  </div>
</body>
```

`src/pages/home.html`

```html
<tg-template tg-layout="message" tg-title="Home">
  <h1>Home</h1>
  <span tg-slot="name">Alice</span>
</tg-template>
```

When the layout `message` is applied to the page `home.html`,
the following HTML document is generated:

```html
<html>
  <head>
    ...
  </head>
  <body class="p-2">
    <h1>Home</h1>
  </body>
</html>
```

## Components

### Component files

A _components_ is a template file that can be embedded in pages, articles and layouts.
However, embedding a component in another is not allowed.

Components are live in the `src/components` subdirectory of the working directory.

A component must have only one top-level element. The following is an example of a correct
component:

`src/components/smile.html`

```html
<span class="inline-block border-solid border-2 border-black rounded p-2">
  <i class="fas fa-smile"></i>
</span>
```

The following example is incorrect for a component because it has multiple top-level elements:

`src/components/rgb.html`

```html
<span class="text-red-500">R</span>
<span class="text-green-500">G</span>
<span class="text-bluer-500">B</span>
```

### Placement of components

To place a component in a page, article, or layout, specify its name in the `tg-component`
attribute of the element at the location where you want to place it.

#### Example

```html
<p>
  <span tg-component="smile"></span>
  How are you?
</p>
```

### Slots

Like layouts, slots can be placed inside components. The method of embedding content in the slots
within a component is similar to that of a layout.

#### Example

`src/components/blog_item.html`

```html
<div class="py-2">
  <h3 class="font-bold text-lg m-2">
    <tg-slot name="title"></tg-slot>
  </h3>
  <div>
    <tg-slot name="body"></tg-slot>
  </div>
  <div tg-if-complete class="text-right">
    <tg-slot name="date"></tg-slot>
  </div>
</div>
```

`src/pages/hello.html`

```html
<div tg-layout="home" tg-component="blog_item" class="bg-gray-100 py-2">
  <span tg-slot="title">Greeting</span>
  <span tg-slot="body">
    <p>Hello.</p>
  </span>
  <span tg-slot="date">2022-12-31</span>
</div>
```

## Articles

### What is an article

Like a page, an _article_ is a template file used to generate an HTML document.

Articles are placed in the `src/articles` subdirectory under the working directory.
It is possible to create a subdirectory under the `src/articles` directory and place articles
under it.

The articles will be converted into complete HTML documents and written to the `dist/articles`
directory.

For example, `src/articles/tech.html` is converted to `dist/articles/tech.html` and
`src/articles/blog/happy_new_year.html` is converted to `dist/articles/blog/happy_new_year.html`.

Articles and pages have exactly the same characteristics in the following respects:

* A layout can be applied to them.
* Images and audios can be embedded in them.
* The content of the `<head>` element is automatically generated in the manner described
  [below](#managing-the-contents-of-the-head-element).

### Embedding an article in a page

Like components, articles can be embedded in pages.
Place elements with the `tg-article` attribute where you want to embed articles as follows:

```html
<tg-template tg-layout="home">
  <main>
    <h1>Our Recent Articles</h1>
    <div tg-article="blog/got_a_new_gadget"></div>
    <div tg-article="blog/happy_new_year"></div>
  </main>
</tg-template>
```

The value of the `tg-article` attribute must be the name of the article file without the
extension (`.html`).

Unlike components, articles can only be embedded into a page.
Articles cannot be embedded in other articles or layouts.

### Embedding articles in a page

The `tg-articles` attribute can be used to embed multiple articles into a page.

```html
<tg-template tg-layout="home">
  <main>
    <h1>Our Proposals</h1>
    <div tg-articles="/proposals/*"></div>
  </main>
</tg-template>
```

The above example embeds all articles in the `src/articles/proposals` directory under the
`<h1>` element.

By default, articles are sorted in ascending (alphabetically) order by file name.
To sort articles in any order, add a `tg-index` attribute to each article:

```html
<article tg-index="000">
  ...
</article>
```

Then, combine the `tg-order-by` attribute with the `tg-articles` attribute.

```html
<tg-template tg-layout="home">
  <main>
    <h1>Our Proposals</h1>
    <div tg-articles="/proposals/*" tg-order-by="index:asc"></div>
  </main>
</tg-template>
```

The value of the `tg-order-by` attribute is a string separated by a single colon.
In the current specification, the left side of the colon is always `"index"`.
The right side of the colon is always `"asc"` or `"desc"`, where `"asc"` means "ascending order"
and `"desc"` means "descending order".

Note that the value of the `tg-index` attribute is interpreted as a string;
`"123"` is evaluated as a value greater than `"009"`, but
`"123"` is evaluated as a value _less_ than `"9"`

TODO: Add `tg-limit` and `tg-offset` attributes.

### Generating a link list to articles

The `tg-links` attribute can be used to embed links to articles in any template
(page, layout, component, article).

```html
<tg-template tg-layout="home">
  <main>
    <h1>Our Proposals</h1>
    <ul>
      <li tg-links="/proposals/*">
        <a href="#">
          <tg-slot name="title">No name</tg-slot>
          <span class="text-sm" tg-if-complete>
            (<tg-slot name="date"></tg-slot>)
          </span>
        </a>
      </li>
    </ul>
  </main>
</tg-template>
```

The content of an element with the `tg-links` attribute contains one or more `<a>` elements and
zero or more `<tg-slot>` elements.

The `href` attribute of the `<a>` element is replaced by the URL of the article, and the
`<tg-slot>` element is replaced by the content defined by the `tg-slot` attribute in the article.

Inside elements with the `tg-links` attribute, the `tg-if-complete` attribute works the same way
as inside components.
That is, elements with the `tg-if-complete` attribute will be removed from the output
unless content is provided for all `tg-slot` elements within it.

By default, articles are sorted in ascending (alphabetically) order by file name.
To sort articles in any order, add a `tg-index` attribute to each article:

```html
<article tg-index="000">
  ...
</article>
```

Then, combine the `tg-order-by` attribute with the `tg-links` attribute.

```html
    <li tg-links="/proposals/*" tg-order-by="index:asc">
      ...
    </li>
```

## Tags

### Filtering articles by tags

You may use _tags_ to categorize your articles.

To attach tags to an article, specify their names in the `tg-tags` attribute, separated by commas.

```html
<article tg-tags="travel,europe">
  ...
</article>
```

You can use the `tg-filter` attribute to filter articles embedded on the page:

```html
<tg-template tg-layout="home">
  <main>
    <h1>Articles (tag:travel)</h1>
    <div tg-articles="/blog/*" tg-filter="tag:travel"></div>
  </main>
</tg-template>
```

The value of the `tg-filter` attribute is a string separated by a single colon.
In the current specification, the left side of the colon is always `"tag"` and
the right side of the colon is a tag name.

You can also filter the list of links to articles using the `tg-filter` attribute:

```html
<tg-template tg-layout="home">
  <main>
    <h1>Articles (tag:travel)</h1>
    <ul>
      <li tg-articles="/blog/*" tg-filter="tag:travel">
        <a href="#">
          <tg-slot name="title">No name</tg-slot>
        </a>
      </li>
    </ul>
  </main>
</tg-template>
```

Note that you cannot assign tags to a page.

### Generating tag pages

TODO: Implement this functionality.

## Tailwind CSS

## Alpine.js

## Managing the Contents of the `<head>` Element

### `<title>` element

The content of the `<title>` element is determined by the following rules:

1. The value of the `tg-title` attribute of the root element of the page template,
   if one is specified.
2. The text content of the first `<h1>` element, if the page template contains one.
3. The text content of the first `<h2>` element, if the page template contains one.
4. The text content of the first `<h3>` element, if the page template contains one.
5. The text content of the first `<h4>` element, if the page template contains one.
6. The text content of the first `<h5>` element, if the page template contains one.
7. The text content of the first `<h6>` element, if the page template contains one.
8. `"No Title"`

#### Examples

The title of the HTML document generated from the page template below will be "Greeting":

```html
<body tg-title="Greeting">
  <h1>Welcome!</h1>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

The string "Welcome!" is extracted as the title from the following template:

```html
<body>
  <h1>Welcome!</h1>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

If the next page template is used, the page title will be "No Title":

```html
<body>
  <div class="text-2xl">Welcome!</div>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

#### Note

If the `tg-component` attribute is set on the root element of the page template,
the title text is extracted from that component's template.
However, if the `tg-title` attribute is set on the root element of the page template,
that value takes precedence.

### `<meta>` elements

Not yet implemented.

### `<link>` elements

Not yet implemented.

#### Note

The following link element are always inserted within the head element.

```html
<link href="/css/tailwind.css" rel="stylesheet">
```

A link element that refers to another stylesheet cannot be inserted within the head element.

### `<script>` elements

The `<script>` elements are managed by tgweb. Users are not allowed to insert their own
`<script>` elements into the `<head>` or `<body>` elements.

Users can use [Alpine.js](https://alpinejs.dev/) to dynamically change HTML documents.

## License

**tgweb** is [MIT licensed](./LICENSE).

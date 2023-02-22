# tgweb - Teamgenik Website Builder Offline Tool

## Table of Contents

* [Requirements](#requirements)
* [Getting Started](#getting-started)
* [Directory Structure](#directory-structure)
* [Managing multiple websites](#managing-multiple-websites)
* [Pages](#pages)
* [Front Matter](#front-matter)
* [Images](#images)
* [Audios](#audios)
* [Layouts](#layouts)
* [Wrappers](#wrapper)
* [Components](#components)
* [Articles](#articles)
* [Tags](#tags)
* [Links](#links)
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

The first thing to do is create a _working directory_ for **tgweb**. Its location can be anywhere.
As an example, let's say you create a subdirectory called `my_site` under your home directory
and choose that as your working directory:

```
mkdir -p ~/my_site
```

Then go in and install **tgweb** with `npm`:

```bash
cd my_site
npm install tgweb
```

In your working directory you will have a directory named `node_modules`, where you will find
**tgweb** and its dependencies installed.

### Initialization

To begin creating a website using **tgweb**, run the following command in your working directory:

```bash
npx tgweb-init
```

This command creates two subdirectories, `src` and `dist`, and several files.

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
npx tgweb-server
```

Then, open `http://localhost:3000` with your browser.

Make sure that the text "Hello, world!" appears in the red background area.

The class tokens `bg-red-300` and `p-4` specified in the `class` attribute of the `<div>`
element are provided by [Tailwind CSS](https://tailwindcss.com/).

The token `bg-red-300` specifies light red (`#fca5a5`) as the background color of `<div>` element,
and the token `p-4` sets the padding of the `<div>` element to scale 4 (16px/1rem).

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

Running `npx tgweb-init` from the command line creates a directory structure with the
following elements:

```plain
.
├── dist
├── node_modules
├── src
│   ├── articles
│   ├── audios
│   ├── components
│   ├── images
│   ├── layouts
│   ├── pages
│   ├── tags
│   └── site.yml
├── package-lock.json
├── package.json
├── tailwind.config.js
└── tailwind.css
```

Please note the following:

* **tgweb** scans the contents of the `src` directory, generates HTML files and writes them into
  the `dist` directory.
* **tgweb** scans the contents of the `src` directory, copies image and audio files to the `dist`
  directory.
* Tailwind CSS scans the HTML files of the `dist` directory, generates a CSS file `tailwind.css`
  on the `dist/css` directory.
* It makes no sense for the user to rewrite the contents of the `dist` directory.
* Users are not allowed to change `tailwind.config.js` and `tailwind.css`.
* Users are not allowed to add their own CSS files to the website.
* Users are not allowed to add their own javascript files to the website.

## Managing multiple websites

### Installation and initialization

In the [Getting Started](#getting-started) section, we installed tgweb in a working directory
and built a single website there.
However, it is possible to manage multiple websites under a working directory.

As an example, let's assume the `web` directory under the home directory is the working directory.
We will proceed in the same order as when building a single website up to the point where we
install tgweb with npm.

The procedure is the same as when building a single website, up to the point where tgweb is
installed with `npm`:

```bash
mkdir ~/web
cd web
npm install tgweb
```

Now choose a subdirectory name for the first website you will create in this working directory.
Let's call it `site_0` as an example. Then run the following command:

```bash
npx tgweb-init site_0
```

This command creates a `sites` subdirectory, and then a `site_0` subdirectory under that. It then
creates two subdirectories, `src` and `dist`, and some files under the `site_0` subdirectory.

When a working directory has the `sites` subdirectory, we say that it has a
_multi-site composition_. Conversely, when a working directory does not have the `sites`
subdirectory, we say that the it has a _single-site composition_.

### Add content and start the tgweb server

Just as described in the [Add content](#add-content) subsection, create a file named
`index.html` under the `sites/site_0/src/pages` subdirectory.

Then, you can start the tgweb server by executing the following command:

```bash
npx tgweb-server site_0
```

Thus, by specifying a subdirectory name as the argument to the `npx tgweb-init` and
`npx tgweb-server` commands, multiple websites can be managed under a single working directory.

If this approach is adopted, the structure of the working directory will look like this:

```
.
├── node_modules
├── package-lock.json
├── package.json
└── sites
    ├── site_0
    │   ├── dist
    │   ├── src
    │   │   ├── articles
    │   │   ├── audios
    │   │   ├── components
    │   │   ├── images
    │   │   ├── layouts
    │   │   ├── pages
    │   │   └── tags
    │   ├── tailwind.config.js
    │   └── tailwind.css
    └── site_1
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

### Changing the working directory composition

Switching to a multi-site composition

To make a working directory that has a single-site composition to have a multi-site one,
execute the following commands replacing `site_0` with any subdirectory name:

```bash
mkdir -p sites/site_0
mv dist src tailwind.* sites/site_0
```

Conversely, to make a working directory that has a multi-site composition to have a single-site
one, execute the following commands:

```bash
mv sites/site_0/* .
rm -rf sites
```

Note that if there are multiple subdirectories in the `sites` directory, this operation will
delete all subdirectories except for `site_0`.

## Pages

### What is a page

In **tgweb**, the HTML documents that make up a website are generated from a combination of
template files. A _page_ is a type of such template file.

Non-page templates include layouts, wrappers, articles, and components, which
are described in turn in the following sections.

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
The top-level element of a normal HTML document is the `<html>` element, under which are
the `<head>` element and the `<body>` element.

The pages will be converted into a complete HTML document and written to the `dist` directory.

For example, `src/pages/index.html` is converted to `dist/index.html` and
`src/pages/shops/new_york.html` is converted to `dist/shops/new_york.html`.

The content of the `<head>` element is automatically generated.
See [below](#managing-the-contents-of-the-head-element) for details.

## Front Matter

### Front matter block

When a template begins with a line that consists only of `---` and there is another such line in
the template, the area enclosed by these two lines is called the _front matter block_.
In this area you can set

In this area you can give values to a set of properties.
This combination of properties and values is called _front matter_.

Each line of the front matter block contains the name and value of a property, separated by a
colon and space ("`: `").

The following example sets the property `title` to the "Our Mission".

```
title: Our Mission
```

Normally, values written to the right of a colon and space are interpreted as strings.

However, values containing numbers or symbols might be interpreted as something other than
strings or cause interpretation errors. Enclose such values in single or double quotes.

```
title: "You can't miss it"
```

Also, exceptionally, `true`, `false`, `yes`, `no` and their uppercase versions
(`True`, `FALSE`, etc.) are interpreted as boolean values.

To have these values interpreted as strings, enclose them in single or double quotes.

### Predefined properties

There are some predefined properties that have special meaning.

* `scheme`: The scheme of the URL of the HTML document. It must be `http` or `https`.
   Default: `localhost`.
* `host`: The host name of the URL of the HTML document. Default: `localhost`.
* `port`: The port number of the URL of the HTML document. Default: 3000.
* `url`: The URL of the HTML document.
* `title`: The title of the HTML document.
* `layout`: The name of layout to be applied to the template. See [Layouts](#layouts).

Normally, it is not necessary to specify values for the `scheme`, `host`, and `port` properties.
The values of these properties will be set appropriately when the website is published on
Teamgenik.
The value of the `url` property is generated from these properties and the path to the page or
article. Its value is readonly.

### Embedding property values in a template

The value of a predefined property can be embedded into a template by the `<tg-prop>` element.

```html
---
title: Our Mission
---
<body>
  <h1 class="text-2xl font-bold">
    <tg-prop name="title"></tg-prop>
  </h1>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

### Custom properties

Properties whose names begin with `data-` are called _custom properties_ and can be freely
defined by the website author.

The value of a custom property can be embedded into a template by the `<tg-data>` element.

```html
---
title: Our Mission
data-message: "Hello, world!"
---
<body>
  <h1 class="text-2xl font-bold">
    <tg-prop name="title"></tg-prop>
  </h1>
  <div class="bg-green-300 p-4">
    <p><tg-data name="message"></tg-data></p>
  </div>
</body>
```

### Defining an alias to a set of class tokens

A property whose name begins with `class-` can be used to give an alias to a set of class tokens.
To expand an alias defined as such in the value of a `class` attribute, use the `${...} `
notation.

```html
---
class-blue-square: "w-24 h-24 md:w-48 md:h-48 bg-blue-500 rounded-xl p-8 m-4"
---
<body>
  <div class="${blue-square}">
    Hello, world!
  </div>
</body>
```

Expanding the alias contained in the above template, we get the following:

```html
<body>
  <div class="w-24 h-24 md:w-48 md:h-48 bg-blue-500 rounded-xl p-8 m-4">
    Hello, world!
  </div>
</body>
```

Using the `-` symbol, a very long sequence of class tokens can be written over several lines:

```html
---
class-card:
  - "bg-white dark:bg-slate-900 rounded-lg px-6 py-8"
  - "ring-1 ring-slate-900/5 shadow-xl"
---
<body>
  <div class="${card}">
    Hello, world!
  </div>
</body>
```

Note that the `-` symbol must be preceded by two spaces.

### Site properties

Creating a file named `site.yml` in the `src` directory allows you to set values for properties
at the site level. The values set here will be the default values for properties set in the
front matter of each page.

`src/site.yml`

```yaml
title: No title
layout: common
custom-current-year: "2023"
```

### `${...}` notation

You can embed the value of a property into the value of another property using
`${...}` notation:

```yaml
data-x: ABC
data-y: "${x} DEF"
```

Note that the value of the property to be embedded is the value before `${...}` is expanded.

```yaml
data-x: ABC
data-y: "${x} DEF"
data-z: "${y} GHI"
```

The above sets `data-z` property to the string `"${x} DEF GHI"` instead of `"ABC DEF GHI"`.

### `%{...}` notation

You can embed the URL of an image or audio file into the `content` attribute of a `<meta>`
element using `%{...}` notation:

```yaml
data-icon-url: "%{images/icons/default.png}"
data-theme-url: "%{audios/our_theme.mp3}"
```

See [<meta> elements](#meta-elements) for specific examples of its use.

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
<img src="/images/smile.png" alt="Smile face">
```

You do not need to write the `width` and `height` attributes in the `<img>` tag,
because Teamgenik will automatically specify them for you.

Note that the value of the `src` attribute is the _absolute_ path of the image file.
When your website is published on Teamgenik, the values of the `src` attribute of the `<img>`
elements will be converted appropriately.

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

One is to specify the _absolute_ path of the audio file in the `src` attribute of the `<audio>`
element itself.

```html
<audio controls src="/audios/theme.mp3">
  <a href="/audios/theme.mp3">Download</a>
</audio>
```

The content of the `<audio>` element will be shown when thw browser does not support the `<audio>`
element.

The other is to place one or more `<source>` elements inside the `<audio>` element and specify
the absolute path of the audio file in their `src` attribute.

```html
<audio controls>
  <source src="/audios/theme.ogg" type="audio/ogg">
  <source src="/audios/theme.mp3" type="audio/mpeg">
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

### Applying a layout to a page

To apply this layout to a page, specify the name of the layout in the `layout` property of the
the front matter of the page.

The name of the layout is the file name of the layout minus its extension (`.html`).
In this case, `common` is the name of the layout.

#### Example

`src/pages/index.html`

```html
---
layout: common
---
<h1>Welcome!</h1>
<div class="bg-green-300 p-4">
  <p>Hello, world!</p>
</div>
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

### Embedding property values in layouts

The values of the properties set in the front matter of the page can be embedded in the layout
using the `<tg-prop>` element.

#### Example

`src/layouts/common.html`

```html
<body>
  <header>
    <div>Example</div>
  </header>
  <main>
    <h1 class="text-3xl"><tg-prop name="title"></tg-prop></h1>
    <tg-content></tg-content>
  </main>
  <footer>&copy; Example Inc. <tg-prop name="year"></tg-prop></footer>
</body>
```

`src/pages/greeting.html`

```html
---
layout: common
title: Greeting
---
<h1>Welcome!</h1>
<div class="bg-green-300 p-4">
  <p>Hello, world!</p>
</div>
```

### Slots and inserts

The `<tg-slot>` element is a place holder inside a layout that you can fill with a content
specified within a page.
A `name` attribute must be specified for the `<tg-slot>` element.

To embed content into a slot in a layout, place a `<tg-insert>` element on the page where the
layout is to be applied.

If you specify the name of the slot as the value of the `name` property of  `<tg-insert>` element,
the slot will be replaced with the element's content.

When page content is inserted into a `<tg-content>` element in a layout,
all `<tg-insert>` elements are removed from the page content.

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
---
layout: product
title: Product 1
---
<div>
  <h1>Product 1</h1>
  <p>Description</p>
</div>
<tg-insert name="remarks">This product is very <em>fragile</em>.</tg-insert>
<tg-insert name="badges"><span>A</span><span>B</span></tg-insert>
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
      This product is very <em>fragile</em>.
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
---
layout: message
title: Home
---
<h1>Home</h1>
<p>Hello, world!</p>
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
    <p>Hello, world!</p>
    <div>No message.</div>
  </body>
</html>
```

### `<tg-if-complete>`

Normally, the `<tg-if-complete>` element in a layout is simply replaced with its content.
However, if the following two conditions are not met, the entire element is deleted:

* The property values to be inserted for all `<tg-prop>` elements within it are defined.
* The contents to be inserted for all `<tg-slot>` elements within it are defined.

#### Example

`src/layouts/message.html`

```html
<body class="p-2">
  <tg-content></tg-content>
  <tg-if-complete>
    <hr class="h-px my-8 bg-gray-200 border-0">
    <div class="bg-gray-800 text-white p-4">To: <tg-prop name="custom-name"></tg-prop></div>
    <div class="bg-gray-200 p-4"><tg-slot name="message"></tg-slot></div>
  </tg-if-complete>
</body>
```

`src/pages/home.html`

```html
---
custom-name: Alice
---
<h1>Home</h1>
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

## Wrappers

### What is a wrapper

A wrapper is a template that exists at a level between layouts and pages.

Wrappers allow you to apply a common style and add common elements to a group of pages.

### Adding a wrapper

The file name of a wrapper is always `_wrapper.html` and it is placed directly under the
`src/pages` subdirectory of working directory or its descendant directories.

A wrapper placed in a directory applies to all pages in that directory.

If the wrapper does not exist in a directory, the first wrapper found in the directory hierarchy
from the bottom up becomes the wrapper for that directory.

For example, if `src/pages/foo/_wrapper.html` exists and `_wrapper.html` does not exist in either
the `src/pages/foo/bar` directory or the `src/pages/foo/bar/baz` directory, then
`src/pages/foo/_wrapper.html` will be the wrapper for `src/pages/foo/bar/baz` directory.

Basically, the wrapper is written the same way as that of the layout.
The `<tg-content>` element indicates where in the wrapper the page will be inserted.

#### Example

`src/pages/_wrapper.html`

```html
<div class="[&_p]:mt-4">
  <tg-content></tg-content>
</div>
```

The `class` attribute value `[&_p]:mt-4` sets the `margin-top` of all `<p>` elements within this
wrapper to scale 4 (16px/1rem). For the notation `[&_p]`, see
[Using arbitrary variants](https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants).

### Applying a wrapper to a page

As already mentioned, a wrapper placed in a directory applies to all pages in that directory.
The only thing you should do is take the `layout` attribute off the page.

`src/pages/index.html`

```html
---
layout: common
---
<h1>Welcome!</h1>
<div class="bg-green-300 p-4">
  <p>Hello, world!</p>
</div>
```

### Wrapper properties

The value of a property set in the wrapper's front matter becomes the default value of the
property for the page to which that wrapper is applied.

Wrapper property values take precedence over site property values.

#### Example

`src/pages/_wrapper.html`

```html
---
layout: common
---
<div class="[&_p]:mt-4">
  <tg-content></tg-content>
</div>
```

`src/pages/index.html`

```html
<h1>Welcome!</h1>
<div class="bg-green-300 p-4">
  <p>Hello, world!</p>
</div>
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

### Embedding components

To embed a component into a page, article, or layout, add a `<tg-component>` element at the
location where you want to place it and specify its name in the `name` attribute.

#### Example

```html
<p>
  <tg-component name="smile"></tg-component>
  How are you?
</p>
```

### Slots

Like layouts, slots can be placed inside components. The method of embedding content in the slots
within a component is similar to that of a layout.

#### Example

`src/components/blog_item.html`

```html
<h3 class="font-bold text-lg m-2">
  <tg-slot name="title"></tg-slot>
</h3>
<div>
  <tg-slot name="body"></tg-slot>
</div>
<tg-if-complete>
  <divclass="text-right">
    <tg-slot name="date"></tg-slot>
  </div>
</tg-if-complete>
```

`src/pages/hello.html`

```html
---
layout: home
---
<main class="bg-gray-100 py-2">
  <tg-component name="blog_item">
    <tg-insert name="title">Greeting</tg-insert>
    <tg-insert name="body">
      <p>Hello.</p>
    </tg-insert>
    <tg-insert name="date">2022-12-31</tg-insert>
  </tg-component>
</main>
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
Place `<tg-article>` elements where you want to embed articles as follows:

```html
---
layout: home
---
<main>
  <h1>Our Recent Articles</h1>
  <tg-article name="blog/got_a_gadget"></tg-article>
  <tg-article name="blog/happy_new_year"></tg-article>
</main>
```

The value of the `name` attribute of the `<tg-article>` element must be the name of the
article file without the extension (`.html`).

Unlike components, articles can only be embedded into a page.
Articles cannot be embedded in other articles or layouts.

### Embedding articles in a page

The `<tg-articles>` element can be used to embed multiple articles into a page.

```html
---
layout: home
---
<main>
  <h1>Our Proposals</h1>
  <tg-articles pattern="/proposals/*"></tg-articles>
</main>
```

The above example embeds all articles in the `src/articles/proposals` directory under the
`<h1>` element.

By default, articles are sorted in ascending (alphabetically) order by file name.

### Sorting articles by their title

To sort articles in by their title, set the `order-by` attribute of the `<tg-articles>` element
to `"title:asc"` or `"title:desc"`:

```html
---
layout: home
---
<main>
  <h1>Our Proposals</h1>
  <tg-articles pattern="/proposals/*" order-by="title:asc"></tg-articles>
</main>
```

The value of the `order-by` attribute is a string separated by a single colon.
The left side of the colon must be `"title"` or `"index"`.
The right side of the colon must be `"asc"` or `"desc"`, where `"asc"` means "ascending order"
and `"desc"` means "descending order".

### Sorting articles in an arbitrary order

To sort articles in an arbitrary order, set the `index` property to an integer value for each
article:

```html
---
index: 123
---
<article>
  ...
</article>
```

Then, set the `order-by` attribute of the `<tg-articles>` element to `"index:asc"` or
`"index:desc"`:

```html
---
layout: home
---
<main>
  <h1>Our Proposals</h1>
  <tg-articles pattern="/proposals/*" order-by="index:asc"></tg-articles>
</main>
```

Articles without the `index` property are ordered by file name after those with the `index`
property.

### Generating a link list to articles

The `<tg-links>` element can be used to embed links to articles in any template
(page, layout, component, article).

```html
---
layout: home
---
<main>
  <h1>Our Proposals</h1>
  <ul>
    <tg-links pattern="/proposals/*">
      <li>
        <a href="#">
          <tg-prop name="title"></tg-prop>
          <tg-if-complete>
            <span class="text-sm">
              (<tg-slot name="date"></tg-slot>)
            </span>
          </tg-if-complete>
        </a>
      </li>
    </tg-links>
  </ul>
</main>
```

The `<tg-links>` element contains one or more `<a>` elements and
zero or more `<tg-prop>`, `<tg-data>` and `<tg-slot>` elements.

The values of `href` attribute of `<a>` are replaced by the URL of the article.
The `<tg-prop>` and `<tg-data>` elements are replaced by the value of a property of the article
to be embedded.
The `<tg-slot>` elements are replaced by the content of a `<tg-insert>` element defined in the
article to be embedded.

Inside the `<tg-links>` element, `<tg-if-complete>` elements work the same way
as inside components.
That is, a `<tg-if-complete>` element will be removed from the output
unless a value or content is provided for all `<tg-prop>`, `<tg-data>`, and `<tg-slot>` elements
within it.

By default, articles are sorted in ascending (alphabetically) order by file name.
To sort articles by their title, set  the `order-by` attribute of the `<tg-links>` element to
`"title:asc"` or `"title:desc"`:

```html
    <tg-links pattern="/proposals/*" order-by="title:asc">
      <li>
        ...
      </li>
    </tg-links>
```

See [Sorting articles by their title](#sorting-articles-by-their-title) on how to　write values
to be set in the `order-by` attribute.

To sort articles in an arbitrary order, add a `tg-index` attribute to each article:

```html
---
layout: home
index 123
---
<article>
  ...
</article>
```

Then, specify the `order-by` attribute of the `<tg-links>` element.

```html
    <tg-links pattern="/proposals/*" order-by="index:asc">
      <li>
        ...
      </li>
    </tg-links>
```

Note that the current specification does not allow a `<tg-component>` element to be placed within
a `<tg-links>` element.

TODO: allow this.

### Filtering articles by tags

You may use _tags_ to categorize your articles.

To attach tags to an article, specify their names in the `tags` attribute as an array
using `[...]` notation:

```html
---
tags: [travel, europe]
---
<article>
  ...
</article>
```

To attach a single tag to an article, the value of the `tags` attribute may be specified as a
string:

```html
---
tags: anime
---
<article>
  ...
</article>
```

You can use the `filter` attribute to filter articles embedded on the page:

```html
---
layout: home
---
<main>
  <h1>Articles (tag:travel)</h1>
  <tg-articles pattern="/blog/*" filter="tag:travel"></tg-articles>
</main>
```

The value of the `filter` attribute is a string separated by a single colon.
In the current specification, the left side of the colon is always `"tag"` and
the right side of the colon is a tag name.

You can also filter the list of links to articles using the `filter` attribute:

```html
---
layout: home
---
<main>
  <h1>Articles (tag:travel)</h1>
  <ul>
    <tg-links pattern="/blog/*" filter="tag:travel">
      <li>
        <a href="#">
          <tg-slot name="title"></tg-slot>
        </a>
      </li>
    </tg-links>
  </ul>
</main>
```

Note that you cannot assign tags to a page.

### Generating tag pages

TODO: Implement this functionality.

## Links

### Links within the website

When linking to a page within your website using the `<a>` element, specify the _absolute_ path to
the page in its `href` attribute:

```html
<nav>
  <a href="/articles/goal">Our Goal</a>
  <a href="/articles/about">About Us</a>
</nav>
```

When your website is published on Teamgenik, the values of the `href` attribute of the `<a>`
elements in it will be converted appropriately.

### `<tg-link>`, `<tg-if-current>` and `<tg-label>`

The `<tg-link>` is a special element used to conditionally cause the `<a>` element to appear.
Basically, the content of this element is just rendered as it is.
If there is an `<a>` element with a `href` attribute of `"#"` inside the link element, the `href`
attribute of the `<tg-link>` element is set to the value of the `href` attribute of that `<a>`
element.

The following code is rendered as `<a href="/articles/goal">Our Goal</a>`:

```html
<tg-link href="/articles/goal.html">
  <a href="#">Our Goal</a>
</tg-link>
```

However, when an article with the path `/articles/goal.html` contains the above code, this part is
removed from the generated HTML document.

Zero or one `<tg-if-current>` element may be placed inside the `<tg-link>` element.
The content of the `<tg-if-current>` element is only rendered if the value of the `href`
attribute of the `<tg-link>` element matches the path of the HTML document that is being generated.

The following code is rendered as `<span class="font-bold">Our Goal</span>` when it appears in
an article with the path `/articles/goal.html`.

```html
<tg-link href="/articles/goal.html">
  <a href="#">Our Goal</a>
  <tg-if-current>
    <span class="font-bold">Our Goal</span>
  </tg-if-current>
</tg-link>
```

The `<tg-label>` element can be used to remove duplication from the above code.

```html
<tg-link href="/articles/goal.html" label="Our Goal">
  <a href="#"><tg-label></tg-label></a>
  <tg-if-current>
    <span class="font-bold"><tg-label></tg-label></span>
  </tg-if-current>
</tg-link>
```

This element is replaced by the value specified in the `label` attribute of the `<tg-link>`
element.

#### Example

`src/components/nav.html`

```html
<nav>
  <tg-link href="/articles/goal.html" label="Our Goal">
    <a href="#" class="underline text-blue-500"><tg-label></tg-label></a>
    <tg-if-current>
      <span class="font-bold"><tg-label></tg-label></span>
    </tg-if-current>
  </tg-link>
  <tg-link href="/articles/about.html" label="About Us">
    <a href="#" class="underline text-blue-500"><tg-label></tg-label></a>
    <tg-if-current>
      <span class="font-bold"><tg-label></tg-label></span>
    </tg-if-current>
  </tg-link>
</nav>
```

### link components

A component whose top-level element is the `<tg-link>` element is called a _link component_.

Normal components are embedded by the `<tg-component>` element, while link components are
embedded by the `<tg-link>` element with the `component` attribute.

The following is an example of a link component.

`src/components/nav_link.html`

```html
<tg-link>
  <a href="#" class="underline text-blue-500"><tg-label></tg-label></a>
  <tg-if-current>
    <span class="font-bold"><tg-label></tg-label></span>
  </tg-if-current>
</tg-link>
```

Note that the top-level `<tg-link>` element does not have `href` and `label` attributes.

This link component can be embedded as follows:

`src/components/nav.html`

```html
<nav>
  <tg-link component="nav_link" href="/articles/goal.html" label="Our Goal"></tg-link>
  <tg-link component="nav_link" href="/articles/about.html" label="About Us"></tg-link>
</nav>
```

The values of `href` and `label` attributes are _passed_ to the link component.

### `<tg-link>` elements within the `<tg-links`> element

The `<tg-link>` elements can be placed within the `<tg-links`> element:

```html
<tg-links pattern="/proposals/*" order-by="index:asc">
  <li>
    <tg-link>
      <a href="#" class="underline text-blue-500">
        <tg-slot name="title"></tg-slot>
      </a>
      <tg-if-current>
        <span class="font-bold">
          <tg-slot name="title"></tg-slot>
        </span>
      </tg-if-current>
    </tg-link>
  </li>
</tg-links>
```

In this case, the `<tg-link>` has no attributes and `<tg-label>` elements cannot be used inside it.
You should use `<tg-slot`> elements to compose the content of the `<a>` and other elements.

## Tailwind CSS

## Alpine.js

## Managing the Contents of the `<head>` Element

### `<title>` element

The content of the `<title>` element is determined from the (page or article) template
by the following rules:

1. The value of the `title` property if available
2. The text content of the first `<h1>` element if available
3. The text content of the first `<h2>` element if available
4. The text content of the first `<h3>` element if available
5. The text content of the first `<h4>` element if available
6. The text content of the first `<h5>` element if available
7. The text content of the first `<h6>` element if available
8. `"No Title"`

#### Examples

The title of the HTML document generated from the template below will be "Greeting":

```html
---
title: Greeting
---
<body>
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

If the next template is rendered as an HTML document, its title will be "No Title":

```html
<body>
  <div class="text-2xl">Welcome!</div>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

### `<meta>` elements

The `<meta>` elements in the `<head>` element are generated by the values of properties whose
names begin with `meta-`, `http-equiv-`, `og-`, or `property-`.

Note that the `<head>` element of the generated HTML document always contains a
`<meta charset="utf-8">` element.

#### `meta-*`

You can generate a `<meta>` element with a `name` attribute by setting the value to a property
whose name begins with `meta-`:

```yaml
meta-viewport: "width=device-width, initial-scale=1"
meta-theme-color: "#2da0a8"
meta-description: Description
meta-robots: "index,follow"
meta-generator: Teamgenik
```

Setting the values of the properties as above will produce the following `<meta>` elements:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#2da0a8">
<meta name="description" content="Description">
<meta name="robots" content="index,follow">
<meta name="googlebot" content="index,follow">
<meta name="googlebot" content="notranslate">
<meta name="generator" content="Teamgenik">
```

If you want to generate multiple `<meta>` elements with the same name, write as follows:

```yaml
meta-googlebot:
- "index,follow"
- notranslate
```

The above will generate the following `<meta>` elements

```html
<meta name="googlebot" content="index,follow">
<meta name="googlebot" content="notranslate">
```

#### `http-equiv-*`

You can generate a `<meta>` element with a `http-equiv` attribute by setting the value to a
property whose name begins with `http-equiv-`:

```yaml
http-equiv-content-security-policy: "default-src 'self'"
http-equiv-x-dns-prefetch-control: "off"
```

The above settings will generate the following `<meta>` elements

```html
<meta http-equiv="content-security-policy" content="default-src 'self'">
<meta http-equiv="x-dns-prefetch-control" content="off">
```

Teamgenik converts these paths into URLs appropriately.

#### `property-*`

```yaml
property-fb:app_id: "1234567890abcde"
property-fb:article_style: "default"
property-fb:use_automatic_ad_placement: "true"
property-op:markup_version: "v1.0"
property-al:ios:app_name: "App Links"
property-al:android:app_name: "App Links"
```

The above settings will generate the following `<meta>` elements

```html
<meta property="fb:app_id" content="1234567890abcde">
<meta property="fb:article_style" content="default">
<meta property="fb:use_automatic_ad_placement" content="true">
<meta property="op:markup_version" content="v1.0">
<meta property="al:ios:app_name" content="App Links">
<meta property="al:android:app_name" content="App Links">
```

You can embed the value of a property into the `content` attribute of a `<meta>` element using
`${...}` notation:

```yaml
property-og:url: "${url}"
property-og:title: "${title}"
property-og:description: "${meta-description}"
```

You can embed the URL of an image or audio file into the `content` attribute of a `<meta>`
element using `%{...}` notation:

```yaml
property-og:image: "%{/images/icon.png}"
property-og:audio: "%{/audios/theme.mp3}"
```

### `<link>` elements

The `<link>` elements in the `<head>` element are generated by the values of properties whose
names begin with `link-`:

```yaml
link-archives: "https://example.com/archives/"
link-license: "%{/copyright.html}"
```

The above will generate the following `<link>` elements

```html
<link rel="archives" content="https://example.com/archives/">
<link rel="license" content="http://localhost:3000/copyright.html">
```

When your website is published on Teamgenik, URLs generated from `%{...}` notation will be
converted appropriately.

#### Note

The following link element are always inserted within the head element.

```html
<link href="/css/tailwind.css" rel="stylesheet">
```

A `<link>` element that refers to another stylesheet cannot be inserted within the head element.

### `<script>` elements

The `<script>` elements are managed by tgweb. Users are not allowed to insert their own
`<script>` elements into the `<head>` or `<body>` elements.

Users can use [Alpine.js](https://alpinejs.dev/) to dynamically change HTML documents.

## License

**tgweb** is [MIT licensed](./LICENSE).

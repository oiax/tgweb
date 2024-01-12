# tgweb - Teamgenik Website Builder Offline Tool

## Table of Contents

* [Requirements](#requirements)
* [Getting Started](#getting-started)
* [Directory Structure](#directory-structure)
* [Managing Multiple Websites](#managing-multiple-websites)
* [Pages](#pages)
* [Front Matter](#front-matter)
* [Color Scheme](#color-scheme)
* [Images](#images)
* [Audios](#audios)
* [Fonts and Icons](#fonts-and-icons)
* [Layouts](#layouts)
* [Wrappers](#wrappers)
* [Segments](#segments)
* [Components](#components)
* [Articles](#articles)
* [Links](#links)
* [Dynamic Elements](#dynamic-elements)
  * [Modal](#modal)
  * [Toggler](#toggler)
  * [Switcher](#switcher)
  * [Rotator](#rotator)
  * [Carousel](#carousel)
  * [Scheduler](#scheduler)
  * [Tram](#tram)
  * [Notes on Alpine.js](#nodes-on-alpinejs)
* [Embedding Teamgenik Mini-apps](#embedding-teamgenik-mini-apps)
* [Notes on Property Values](#notes-on-property-values)
* [Managing the Contents of the `<head>` Element](#managing-the-contents-of-the-head-element)
* [TODO List](#todo-list)
* [License](#license)

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
npm install tgweb@latest
```

In your working directory you will have a directory named `node_modules`, where you will find
**tgweb** and its dependencies installed.

### Initialization

To begin creating a website using **tgweb**, run the following command in your working directory:

```bash
npx tgweb-init
```

This command creates two subdirectories, `src` and `dist`, and several files.

Initially, `index.html` in the `src/pages` directory has the following contents:

```html
<body>
  <p class="p-2 text-red-500">Hello, world</p>
</body>
```

Notice that the `body` element is not surrounded by `<html>` and `</html>`.

### Start the tgweb server

To start the tgweb server, run the following command:

```bash
npx tgweb-server
```

This command tries to start the tgweb server using port 3000.
If this port is already in use, the following error message will appear:

```
ERROR: Could not start a web server. Port 3000 is in use.
```

If you want to use a different port, specify it in the `PORT` environment variable as follows:

```bash
PORT=4000 npx tgweb-server
```

When the tgweb server starts successfully, the following message is displayed:

```
tailwindcss began to monitor the HTML files for changes.
Web server is listening on port 3000.
Rebuilding tailwind.css. Done in 761ms.
```

Then, open `http://localhost:3000` with your browser.

Make sure that the text "Hello, world!" appears with the red text color.

The class tokens `text-red-500` and `p-4` specified in the `class` attribute of the `<p>`
element are provided by [Tailwind CSS](https://tailwindcss.com/).

The token `text-red-500` specifies coral red (`#ef4444`) as the text color of `<p>` element,
and the token `p-4` sets the padding of the `<p>` element to scale 4 (16px/1rem).

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
  <p class="p-2 text-green-500">Hello, world</p>
</body>
```

Confirm that the browser screen is automatically redrawn and the text color of
"Hello, world!" changes from red to green.

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
│   │   └── index.html
│   ├── segments
│   ├── tags
│   ├── color_scheme.toml
│   └── site.toml
├── package-lock.json
└── package.json
```

Please note the following:

* **tgweb** scans the contents of the `src` directory, generates HTML files and writes them into
  the `dist` directory.
* **tgweb** scans the contents of the `src` directory, copies image and audio files to the `dist`
  directory.
* Tailwind CSS scans the HTML files of the `dist` directory, generates a CSS file `tailwind.css`
  on the `dist/css` directory.
* It makes no sense for the user to rewrite the contents of the `dist` directory.
* Users are not allowed to add their own CSS files to the website.
* Users are not allowed to add their own javascript files to the website.

## Managing Multiple Websites

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
npm install tgweb@latest
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

### Start the tgweb server with the subdirectory name

You can see that tgweb initially generate `index.html` in the `web/sites/site_0/src/pages` directory with the following contents:

```html
<body>
  <p class="p-2 text-red-500">Hello, world</p>
</body>
```

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
    │   └── src
    │       ├── articles
    │       ├── audios
    │       ├── color_scheme.toml
    │       ├── components
    │       ├── images
    │       ├── layouts
    │       ├── pages
    │       │   └── index.html
    │       ├── segments
    │       ├── site.toml
    │       └── tags
    └── site_1
        ├── dist
        └── src
            ├── articles
            ├── audios
            ├── color_scheme.toml
            ├── components
            ├── images
            ├── layouts
            ├── pages
            │   └── index.html
            ├── segments
            ├── site.toml
            └── tags
```

You may start the tgweb server with the command with an argument including `sites/` as follows:

```bash
npx tgweb-server sites/site_0
```

This will increase the number of characters of the command, but may make it easier to type the
command with the help of shell completion.

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

Non-page templates include layouts, segments, wrappers, articles, and components, which
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

Every website must have a file named `index.html` in the `src/pages` directory.
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

Note that the top-level element of a page should be the `<body>` element.
Unlike normal HTML files, a tgweb page is not enclosed in `<html>` and `</html>` tags and does
not have a `<head>` element.
A page will be converted into a complete HTML document and written to the `dist` directory.

For example, `src/pages/index.html` is converted to `dist/index.html` and
`src/pages/shops/new_york.html` is converted to `dist/shops/new_york.html`.

The content of the `<head>` element is automatically generated.
See [below](#managing-the-contents-of-the-head-element) for details.

## Front Matter

### Front matter block

When a template begins with a line that consists only of `---` and there is another such line in
the template, the area enclosed by these two lines is called the _front matter block_.

In this area you can give values to a set of properties.
This set of property/value pairs is called _front matter_.

Front matter blocks are written in [TOML](https://toml.io/en/) format.
Shown next is an example of a front matter block:

```
---
[main]
title = "Our Mission"

[data]
current_year = 2023

[style]
red-box = "rounded border border-red-600 p-1 md:p-2"

# TODO: Needs to be checked by the boss.
---
```

In the example above, the four main components of the front matter block are used.

* Property definition
* Table header
* Comment
* Blank line

Lines beginning with a `#` sign are ignored as comments. Blank lines are also ignored.

### Property definitions

The line `title = "Our Mission"` is an example of a property definition.
The `title` to the left of the equals sign is the name of the property and the `"Our Mission"` to
the right is the value of the property.

The property name, equals sign, and value must be on the same line, though some values can be
broken over multiple lines.

If the property name consists only of uppercase and lowercase letters, numbers, underscores, and
minus signs, it can be written without quotation marks; otherwise, the name must be enclosed in
quotation marks, as in the following example.

```
"&_p" = "mb-2"
```

Property values are described in different ways depending on their type.
Strings must always be quoted.
Integers and floating point numbers should be unquoted, such as `100`,  `-16`, and `3.14`.
Booleans (`true` and `false`) are also not quoted and should be lowercase.
Other writing styles will be explained when examples appear.

### Table headers

In the previous example, the lines labeled `[data]` and `[style]` are called _table headers_.

A table header marks the beginning of a _table_. The table continues until the next table
header or until the end of the file.

The following table names are available in the front matter block:

* main
* data
* style
* meta.name
* meta.http-equiv
* meta.property
* link

The first three are described in this section; the other four are described in
[Managing the Contents of the `<head>` Element](#managing-the-contents-of-the-head-element).

### Predefined properties

In the _main_ table of the front matter block, set the value of _predefined properties_.

The following are examples of predefined properties:

* `scheme`: The scheme of the URL of the HTML document. It must be `http` or `https`. Default: `http`.
* `host`: The host name of the URL of the HTML document. Default: `localhost`.
* `port`: The port number of the URL of the HTML document. Default: 3000.
* `url`: The URL of the HTML document.
* `root-url`: The root URL of the HTML document.
* `title`: The title of the HTML document.
* `layout`: The name of layout to be applied to the template. See [Layouts](#layouts).
* `html-class`: The value set to the `class` attribute of the `<html>` element.

Normally, it is not necessary to specify values for the `scheme`, `host`, and `port` properties.
The values of these properties will be set appropriately when the website is published on
Teamgenik.
The value of the `url` property is generated from these properties and the path to the page or
article. Its value is readonly.

The following three properties are meaningful only in articles:

* `index`: An integer value used to sort the articles.
* `tags`: A single string or array of strings to classify articles.
* `embedded-only`: A boolean value that determines whether a separate HTML document is created
   from an article; if `true`, it will not be created. Default: `false`.

See [Articles](#articles) for details.

### Embedding predefined property values in a template

The value of a predefined property can be embedded into a template by the `<tg:prop>` element.

```html
---
[main]
title = "Our Mission"
---
<body>
  <h1 class="text-2xl font-bold">
    <tg:prop name="title"></tg:prop>
  </h1>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

### Custom properties

As already noted, `[data]` in the front matter block indicates the beginning of the _data_ table.

Within the _data_ table, custom properties can be defined. Website authors can set values for
custom properties of any name.
The value of a custom property must be a string or a number in decimal notation.

The value of a custom property can be embedded into a template by the `<tg:data>` element.

```html
---
[main]
title = "Our Mission"

[data]
message = "Hello, world!"
year = 2023
---
<body>
  <h1 class="text-2xl font-bold">
    <tg:prop name="title"></tg:prop>
  </h1>
  <div class="bg-green-300 p-4">
    <p><tg:data name="message"></tg:data></p>
  </div>
  <footer>&copy; Example Inc. <tg:data name="year"></tg:prop></footer>
</body>
```

You can also use the `${...}` notation to embed the value of a custom property into the attribute
value of an HTML element.

```html
---
[data]
div-id = "special"
---
<body>
  <div id="${div-id}">...</div>
</body>
```

However, the `${...}` notation does not make sense for `class` attributes;
the method of embedding property values in `class` attributes will be explained shortly.

### Defining style aliases

A property defined in the "style" table can be used to give an alias to a set of class tokens.
We call this a _style alias_. The value of a style alias must always be a string.

To embed a style alias defined as such into the value of a `class` attribute, use the `tg:class`
attribute.

```html
---
[style]
blue-square = "w-24 h-24 md:w-48 md:h-48 bg-blue-500 rounded-xl p-8 m-4"
---
<body>
  <div tg:class="blue-square">
    Hello, world!
  </div>
</body>
```

Expanding the alias contained in the above template, we get the following result:

```html
<body>
  <div class="w-24 h-24 md:w-48 md:h-48 bg-blue-500 rounded-xl p-8 m-4">
    Hello, world!
  </div>
</body>
```

A long sequence of class tokens can be written over several lines surrounded by three
quotation marks.

```html
---
[style]
card = """
  bg-white dark:bg-slate-900 rounded-lg px-6 py-8
  ring-1 ring-slate-900/5 shadow-xl
  """
---
<body>
  <div tg:class="card">
    Hello, world!
  </div>
</body>
```

The three consecutive double quotation marks (`"""`) indicate the beginning and end of a
multi-line string.

Before being embedded in the `class` attribute of an HTML element, the value of the property is
converted as follows:

* Any included newline characters are replaced by spaces.
* Consecutive leading and trailing spaces are removed.
* Consecutive spaces are replaced by a single space.

If an element has both the `class` and `tg:class` attributes, the combined value of both become
the final `class` attribute value.

### Expansion of modifiers

You may want to define the following style aliases using Tailwind CSS modifiers to achieve the
[responsive design](https://tailwindcss.com/docs/responsive-design).

```toml
box = """
  w-16 h-16 p-1 border border-1 rounded
  md:w-32 md:h-32 md:p-2 md:rounded-md
  lg:w-48 md:h-48 lg:p-3 lg:rounded-lg
  """
```

If you are bothered by the repetition of modifiers such as `md:` and `lg:`, remove them using the
`{...}` notation as follows:

```toml
box = """
  w-16 h-16 p-1 border border-1 rounded
  md { w-32 h-32 p-2 rounded-md }
  lg { w-48 h-48 p-3 rounded-lg }
  """
```

The `{...}` notation is especially useful for utilization of
[arbitrary variants](https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants).

Assume that you have created the following style alias `blog-article`:

```toml
blog-article = """
  text-gray-900
  [&_*]:mb-2
  [&_*:last-child]:mb-0
  [&_h2]:text-xl
  [&_h2]:font-bold
  [&_h2]:tracking-wide
  [&_h2]:capitalize
  [&_p]:font-serif
  [&_p]:leading-5
  """
```

Then you can use this as follows:

```html
<article tg:class="blog-article">
  <h2>Title</h2>
  <p>Lorem ipsum dolor sit amet.</p>
  <p>Consectetur adipiscing elit.</p>
  <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
</article>
```

The following use of `{...}` notation eliminates the repetition of `[&_h2]` and `[&_p]` in the
above example.

```toml
blog-article = """
  text-gray-900
  [&_*]:mb-2
  [&_*:last-child]:mb-0
  [&_h2] { text-xl font-bold tracking-wide capitalize }
  [&_p] { font-serif leading-5 }
  """
```

### Site properties

Creating a file named `site.toml` in the `src` directory allows you to set values for properties
at the site level. The values set here will be the default values for properties set in the
front matter of each page.

`src/site.toml`

```toml
title = "No title"
layout = "common"

[data]
current-year = 2023
```

### `%{...}` notation

You can embed the URL of an image or audio file into the `content` attribute of a `<meta>`
element using `%{...}` notation:

```toml
[data]
icon-url = "%{images/icons/default.png}"
theme-url = "%{audios/our_theme.mp3}"
```

See [<meta> elements](#meta-elements) for specific examples of its use.

## Color Scheme

### Custom color names

Editing the `color_scheme.toml` in the `src` directory allows you to define custom color names
for Tailwind CSS.

A custom color name is a combination of a _palette_ and a _modifier_.
The palette is a three-letter alphabet and the modifier is a one-letter alphabet.
The palette and modifier are joined by a minus sign, like `bas-s` or `neu-d`.

The following is a list of available palettes and their expected uses.

* **bas**: Base color (background color of entire website)
* **neu**: Neutral color (a quiet color like gray, beige, ivory, etc.)
* **pri**: Primary color (most frequently used color other than base and neutral colors)
* **sec**: Secondary color (second most frequently used color other than base and neutral colors)
* **acc**: Accent color (third most frequently used color other than base and neutral colors)
* **nav**: Navigation color (background color of navigation bar or sidebar)

The following is a list of modifiers and their expected meaning.

* **s**: Standard
* **b**: Brighter
* **d**: Darker
* **c**: Contrasting

Here, "contrasting" means a color with good visibility when text is drawn in that color against
a standard-color background.

`src/color_scheme.toml`

```toml
bas-s = "#3d4451"
bas-c = "#a0aec0"
pri-s = "#45ba9f"
sec-s = "#70365d"
```

The defined custom color names can be used as the names of the colors that make up the Tailwind
CSS classes. For example, to set the color defined as `pri-s` as the background color of an
element, specify the `bg-pri-s` class in its `class` attribute.

### daisyUI color names

You can also use the color names provided by [daisyUI](https://daisyui.com/), such as `primary`,
`secondary`, `success`, `warning`.
For more information, see [Colors](https://daisyui.com/docs/colors/) in the daisyUI Documentation.

Please note that at this time, tgweb does not support the switching of the daisyUI themes.

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

If the `src` attribute of the `<img>` element contains the absolute path of the image file,
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

## Fonts and Icons

### Material Symbols

#### Basic Usage

By setting the value of the `outlined`, `rounded` and `sharp` properties to `true` in the
"font.material-symbols" table of `sites.toml`,
[Material Symbols](https://developers.google.com/fonts/docs/material_symbols)
provided by Google will be available on your website.

```toml
[font.material-symbols]
outlined = true
rounded = true
sharp = true
```

By writing in this way, all styles of Material Symbols will be available.
However, if only some of the styles are used, then the load on the website visitor should be
reduced by specifying `false` for properties with unused style names.

```toml
[font.material-symbols]
outlined = false
rounded = false
sharp = true
```

Alternatively, the property itself with the unused style name may be removed from `site.toml`.

```toml
[font.material-symbols]
sharp = true
```

#### Adjusting variables

Material Symbols provides four _variables_ for adjusting its typeface.
To specify them, write as following:

```toml
[font.material-symbols]
rounded = { fill = 1, wght = 200, grad = 0, opsz = 24 }
sharp = { fill = 0, wght = 300, grad = 200, opsz = 40 }
```

The `fill` is a variable that controls whether or not fill is applied;
0 means "no fill" and 1 means "fill". The default value is 0.

The `wght` controls the thickness (_weight_) of icons:
Possible values are 100, 200, 300, 400, 500, 600, or 700.
100 is the thinnest and 700 is the thickest.
The default value is 400.

The `grad` is the variable that determines the _grade_ of icons.
By changing the value of this variable, the thickness of the icon can be fine-tuned.
Possible values are -25, 0, or 200. The default value is 0.
A negative value makes icons thinner, a positive value makes them thicker.

The `opsz` variable determines the _optical size_ of icons, which is their recommended display
size. Possible values are 20, 24, 40, or 48. The default value is 24.
In general, larger values of optical size result in thinner lines, narrower spaces, and shorter
x-height (the distance between the baseline and the average line of the typeface's lowercase
letters).

### Variants

If you want to have multiple variants of a single style with different values for the variables,
add a minus sign and the variant name after the style name, as follows:

```toml
[font.material-symbols]
outlined = true
sharp = true
rounded = { fill = 0, wght = 200, grad = 0, opsz = 24 }
rounded-strong = { fill = 1, wght = 400, grad = 0, opsz = 24 }
rounded-bold = { fill = 0, wght = 700, grad = 0, opsz = 24 }
```

Note that only lowercase letters (`a-z`) and numerals (`0-9`) are allowed in variant names.

#### How to embed symbols in a template

Material Symbols can be embedded in a template by specifying a `class` beginning with
`material-symbols-` for a `<span>` element and placing the name of the symbol or code point
as its content.
When specifying a style with a variant name in the `class` attribute, use a space instead of a minus sign between the style name and variant name.

The name of the symbol must be converted to a _snake case_. That is, replace all spaces in the
name with underscores and all uppercase letters with lowercase ones.

The code point of a symbol is a four-digit hexadecimal number, such as `e88a`.
When specified as the content of a `<span>` element, it must be enclosed in `&#x` and `;` like
`&#xe88a;`

You can find the code point of each symbol on the
[Material Symbols and Icons](https://fonts.google.com/icons).

Although symbol names are easier to use, code points have one advantage.

Using a symbol name may temporarily disrupt the layout of a web page because a space the width of
the symbol name is displayed in place of the symbol until the font file is downloaded.
The use of code points can reduce the disruption to the layout.

#### Examples of Use

The "Home" symbol (outlined):

```html
<span class="material-symbols-outlined">home</span>
<span class="material-symbols-outlined">&#xe88a;</span>
```

The "Delete" symbol (rounded):

```html
<span class="material-symbols-rounded">delete</span>
<span class="material-symbols-rounded">&#xe872;</span>
```

The "Shopping Bag" symbol (sharp):

```html
<span class="material-symbols-sharp">shopping_bag</span>
<span class="material-symbols-sharp">&#xf1cc;</span>
```

The "strong" variant of the "Star" symbol (rounded):

```html
<span class="material-symbols-rounded strong">star</span>
<span class="material-symbols-rounded strong">&#xe838;</span>
```

### Google Fonts

The Roboto font family from [Google Fonts](https://fonts.google.com/) can be used on your website
by setting the following in the "font.google-fonts" table of `site.toml`.

```toml
Roboto = true
```

The following is an example of using the Robot font family:

```html
<p class="font-['Roboto']">Hello, world!</p>
```

If the font family name contains spaces, the name must be enclosed in double quotes as follows:

```toml
"Noto Sans Japanese" = true
```

Also, when using it in an HTML template, spaces should be replaced with underscores.

```html
<p class="font-['Noto_Sans_Japanese']">こんにちは、世界！</p>
```

To select some font weights in order to reduce the size of font file, specify weights as an array
instead of `true`.

```toml
"Noto Sans Japanese" = [400, 800]
```

The following example uses the Noto Sans Japanese font family with weight 800.

```html
<p class="font-['Noto_Sans_Japanese'] font-[800]">こんにちは、世界！</p>
```

To select font weights for each style, specify weights using the inline table as follows:

```toml
"Pathway Extreme" = { normal = [400, 800], italic = [400] }
```

The following example uses the italic Pathway Extreme font family with weight 400.

```html
<p class="font-['Pathway_Extreme'] italic font-[400]">Hello, world!</p>
```

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
3. The top-level element contains only one `<tg:content>` element within its descendant elements.

The `<tg:content>` element indicates where in the layout the page will be inserted.

#### Example

`src/layouts/common.html`

```html
<body>
  <header>
    <div>Example</div>
  </header>
  <main>
    <tg:content></tg:content>
  </main>
  <footer>&copy; Example Inc. 2023</footer>
</body>
```

Note that you _cannot_ write `<tg:content />` instead of `<tg:content></tg:content>`.

### Applying a layout to a page

To apply this layout to a page, specify the name of the layout in the `layout` property of the
the front matter of the page.

The name of the layout is the file name of the layout minus its extension (`.html`).
In this case, `common` is the name of the layout.

#### Example

`src/pages/index.html`

```html
---
[main]
layout = "common"
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
using the `<tg:prop>` element.

#### Example

`src/layouts/common.html`

```html
<body>
  <header>
    <div>Example</div>
  </header>
  <main>
    <h1 class="text-3xl"><tg:prop name="title"></tg:prop></h1>
    <tg:content></tg:content>
  </main>
</body>
```

`src/pages/greeting.html`

```html
---
[main]
layout = "common"
title = "Greeting"
---
<h1>Welcome!</h1>
<div class="bg-green-300 p-4">
  <p>Hello, world!</p>
</div>
```

### Slots and inserts

The `<tg:slot>` element is a place holder inside a layout that you can fill with a content
specified within a page.
A `name` attribute must be specified for the `<tg:slot>` element.

To embed content into a slot in a layout, place a `<tg:insert>` element on the page where the
layout is to be applied.

If you specify the name of the slot as the value of the `name` property of  `<tg:insert>` element,
the slot will be replaced with the element's content.

When page content is inserted into a `<tg:content>` element in a layout,
all `<tg:insert>` elements are removed from the page content.

#### Example

`src/layouts/product.html`

```html
<body class="p-2">
  <tg:content></tg:content>
  <div class="border-2 border-black border-solid p-2">
    <tg:slot name="remarks"></tg:slot>
  </div>
  <div><tg:slot name="badges"></tg:slot></div>
</body>
```

`src/pages/product1.html`

```html
---
[main]
layout = "product"
title = "Product 1"
---
<div>
  <h1>Product 1</h1>
  <p>Description</p>
</div>
<tg:insert name="remarks">This product is very <em>fragile</em>.</tg:insert>
<tg:insert name="badges"><span>A</span><span>B</span></tg:insert>
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

If the content to be inserted into the slot is not defined, the content of the `<tg:slot>` element
is used as a fallback content.

#### Example

`src/layouts/message.html`

```html
<body class="p-2">
  <tg:content></tg:content>
  <div><tg:slot name="message">No message.</tg:slot></div>
</body>
```

`src/pages/home.html`

```html
---
[main]
layout = "message"
title = "Home"
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

### `<tg:if-complete>`

Normally, the `<tg:if-complete>` element in a layout is simply replaced with its content.
However, if the following three conditions are not met, the entire element is deleted:

* The property values to be inserted for all `<tg:prop>` elements within it are defined.
* The custom property values to be inserted for all `<tg:data>` elements within it are defined.
* The contents to be inserted for all `<tg:slot>` elements within it are defined.

#### Example

`src/layouts/message.html`

```html
<body class="p-2">
  <tg:content></tg:content>
  <tg:if-complete>
    <hr class="h-px my-8 bg-gray-200 border-0">
    <div class="bg-gray-800 text-white p-4">To: <tg:data name="custom-name"></tg:data></div>
    <div class="bg-gray-200 p-4"><tg:slot name="message"></tg:slot></div>
  </tg:if-complete>
</body>
```

`src/pages/home1.html`

```html
---
[main]
layout = "message"
[data]
custom-name = "Alice"
---
<h1>Home</h1>
<tg:insert name="message">Hello, world!</tg:insert>
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
    <hr class="h-px my-8 bg-gray-200 border-0">
    <div class="bg-gray-800 text-white p-4">To: Alice</div>
    <div class="bg-gray-200 p-4">Hello, world!</div>
  </body>
</html>
```

`src/pages/home2.html`

```html
---
[main]
layout = "message"
[data]
custom-name = "Alice"
---
<h1>Home</h1>
```

When the layout `message` is applied to the page `home2.html`,
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
The `<tg:content>` element indicates where in the wrapper the page will be inserted.

#### Example

`src/pages/mission/_wrapper.html`

```html
<h1 class="text-xl bg-blue-400 p-2">Our Mission</h1>
<div class="[&_p]:mt-2 [&_p]:pl-2">
  <tg:content></tg:content>
</div>
```

The `class` attribute value `[&_p]:mt-2 [&_p]:pl-2` sets the `margin-top` and `padding-left` of all `<p>` elements within this
wrapper to scale 2 (8px/0.5rem). For the notation `[&_p]`, see
[Using arbitrary variants](https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants).

### Applying a wrapper to a page

As already mentioned, a wrapper placed in a directory applies to all pages in that directory.
In this example, assume the following two pages exist in the `src/pages/mission/` directory and its descendant directory `src/pages/mission/member_mission/`.


`src/pages/mission/team_mission.html`

```html
<h2 class="text-lg">[Team]</h2>
<div>
  <p>Create workshop pages.</p>
</div>
```

`src/pages/mission/member_mission/alice_mission.html`

```html
<h2 class="text-lg">[Alice]</h2>
<div>
  <p>Coding with html (workshop page).</p>
  <p>Coding with html (workshop calender page).</p>
</div>
```

Since the wrapper `_wrapper.html` is applied to these two pages, each `body` section is generated as follows.

`dist/pages/mission/team_mission.html`

```html
<body>
  <h1 class="text-xl bg-blue-400 p-2">Our Mission</h1>
  <div class="[&_p]:mt-2 [&_p]:pl-2">
    <h2 class="text-lg">[Team]</h2>
    <div>
      <p>Create workshop pages.</p>
    </div>
  </div>
</body>
```

`dist/pages/mission/member_mission/alice_mission.html`

```html
<body>
  <h1 class="text-xl bg-blue-400 p-2">Our Mission</h1>
  <div class="[&_p]:mt-2 [&_p]:pl-2">
    <h2 class="text-lg">[Alice]</h2>
    <div>
      <p>Coding with html (workshop page).</p>
      <p>Coding with html (workshop calender page).</p>
    </div>
  </div>
</body>
```

For both pages, `margin-top` and `padding-left` of the `<p>` element are set to scale 2 (8px/0.5rem).
In this way, common styles and common elements can be added to all pages in a particular directory and its descendant directories.

### Wrapper properties

The value of a property set in the wrapper's front matter becomes the default value of the
property for the page to which that wrapper is applied.
If the same property has a value set in the front matter of the page, the setting in the page takes precedence.

Wrapper property values take precedence over site property values.

#### Example

In this example, `title = "Team's Mission"` is defined as the wrapper property value.
It is then described as the content of the `h1` element using the `<tg:prop>` element.

`src/pages/mission/_wrapper.html`

```html
---
[main]
title = "Team's Mission"
---
<h1 class="text-xl bg-blue-400 p-2">
  <tg:prop name="title"></tg:prop>
</h1>
<div class="[&_p]:mt-2 [&_p]:pl-2">
  <tg:content></tg:content>
</div>
```

Apply the above wrapper to the following two pages.

`src/pages/mission/team_mission.html`

```html
<div>
  <p>Create workshop pages.</p>
</div>
```

`src/pages/member_mission/alice_mission.html`

```html
---
[main]
title = "Alice's Mission"
---
<div>
  <p>Coding with html (workshop page).</p>
  <p>Coding with html (workshop calender page).</p>
</div>
```

The `team_mission.html` one does not redefine the property `title` in the front matter, but the `member_mission/alice_mission.html` one does.

When the wrapper `_wrapper.html` is applied to these two pages, each `body` section is generated as follows.

`dist/pages/mission/team_mission.html`

```html
<body>
  <h1 class="text-xl bg-blue-400 p-2">
    Team&#39;s Mission
  </h1>
  <div class="[&_p]:mt-2 [&_p]:pl-2">
    <div>
      <p>Create workshop pages.</p>
    </div>
  </div>
</body>
```

`dist/pages/mission/member_mission/alice_mission.html`

```html
<body>
  <h1 class="text-xl bg-blue-400 p-2">
    Alice&#39;s Mission
  </h1>
  <div class="[&_p]:mt-2 [&_p]:pl-2">
    <div>
      <p>Coding with html (workshop page).</p>
      <p>Coding with html (workshop calender page).</p>
    </div>
  </div>
</body>
```

`team_mission.html` is rendered with the property `title` defined in the wrapper.
On the other hand, `member_mission/alice_mission.html` is rendered by `title`, which is redefined in the page.

## Segments

### Segment files

A _segment_ is a template file that can be embedded in pages, layouts or segments.
Segments cannot be embedded in templates other than these types, such as articles,
wrappers, and components.

When embedding a segment into another segment, care should be taken to avoid circular
references. If a circular reference is detected, an error message will be inserted in the
generated HTML.

Segments are placed in the `src/segments` subdirectory of the working directory.

The following is an example of a segment:

`src/segments/hero.html`

```html
<section class="bg-base-200 p-4 border border-rounded">
  <div class="flex">
    <img src="/images/hello.jpg">
    <div>
      <h1 class="text-5xl font-bold">Hello, world!</h1>
      <p>The quick brown fox jumps over the lazy dog.</p>
    </div>
  </div>
</section>
```

### Embedding segments into a page

To embed a segment into a page, add a `<tg:segment>` element at the
location where you want to place it and specify its name in the `name` attribute.

#### Example

```html
<div>
  <tg:segment name="hero"></tg:segment>

  <main>
    ...
  </main>
</div>
```

### Passing custom properties to a segment

You can pass custom properties to a segment using the `<tg:segment>` element's `data-*` attribute.

`src/segment/hero.html`

```html
<section class="bg-base-200 p-4 border border-rounded">
  <div class="flex">
    <img src="/images/${image-path}">
  </div>
</section>
```

`src/pages/index.html`

```html
<div>
  <tg:segment name="hero" data-image-path="hello.jpg"></tg:segment>

  <main>
    ...
  </main>
</div>
```

### Slots

Like layouts, slots can be placed inside segments. The method of embedding content in the slots
within a segment is similar to that of a layout.

#### Example

`src/segment/hero.html`

```html
<section class="bg-base-200 p-4 border border-rounded">
  <div class="flex">
    <img src="/images/hello.jpg">
    <div>
      <h1 class="text-5xl font-bold">Hello, world!</h1>
      <tg:slot name="paragraph"></tg:slot>
    </div>
  </div>
</section>
```

`src/pages/index.html`

```html
<div>
  <tg:segment name="hero">
    <tg:insert name="paragraph">
      <p>The quick brown fox jumps over the lazy dog.</p>
    </tg:insert>
  </tg:segment>

  <main>
    ...
  </main>
</div>
```

## Components

### Component files

A _components_ is a template file that can be embedded in pages, segments, components, articles
and layouts.

Components are placed in the `src/components` subdirectory of the working directory.

The following is an example of a component:

`src/components/smile.html`

```html
<span class="inline-block border-solid border-2 border-black rounded p-2">
  <span class="material-symbols-outlined">sentiment_satisfied</span>
</span>
```

Note that the property in the `font.material-symbols` table of `sites.toml` (the `outlined` property in this example) must be set to `true` in order to display the smiley icon above.
See [Material Symbols](#material-symbols) for details.

When embedding a component into another component, care should be taken to avoid circular
references. If a circular reference is detected, an error message will be inserted in the
generated HTML.

### Embedding components

To embed a component into a page, article, or layout, add a `<tg:component>` element at the
location where you want to place it and specify its name in the `name` attribute.

#### Example

```html
<p>
  <tg:component name="smile"></tg:component>
  How are you?
</p>
```

You can pass custom properties to a component using the `<tg:component>` element's `data-*`
attribute.

`src/components/avatar.html`

```html
<div class="bg-gray-200 p-2">
  <a href="articles/members/${name}.html">
    <img class="w-24 h-24 rounded-full" src="/images/${name}.png" alt="${name}">
  </a>
</div>
```

`src/pages/index.html`

```html
<div class="grid grid-rows-2 gap-4">
  <tg:component name="avatar" data-name="Alice"></tg:component>
  <tg:component name="avatar" data-name="Bob"></tg:component>
  <tg:component name="avatar" data-name="Carol"></tg:component>
</div>
```

### Slots

Like layouts and segments, slots can be placed inside components. The method of embedding content
in the slots within a component is similar to that of a layout and segment.

#### Example

`src/components/blog_item.html`

```html
<h3 class="font-bold text-lg m-2">
  <tg:slot name="title"></tg:slot>
</h3>
<div>
  <tg:slot name="body"></tg:slot>
</div>
<tg:if-complete>
  <div class="text-right">
    <tg:slot name="date"></tg:slot>
  </div>
</tg:if-complete>
```

`src/pages/hello.html`

```html
<main class="bg-gray-100 py-2">
  <tg:component name="blog_item">
    <tg:insert name="title">Greeting</tg:insert>
    <tg:insert name="body">
      <p>Hello.</p>
    </tg:insert>
    <tg:insert name="date">2022-12-31</tg:insert>
  </tg:component>
</main>
```

### Embedding property values into a component

The `<tg:prop>` and `<tg:data>` elements allow you to embed the value of a property in a component.

```html
---
[data]
message = "Hi!"
---
<span>
  <span class="material-symbols-outlined">sentiment_satisfied</span>
  <tg:data name="message"></tg:data>
</span>
```

Note that the component inherits the property from the page or article in which it is embedded.
When a property with the same name is defined in a component and a page or article, the value
defined in the page or article takes precedence.

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

### Embedding an article in a page or segment

Like components, articles can be embedded in pages or segments.
Place `<tg:article>` elements where you want to embed articles as follows:

```html
---
[main]
layout = "home"
---
<main>
  <h1>Our Recent Articles</h1>
  <tg:article name="blog/got_a_gadget"></tg:article>
  <tg:article name="blog/happy_new_year"></tg:article>
</main>
```

The value of the `name` attribute of the `<tg:article>` element must be the name of the
article file without the extension (`.html`).

Unlike components, articles can only be embedded into a page.
Articles cannot be embedded in other articles or layouts.

Like layouts and segments, slots can be placed inside articles.
You can also pass custom properties to an article using the `<tg:article>` element's `data-*` attribute.

### `embedded-only` property

When the value of the `embedded-only` property of an article is set to `true`, it is not converted
into a full HTML file, but is used only for embedding in a page or segment:

```html
---
[main]
embedded-only = true
---
<h3>Greeting</h3>
<p>Hello, world!</p>
```

### Embedding articles in a page

The `<tg:articles>` element can be used to embed multiple articles into a page or segment.

```html
---
[main]
layout = "home"
---
<main>
  <h1>Our Proposals</h1>
  <tg:articles pattern="proposals/*"></tg:articles>
</main>
```

The above example embeds all articles in the `src/articles/proposals` directory under the
`<h1>` element.

By default, articles are sorted in ascending (alphabetically) order by filename.

To sort articles in descending order by their filename, set the `order-by` attribute of the
`<tg:articles>` element to `"filename:desc"`:

```html
---
[main]
layout = "home"
---
<main>
  <h1>Our Proposals</h1>
  <tg:articles pattern="proposals/*" order-by="filename:desc"></tg:articles>
</main>
```

You can pass custom properties to an article using the `<tg:articles>` element's `data-*` attribute.

### `<tg:if-embedded>` and `<tg:unless-embedded>`

The `<tg:if-embedded>` element is used within an article's template and is rendered only when the
article is embedded within another page or segment.

The `<tg:unless-embedded>` element is used within an article's template and is rendered only when
the article is generated as a separate web page.

### Sorting articles by their title

To sort articles by their title, set the `order-by` attribute of the `<tg:articles>` element
to `"title:asc"` or `"title:desc"`:

```html
---
[main]
layout = "home"
---
<main>
  <h1>Our Proposals</h1>
  <tg:articles pattern="proposals/*" order-by="title:asc"></tg:articles>
</main>
```

The value of the `order-by` attribute is a string separated by a single colon.
The left side of the colon must be `"title"`, `"index"` or `"filename"`.
The right side of the colon must be `"asc"` or `"desc"`, where `"asc"` means "ascending order"
and `"desc"` means "descending order".

### Sorting articles in an arbitrary order

To sort articles in an arbitrary order, set the `index` property to an integer value for each
article:

```html
---
[main]
index = 123
---
<article>
  ...
</article>
```

Then, set the `order-by` attribute of the `<tg:articles>` element to `"index:asc"` or
`"index:desc"`:

```html
---
[main]
layout = "home"
---
<main>
  <h1>Our Proposals</h1>
  <tg:articles pattern="proposals/*" order-by="index:asc"></tg:articles>
</main>
```

Articles without the `index` property are ordered by file name after those with the `index`
property.

### Generating a link list to articles

The `<tg:links>` element can be used to embed links to articles in any template
(page, layout, component, article).

```html
---
[main]
layout = "home"
---
<main>
  <h1>Our Proposals</h1>
  <ul>
    <tg:links pattern="proposals/*">
      <li>
        <a href="#">
          <tg:prop name="title"></tg:prop>
          <tg:if-complete>
            <span class="text-sm">
              (<tg:slot name="date"></tg:slot>)
            </span>
          </tg:if-complete>
        </a>
      </li>
    </tg:links>
  </ul>
</main>
```

The `<tg:links>` element contains one or more `<a>` elements and
zero or more `<tg:prop>`, `<tg:data>` and `<tg:slot>` elements.

The values of `href` attribute of `<a>` are replaced by the URL of the article.
The `<tg:prop>` and `<tg:data>` elements are replaced by the value of a property of the article
to be embedded.
The `<tg:slot>` elements are replaced by the content of a `<tg:insert>` element defined in the
article to be embedded.

Inside the `<tg:links>` element, `<tg:if-complete>` elements work the same way
as inside components.
That is, a `<tg:if-complete>` element will be removed from the output
unless a value or content is provided for all `<tg:prop>`, `<tg:data>`, and `<tg:slot>` elements
within it.

By default, articles are sorted in ascending (alphabetically) order by file name.
To sort articles by their title, set  the `order-by` attribute of the `<tg:links>` element to
`"title:asc"` or `"title:desc"`:

```html
    <tg:links pattern="proposals/*" order-by="title:asc">
      <li>
        ...
      </li>
    </tg:links>
```

See [Sorting articles by their title](#sorting-articles-by-their-title) on how to　write values
to be set in the `order-by` attribute.

To sort articles in an arbitrary order, add a `tg:index` attribute to each article:

```html
---
[main]
layout = "home"
index = 123
---
<article>
  ...
</article>
```

Then, specify the `order-by` attribute of the `<tg:links>` element.

```html
    <tg:links pattern="proposals/*" order-by="index:asc">
      <li>
        ...
      </li>
    </tg:links>
```

Note that the current specification does not allow a `<tg:component>` element to be placed within
a `<tg:links>` element.

Zero or one `<tg:if-current>` element may be placed inside the `<tg:links>` element.
The content of the `<tg:if-current>` element is only rendered if the path of the article the path
of the HTML document that is being generated.

### Filtering articles by tags

You may use _tags_ to classify your articles.

To attach tags to an article, specify their names in the `tags` property as an array
using `[...]` notation:

```html
---
[main]
tags: [ "travel", "europe" ]
---
<article>
  ...
</article>
```

To attach a single tag to an article, the value of the `tags` property may be specified as a
string:

```html
---
[main]
tags = "anime"
---
<article>
  ...
</article>
```

You can use the `filter` attribute to filter articles embedded on the page:

```html
---
[main]
layout = "home"
---
<main>
  <h1>Articles (tag:travel)</h1>
  <tg:articles pattern="blog/*" filter="tag:travel"></tg:articles>
</main>
```

The value of the `filter` attribute is a string separated by a single colon.
In the current specification, the left side of the colon is always `"tag"` and
the right side of the colon is a tag name.

You can also filter the list of links to articles using the `filter` attribute:

```html
---
[main]
layout = "home"
---
<main>
  <h1>Articles (tag:travel)</h1>
  <ul>
    <tg:links pattern="blog/*" filter="tag:travel">
      <li>
        <a href="#">
          <tg:slot name="title"></tg:slot>
        </a>
      </li>
    </tg:links>
  </ul>
</main>
```

Note that you cannot assign tags to a page.

### `<tg:links>` with the `component` attribute

When a `<tg:links>` element has the `component` attribute, the content of the component with the
name corresponding to its value becomes the content of the `<tg:links>` element.

For example, suppose there is a `nav_link` component with the following content

`src/components/nav_link.html`

```html
<li>
  <a href="#">
    <tg:prop name="title"></tg:prop>
    <tg:if-complete>
      <span class="text-sm">
        (<tg:slot name="date"></tg:slot>)
      </span>
    </tg:if-complete>
  </a>
</li>
```

In this case, we can construct a `<tg:links>` element as follows:

```html
<tg:links component="nav_link" pattern="blog/*"></tg:links>
```

The above code is to be interpreted as exactly the same as the following

```html

<tg:links pattern="blog/*">
  <li>
    <a href="#">
      <tg:prop name="title"></tg:prop>
      <tg:if-complete>
        <span class="text-sm">
          (<tg:slot name="date"></tg:slot>)
        </span>
      </tg:if-complete>
    </a>
  </li>
</tg:links>
```

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

### `<tg:link>`, `<tg:if-current>` and `<tg:label>`

The `<tg:link>` is a special element used to conditionally cause the `<a>` element to appear.
Basically, the content of this element is just rendered as it is.
If there is an `<a>` element with a `href` attribute of `"#"` inside the `<tg:link>` element, the `href`
attribute of the `<tg:link>` element is set to the value of the `href` attribute of that `<a>`
element.

The following code is rendered as `<a href="/articles/goal">Our Goal</a>`:

```html
<tg:link href="/articles/goal.html">
  <a href="#">Our Goal</a>
</tg:link>
```

However, when an article with the path `/articles/goal.html` contains the above code, this part is
removed from the generated HTML document.

Zero or one `<tg:if-current>` element may be placed inside the `<tg:link>` element.
The content of the `<tg:if-current>` element is only rendered if the value of the `href`
attribute of the `<tg:link>` element matches the path of the HTML document that is being generated.

The following code is rendered as `<span class="font-bold">Our Goal</span>` when it appears in
an article with the path `/articles/goal.html`.

```html
<tg:link href="/articles/goal.html">
  <a href="#">Our Goal</a>
  <tg:if-current>
    <span class="font-bold">Our Goal</span>
  </tg:if-current>
</tg:link>
```

The `<tg:label>` element can be used to remove duplication from the above code.

```html
<tg:link href="/articles/goal.html" label="Our Goal">
  <a href="#"><tg:label></tg:label></a>
  <tg:if-current>
    <span class="font-bold"><tg:label></tg:label></span>
  </tg:if-current>
</tg:link>
```

This element is replaced by the value specified in the `label` attribute of the `<tg:link>`
element.

#### Example

`src/components/nav.html`

```html
<nav>
  <tg:link href="/articles/goal.html" label="Our Goal">
    <a href="#" class="underline text-blue-500"><tg:label></tg:label></a>
    <tg:if-current>
      <span class="font-bold"><tg:label></tg:label></span>
    </tg:if-current>
  </tg:link>
  <tg:link href="/articles/about.html" label="About Us">
    <a href="#" class="underline text-blue-500"><tg:label></tg:label></a>
    <tg:if-current>
      <span class="font-bold"><tg:label></tg:label></span>
    </tg:if-current>
  </tg:link>
</nav>
```

### `<tg:link>` with the `component` attribute

When a `<tg:link>` element has the `component` attribute, the content of the component with the
name corresponding to its value becomes the content of the `<tg:link>` element.

For example, suppose there is a `nav_link` component with the following content

`src/components/nav_link.html`

```html
<a href="#" class="underline text-blue-500"><tg:label></tg:label></a>
<tg:if-current>
  <span class="font-bold"><tg:label></tg:label></span>
</tg:if-current>
```

In this case, we can construct a `<tg:link>` element as follows:

```html
<tg:link component="nav_link" href="/articles/goal.html" label="Our Goal"></tg:link>
```

The above code is to be interpreted as exactly the same as the following

```html

<tg:link href="/articles/about.html" label="About Us">
  <a href="#" class="underline text-blue-500"><tg:label></tg:label></a>
  <tg:if-current>
    <span class="font-bold"><tg:label></tg:label></span>
  </tg:if-current>
</tg:link>
```

## Dynamic Elements

This section explains how to introduce dynamic elements such as modals and carousels to your website.

### Modal

Specifying the `tg:modal` attribute on an HTML element makes the following attributes available
to descendant elements of that element:

* `tg:open`
* `tg:close`

We call an HTML element with the `tg:modal` attribute a __modal__.
A modal has two states, `open` and `close`. Its initial state is `close`.

There must be one `<dialog>` element inside the modal. Initially, this element is not displayed.
When the user clicks on an element with the `tg:open` attribute, the `<dialog>` element is displayed.
Conversely, if the user clicks on an element with the `tg:close` attribute, the `<dialog>` element
will disappear.

What follows is an example of a modal:

```html
<div tg:modal>
  <div><button type="button" tg:open>Open</button></div>
  <dialog class="rounded-2xl bg-white backdrop:bg-gray-800/80 p-4 h-[360px]">
    <h2>Greetings</h2>
    <p>Hello, world!</p>
    <div><button type="button" tg:close>Close</button></div>
  </dialog>
</div>
```

A transparent element of the same size as the viewport, called a "backdrop," is inserted directly
below the `<dialog>` element.
The backdrop deactivates all page content except the `<dialog>` element.

The class token `backdrop:bg-gray-800/80` in the value of the `class` attribute of the `<dialog>`
element applies a translucent dark gray background color to the backdrop.
See [Dialog Backdrops](https://tailwindcss.com/docs/hover-focus-and-other-states#dialog-backdrops)
in the Tailwind CSS Documentation for more information.

### Toggler

Specifying the `tg:toggler` attribute on an HTML element makes the following attributes available
to descendant elements of that element:

* `tg:when`
* `tg:toggle`

We call an HTML element with the `tg:toggler` attribute a __toggler__.
A toggler has two states, `on` and `off`. Its initial state is `off`.

An element with a `tg:when` attribute inside a toggler will only be displayed if its value matches
the state of the toggler.

When the user clicks or taps an element with a `tg:toggle` attribute inside the toggler,
the toggler's state is set to the value of the the attribute.

Here is an example toggler:

```html
<div tg:toggler>
  <button type="button" tg:toggle="on" tg:when="off">Open</button>
  <div tg:when="on">
    <button type="button" tg:toggle="off">Close</button>
    <p>Hello, world!</p>
  </div>
</div>
```

When viewing this example in a browser, initially only the "Open" button is visible to the user.
When the user clicks or taps this button, the state of the toggler is set to `on`, the "Open" button
disappears, and a "Close" button and a "Hello, world" paragraph appear instead.
When the user further clicks or taps the "Close" button, it returns to the initial state.

If the `tg:toggle` attribute's value is omitted, the toggler's state is reversed when the user
clicks or taps on the element.
So the above example could be rewritten as:

```html
<div tg:toggler>
  <button type="button" tg:toggle tg:when="off">Open</button>
  <div tg:when="on">
    <button type="button" tg:toggle>Close</button>
    <p>Hello, world!</p>
  </div>
</div>
```

### Switcher

Specifying the `tg:switcher` attribute on an HTML element makes the following attributes available
to descendant elements of that element:

* `tg:item`
* `tg:choose`
* `tg:first`
* `tg:prev`
* `tg:next`
* `tg:last`
* `tg:paginator`

We call an HTML element with the `tg:switcher` attribute a _switcher_.

Inside the switcher, there must always be an element with the `tg:body` attribute, a _switcher body_.
In addition, there must be elements with the `tg:item` attribute, _switcher items_,
inside the switcher body.

Swticher items are assigned unique _index numbers_ starting from zero in sequence.
A switcher has a state represented by an integer value, called an _current index number_.
A switcher item will only be displayed if its index number matches the current index number of the
switcher.

When the user clicks or taps an element with a `tg:choose` attribute inside the switcher,
the switcher's current index number is set to the value of the the attribute.

Here is an example switcher:

```html
<div tg:switcher>
  <div tg:body>
    <div tg:item>A</div>
    <div tg:item>B</div>
    <div tg:item>C</div>
    <div tg:item>D</div>
    <div tg:item>E</div>
  </div>
  <nav>
    <button type="button" tg:choose="0">a</button>
    <button type="button" tg:choose="1">b</button>
    <button type="button" tg:choose="2">c</button>
    <button type="button" tg:choose="3">d</button>
    <button type="button" tg:choose="4">e</button>
  </nav>
</div>
```

If the the value of `tg:choose` attribute of a button matches switcher's current index number
nothing happens when the user clicks or taps this button.

To visually indicate this, use the `tg:current-class` and `tg:normal-class` attributes to
change the style applied to the button.

```html
  <button
    type="button"
    tg:choose="0"
    class="btn"
    tg:current-class="btn-primary cursor-default"
    tg:normal-class="btn-secondary">a</button>
```

You can create a button that change the state of the switcher using special attributes such as
`tg:first`, `tg:prev`, `tg:next`, `tg:last`, etc. instead of the `tg:choose` attribute.

```html
<div tg:switcher>
  <div tg:body>
    <div tg:item>A</div>
    <div tg:item>B</div>
    <div tg:item>C</div>
    <div tg:item>D</div>
    <div tg:item>E</div>
  </div>
  <nav>
    <button type="button" tg:first>First</button>
    <button type="button" tg:prev>Prev</button>
    <button type="button" tg:next>Next</button>
    <button type="button" tg:last>Last</button>
  </nav>
</div>
```

If the switcher's current index number matches the its lower bound,
nothing happens when the user clicks or taps a button with `tg:first` or `tg:prev` attribute.

Similarly, if the switcher's current index number matches the its upper bound,
nothing happens when the user clicks or taps a button with `tg:next` or `tg:last` attribute.

To visually indicate this, use the `tg:enabled-class` and `tg:disabled-class` attributes to
change the style applied to the button.

```html
  <button
    type="button"
    tg:first
    class="btn"
    tg:enabled-class="btn-primary"
    tg:disabled-class="btn-disabled">First</button>
```

If the switcher has an `tg:interval` attribute, the switcher's index number is incremented
by 1 at the specified interval (unit: millisecond).

```html
<div tg:switcher tg:interval="5000">
  ...
</div>
```

If you want to add a fade-in/fade-out effect to the switcher, specify the time in milliseconds
required for the fade-in or fade-out effect to complete in the `tg:transition-duration` attribute
of the switcher.

```html
<div tg:switcher tg:interval="5000" tg:transition-duration="750">
  ...
</div>
```

When the user clicks or taps a button with a `tg:choose` attribute, etc., the switcher's state
no longer changes automatically.

Inside the switcher, there may be an element with the `tg:paginator` attribute.
This element will be a template for a group of buttons that will allow the user to choose the
a switcher item to be displayed.
We call these buttons _pagination buttons_.

For example, if the number of switcher items is five, the following code example generates a
`<nav>` element with five `<button>` elements inside.

```html
<div tg:switcher>
  ...
  <nav>
    <button type="button" tg:paginator></button>
  </nav>
</div>
```

### Rotator

We call an HTML element with the `tg:rotator` attribute a _rotator_.

A rotator behaves exactly like a switcher with three reservations:

* If the user clicks a button with the `tg:next` attribute when the current index number matches
the upper bound, the index number will be set to its lower bound.
* If the user clicks a button with the `tg:prev` attribute when the current index number matches
the lower bound, the index number will be set to its upper bound.
* When the `tg:interval` attribute is set, when the current index number reaches the upper bound,
the next time the index number is set to its lower bound.

Here is an example rotator:

```html
<div tg:rotator tg:interval="5000" tg:transition-duration="750">
  <div tg:body>
    <div tg:item>A</div>
    <div tg:item>B</div>
    <div tg:item>C</div>
    <div tg:item>D</div>
    <div tg:item>E</div>
  </div>
  <nav>
    <button type="button" tg:prev>Prev</button>
    <button type="button" tg:next>Next</button>
  </nav>
</div>
```

### Carousel

#### Carousel Basics

We call an HTML element with the `tg:carousel` attribute a _carousel_.

This allows website authors to display multiple pieces of content sequentially in a slideshow-like
format.

Inside the carousel, there must always be an element with the `tg:frame` attribute, a _carousel frame_.
Also, inside the carousel frame, there must be an element with the `tg:body` attribute, a _carousel body_.
In addition, there must be elements with the `tg:item` attribute, _carousel items_,
inside the carousel body.

The width of the carousel body is automatically calculated to be an integer multiple of the width
of the first carousel item, so there is no need for the website author to specify it.
Its width becomes large enough to allow all carousel items to be aligned horizontally, but only a
portion of it will be visible to website visitors because of the `overflow: hidden` style of the
carousel frame.
The carousel effect is achieved by shifting the carousel body left and right with an embedded
JavaScript program.

The width of the carousel frame should be adjusted by the website author.
Normally, match the width of the carousel frame and the first carousel item.
That way, only one carousel item will be displayed in the carousel frame while the carousel remains still.
If you want to always display multiple carousel items, make the width of the carousel frame larger
than the width of the first carousel item.

```html
---
[style]
carousel-frame = "w-[240px] h-[180px]"

carousel-body = """
  [&>div] { w-[240px] h-[180px] object-cover }
  [&>div>img] { w-full h-full object-cover object-center}
  """
---
<div tg:carousel>
  <div tg:frame tg:class="carousel-frame">
    <div tg:body tg:class="carousel-body">
      <div tg:item><img src="/images/slides/a.png"></div>
      <div tg:item><img src="/images/slides/b.png"></div>
      <div tg:item><img src="/images/slides/c.png"></div>
      <div tg:item><img src="/images/slides/d.png"></div>
      <div tg:item><img src="/images/slides/e.png"></div>
    </div>
  </div>
</div>
```

As with rotators, placing an element with a `tg:prev` or `tg:next` attribute inside the carousel
allows the user to control the state of the carousel.

```html
<nav>
  <button type="button" tg:prev>Prev</button>
  <button type="button" tg:next>Next</button>
</nav>
```

#### Carousel auto-rotation and animation effect

To automatically rotate the carousel items at regular time intervals, specify a positive integer
for the `tg:interval` attribute of the carousel.
The value specified in this attribute is interpreted as time in milliseconds.

```html
<div tg:carousel tg:interval="3000">
```

If you want to add animation effect to the rotation of the carousel, specify the
`tg:transition-duration` attribute of the carousel.

```html
<div tg:carousel tg:interval="3000" tg:transition-duration="500">
```

By default, the horizontal movement of carousel items is linear, i.e., they move at the even speed.

If you want to fine-tune the way they move, specify a class with a name beginning with "ease-" for
the carousel body.

```html
<div tg:carousel>
  <div tg:frame tg:class="carousel-frame">
    <div tg:body class="ease-in-out" tg:class="carousel-body">
      ...
    </div>
  </div>
</div>
```

The `ease-in-out` class moderates the movement near the beginning and near the end of the change.
See [Transition Timing Function](https://tailwindcss.com/docs/transition-timing-function) for
details.

If the `tg:transition-duration` attribute is set on the carousel, a user clicking/tapping the
"prev" or "next" button while the carousel body is shifting horizontally will have no effect.
To visually indicate this, specify the `tg:enabled-class` and `tg:disabled-class` attributes to
the buttons.

Class tokens specified in the `tg:enabled-class` attribute are added to the `class` attribute of
the button when the carousel body is stopped, and class tokens specified in the `tg:disabled-class`
attribute are added to the `class` attribute of the button when the carousel body is shifting.

```html
<button
  type="button"
  tg:prev
  class="rounded-full w-12 h-12 opacity-50"
  tg:enabled-class="bg-teal-400 hover:opacity-75"
  tg:disabled-class="bg-gray-400 cursor-default"
>
  <span class="material-symbols-outlined">arrow_back</span>
</button>
```

#### Paginator

Inside the carousel, there may be an element with the `tg:paginator` attribute.
This element will be a template for a group of buttons that will allow the user to choose the
a carousel item to be displayed in the center of the carousel frame.
We call these buttons _pagination buttons_.

For example, if the number of carousel items is five, the following code example generates a
`<nav>` element with five `<button>` elements inside.

```html
<div tg:carousel>
  ...
  <nav>
    <button type="button" tg:paginator></button>
  </nav>
</div>
```

Each pagination button corresponds to one of the carousel items.

If desired, you may code individual pagination buttons by specifying the number of the carousel
item in the `tg:choose` attribute.

The following example generates a `<nav>` element with five `<button>` elements, as in the
previous example.

```html
<nav>
  <button type="button" tg:choose="0"></button>
  <button type="button" tg:choose="1"></button>
  <button type="button" tg:choose="2"></button>
  <button type="button" tg:choose="3"></button>
  <button type="button" tg:choose="4"></button>
</nav>
```

Note that each carousel item is numbered starting with zero.

If you want to give a prominent style to the pagination button corresponding to the carousel item
displayed in the center of the carousel frame, use the `tg:normal-class` and `tg:current-class`
attributes.

```html
<nav>
  <button
    type="button"
    tg:paginator
    class="rounded-full w-6 h-6 mx-1 opacity-50"
    tg:normal-class="bg-teal-400 hover:opacity-75"
    tg:current-class="bg-orange-400 cursor-default"
  >
  </button>
</nav>
```

Class tokens specified in the `tg:normal-class` attribute are applied to buttons corresponding to
carousel items that are not currently displayed in the center of the carousel frame,
and class tokens specified in the `tg:current-class` attribute are applied to the button
corresponding to the carousel item that is currently displayed in the center of the carousel frame.

When the `tg:transition-duration` attribute is set on the carousel, a user clicking/tapping the pagination
buttons while the carousel body is shifting horizontally will have no effect.
To visually indicate this, specify the `tg:disabled-class` attributes to
the buttons.

```html
<nav>
  <button
    type="button"
    tg:paginator
    class="rounded-full w-6 h-6 mx-1 opacity-50"
    tg:normal-class="bg-teal-400 hover:opacity-75"
    tg:current-class="bg-orange-400 cursor-default"
    tg:disabled-class="bg-gray-400 cursor-default"
  >
  </button>
</nav>
```

Class tokens specified in the `tg:disabled-class` attribute are added to the `class` attribute of
all pagination buttons when the carousel body is shifting.

### Scheduler

_Scheduler_ is a mechanism for changing the `class` attribute of an HTML element and its
descendant elements over time.

The following is a simple example of scheduler configuration:

```html
<div
  tg:scheduler
  class="w-24 mx-auto p-4 text-center text-white"
  tg:init="bg-black"
  tg:1000="bg-red-500"
  tg:2000="bg-blue-500"
  tg:3000="bg-green-500"
>
  Hello, world!
</div>
```

The `tg:scheduler` attribute declares that this element is managed by a scheduler.
The value of this element's `class` attribute is called the _base class_.

The base class plus the value of the tg:init attribute is initially the `class` attribute of
this element.
In this example, the `class` attribute of the `<div>` element is initially set to the value
`"w-24 mx-auto p-4 text-center text-white bg-black"`.

The attribute named `tg:` combined with a sequence of numbers changes the `class` attribute of
this element at the moment a certain amount of time has elapsed since the web page was loaded.
The sequence of numbers represents the elapsed time in milliseconds.

In this example, the value of the `class` attribute of the `<div>` element changes over time as
follows:

* After 1 second: `w-24 mx-auto p-4 text-center text-white bg-red-500`
* After 2 seconds: `w-24 mx-auto p-4 text-center text-white bg-blue-500`
* After 3 seconds: `w-24 mx-auto p-4 text-center text-white bg-green-500`

In the following example, the scheduler is used to achieve the fade-in effect:

```html
<div
  tg:scheduler
  tg:init="opacity-0"
  tg:0="opacity-100 transition duration-[2000ms]"
>
  Fade In
</div>
```

Initially, the value of the `class` attribute of this `<div>` element contains `opacity-0`, so its
contents are not visible to the user.
The moment the page loads, `opacity-0` is removed from the `class` attribute of this `<div>`
element and `opacity-100` is added instead.
Thanks to the `transition duration-500` included in the base class, the effect of `opacity-100` is
applied gradually over a period of 0.5 seconds.

### Tram

#### Tram Basics

_Tram_ is a mechanism for changing the `class` attribute of an HTML element and its descendant
elements as the positional relationship between the element and the viewport changes.

When a user scrolls a web page on which a tram is placed from top to bottom, the tram progresses
from bottom to top.
When the head of the tram touches the bottom of the viewport, we say tram progress is 0.
When the rear of the tram touches the upper edge of the viewport, we say tram progress is 100.

The following is a simple example of tram configuration:

```html
<div tg:tram>
  <div
    class="w-48 h-48 mx-auto"
    tg:init="bg-black"
    tg:forward-50="bg-red"
  >
  </div>
</div>
```

This tram has one inner `<div>` element. The inner element has the `tg:forward-50` attribute, and
the presence of this attribute makes this element the _target_ of the tram.

The value of the target's `class` attribute is called the _base class_.
Initially, the actual value of the class attribute is the base class plus `bg-black` specified in
the `tg:init` attribute.
Then, by specifying the attribute `tg:forward-50`, the moment tram progress reaches 50, the base
class plus `bg-red` is set as the target's `class` attribute.
Tram progresses, represented by a number such as 50, are called _trigger points_.

Attributes whose names begin with `tg:forward-` are called _forward triggers_, and attributes
whose names begin with `tg:backward-` are called _backward triggers_.
Class tokens specified with a forward trigger are added to the target's `class` attribute when
the tram reaches the trigger point of that trigger while moving forward.
Class tokens specified with a backward trigger are added to the target's `class` attribute when
the tram reaches the trigger point of that trigger while moving backward.

Setting multiple triggers to a single target is allowed.
In the following example, the background color changes from black to red and then from red to green
as the tram progresses.

```html
<div tg:tram>
  <div
    class="w-48 h-48 mx-auto"
    tg:init="bg-black"
    tg:forward-25="bg-red"
    tg:forward-50="bg-green"
  >
  </div>
</div>
```

If you want the color change to be gradual, add `transition` and `duration-1000` to the base class:

```html
<div tg:tram>
  <div
    class="w-48 h-48 mx-auto transition duration-1000"
    tg:init="bg-black"
    tg:forward-50="bg-red"
  >
  </div>
</div>
```

This way, when tram advances to the center of the viewport, the background color will switch from
black to red over 1000 ms.

When a user scrolls a web page from bottom to top, the tram moves backward from the top of the
screen to the bottom.

If you want the target's `class` attribute to change while tram is moving backward, specify
the backward triggers:

```html
<div tg:tram>
  <div
    class="w-48 h-48 mx-auto"
    tg:init="bg-black"
    tg:forward-50="bg-red"
    tg:backward-50="bg-black"
  >
  </div>
</div>
```

In the example above, the target's background color changes from red to black at the moment
the tram reaches center of the viewport while moving backward.

#### Trigger points

So far we have used _bare_ integers from 0 to 100 to represent trigger points, but by adding
a _unit_ to integers, we can represent a variety of trigger points.

`100%` represents a trigger point equivalent to a progress equal to the length (height) of the tram.
For example, class tokens set to the `tg:forward-50%` attribute will be added to the target's `class`
attribute when the tram advances its half the length from the bottom of the viewport.

In the following example, the target in the tram is initially outside the left edge of the viewport,
and when the tram advances until its tail touches the bottom edge of the viewport, it takes 1000ms
to return to its original position.

```html
<div tg:tram class="overflow-hidden">
  <div
    class="w-48 h-48 mx-auto bg-black transition duration-1000"
    tg:init="translate-x-[-100vw]"
    tg:forward-100%="translate-x-0"
  >
  </div>
</div>
```

`100vh` represents a trigger point equivalent to a progress equal to the height of the viewport.
For example, class tokens set to the `tg:forward-50vh` attribute will be added to the target's `class`
attribute when the head of the tram is at the same height as the midpoint of the viewport.

`100px` represents the trigger point which corresponds to 100 pixels of progress.
For example, the `tg:forward-64px` attribute has as its value the class tokens that should be
applied when the tram advances 64 pixels beyond the bottom edge of the viewport.

It is possible to add an additional suffix, `+` or `-`, to these units.
The suffix `+` means that tram progress is measured relative to the top of the viewport.
For example, `50%+` indicates that the tram has advanced from the top of the viewport by half its
own length.

The suffix `-` means that the tram progress reference is the top edge of the viewport and the
trigger point is backward away from the top edge of the viewport.
For example, `64px-` indicates the head of the tram is 64 pixels behind the top edge of the
viewport.

### Notes on Alpine.js

The tgweb uses [Alpine.js](https://alpinejs.dev/) to achieve dynamic content manipulation.
However, website authors themselves cannot use attributes derived from Alpine.js such as `x-data`
, `@click`, and `:class`.
When those attributes are found in the source HTML files, they will be removed.

## Embedding Teamgenik Mini-apps

### What is a mini-app?

Teamgenik has an aspect of being a no-code development platform.
Applications created on Teamgenik are called "mini-apps".
In the STUDIO space on Teamgenik you can create mini-apps, and in the MARKET space you can acquire
or purchase mini-apps.

Mini-pps have two uses:

1. You can use them as stand-alone widgets in your BASE space.
2. You can embed them on your personal or your team's website.

Note that you can only embed the mini-apps on websites that are published on Teamgenik.
Therefore, it is not possible to run mini-apps on top of the web pages delivered by the web server
started by the `npx tgweb-server` command.
However, it is possible to embed placeholders for mini-apps in them.
You can then upload the website data to Teamgenik with the `npx tgweb-push` command and publish
the website with the embedded mini-apps.

**Note** The `npx tgweb-push` command is not yet available.

### Settings for mini-apps

To embed mini-app placeholders in your web page, you must specify the default locale of mini-apps
and register their name, ID, and display name in `site.toml`.
Shown below is an example of the setup.

```toml
default-locale = "en"

[[apps]]
name = "score_board"
id = "121d0e34-2398-4f7d-a8be-bdc549cd4332"
display-name = "Score Board"

[[apps]]
name = "players_list"
id = "70955db7-75f6-43b2-b46a-50413e43b94f"
display-name = "Players List"
```

When the texts in mini-apps are internationalized, they are translated in the locale set in the
`default-locale` property.

You must place `[[apps]]` on the first line of each mini-app configuration.
Note that the word "apps" is enclosed in double square brackets.

The `name` property is the name used to identify the mini-app to be configured.
Its value can be any string, but it must correspond to the `name` attribute of the `<tg:app>` tag
described below.

The `id` property is the identifier (ID) assigned to the mini-app on Teamgenik.
Its value has the form of a UUID (Universally Unique IDentifier).
You can find the ID of each mini-app by visiting the website builder within the Teamgenik PUB space.
This property is optional.

The ID is necessary to actually run a mini-app on the website published on Teamgenik, but
if you simply want to embed a its placeholder in a web page in the local environment and
check its appearance, you can omit it.

The value of `display-name` property is a string that will be displayed within the placeholder.
If this property is omitted, the value of the `name` property is used instead.

### Embed mini-app placeholders into your webpages

Use the `<tg:app>` element to embed mini-app placeholders into your web page.
Its value of the `name` attribute must match the `name` property of one of the mini-apps described
in `site.toml`.
The following is an example of the use the `<tg:app>` element:

```html
<tg:app name="score_board"></tg:app>
```

The `<tg:app>` element can have an `expanded` attribute. This attribute controls the display mode
of mini-apps.

Mini apps have two display modes: standard mode and expanded mode.
The layout of the mini-apps in standard mode is optimized for a width of 300 pixels, while the
mini-apps in expanded mode are optimized for a width of 640 pixels.

The `expanded` attribute is a boolean attribute; if the attribute is present, the mini-app is
displayed in expanded mode; otherwise, it is displayed in standard mode.
The following is an example of the use the `expanded` attribute:

```html
<tg:app name="score_board" expanded></tg:app>
```

Note that the mini-app placeholder itself does not have a specific width and height.
Usually, you should fix the width of the placeholder by enclosing it in a `<div>` element like this:

```html
<div class="w-[300px]">
  <tg:app name="score_board"></tg:app>
</div>
```

Specifying a minimum height as shown below may prevent the web page layout from wobbling when
the content of the mini-app changes.

```html
<div class="w-[300px] min-h-[450px]">
  <tg:app name="score_board"></tg:app>
</div>
```

To switch the display mode depending on whether the display width of the browser is 640 pixels or
more, place two placeholders as follows, surround each with a `<div>` element which has
an appropriate set of Tailwind CSS class tokens.

```html
<div class="w-[300px] sm:hidden">
  <tg:app name="score_board"></tg:app>
</div>
<div class="w-[640px] hidden sm:block">
  <tg:app name="score_board" expanded></tg:app>
</div>
```

The `sm:hidden` class hides elements when the browser display width is greater than 640 pixels.
The `hidden sm:block` class hides the element when the browser display width is less than 640 pixels.

To learn more about the Tailwind CSS class tokens mentioned here, please visit the following pages:

* https://tailwindcss.com/docs/width#arbitrary-values
* https://tailwindcss.com/docs/min-height#arbitrary-values
* https://tailwindcss.com/docs/responsive-design
* https://tailwindcss.com/docs/display

## Notes on Property Values

### Property Inheritance

If no value is set for a particular property in the front matter of a page, tgweb
will search for a value in the following order:

1. the front matter of its wrapper if available
2. the front matter of its layout if available
3. `sites.toml` if available

For example, suppose that the value `"a"` is set to the custom property `data.x` in the front
matter of a page as follows:

```
[data]
x = "a"
```

And suppose the front matter of its wrapper has the following settings:

```
[data]
x = "b"
y = "c"
```

In this case, the value of the custom property `x` for this page is `"a"` and the value of the
custom property `y` is `"c"`.

In addition, suppose that the front matter of the layout applied to this page has the following
settings:

```
[data]
z = "d"
```

If so, the value of property `z` on this page is `"d"`.

Custom properties as well as predefined properties such as `title` are inherited as well.
Also, properties that belong to "meta", "http-equiv", "meta-property", and "link" tables are
inherited. However, properties that belong to "style" table are _not_ inherited.

### Embedding property values into an article

When an article is rendered as an independent HTML document, the property inheritance mechanism is
exactly the same as that of a page.

When an article is embedded in a page, segment, or layout, it inherits properties from the wrapper
surrounding it, if any, and `site.toml` but not from the page, segment, or layout that embeds that
article.

### Embedding property values into a wrapper or layout

When a wrapper or layout is applied to a page or article, the values that are substituted for
the `<tg:prop>` and `<tg:data>` elements in that wrapper or layout are the values of
properties that the page or article has.

For example, suppose a page has the following front matter

```
[data]
x = "a"
```

And suppose its wrapper has the following front matter and HTML fragment:

```html
---
[data]
x = "b"
y = "c"
---
<header>
  <tg:data name="x"></tg:data>
  <tg:data name="y"></tg:data>
</header>
<tg:content></tg:content>
```

Then, the text content of the `<header>` element of the HTML document generated from them will
be "a c" instead of "b c".

### Embedding property values into a segment

When a segment is embedded into a page, the values that are substituted for
the `<tg:prop>` and `<tg:data>` elements in that segment are the values of
properties that the page has.

Similarly, when a segment is into a layout, the values that are substituted for
the `<tg:prop>` and `<tg:data>` elements in that segment are the values of
properties of the main template (page or article).

### Embedding property values into a component

When a component is embedded into a page, article, segment, wrapper, layout,
the values that are substituted for the `<tg:prop>` and `<tg:data>` elements in that template
are the values of properties of the main template (page or article).

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
[main]
title = "Greeting"
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

The `<meta>` elements in the `<head>` element are generated by the values of properties that
belongs to "meta", "http-equiv", or "meta-property" tables.

Note that the `<head>` element of the generated HTML document always contains a
`<meta charset="utf-8">` element.

#### `[meta.name]` table

You can generate a `<meta>` element with a `name` attribute by setting the value to a property
that belongs to the "meta.name" table:

```toml
[meta.name]
viewport = "width=device-width, initial-scale=1"
theme-color = "#2da0a8"
description = "Description"
robots = "index,follow"
generator = "Teamgenik"
```

Setting the values of the properties as above will produce the following `<meta>` elements:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#2da0a8">
<meta name="description" content="Description">
<meta name="robots" content="index,follow">
<meta name="generator" content="Teamgenik">
```

If you want to generate multiple `<meta>` elements with the same name, write as follows:

```toml
[meta.name]
googlebot = [ "index,follow", "notranslate" ]
```

The above will generate the following `<meta>` elements

```html
<meta name="googlebot" content="index,follow">
<meta name="googlebot" content="notranslate">
```

#### `[meta.http-equiv]` table

You can generate a `<meta>` element with a `http-equiv` attribute by setting the value to a
property that belongs to "http-equiv" table.

```toml
[meta.http-equiv]
content-security-policy = "default-src 'self'"
x-dns-prefetch-control = "off"
```

The above settings will generate the following `<meta>` elements:

```html
<meta http-equiv="content-security-policy" content="default-src 'self'">
<meta http-equiv="x-dns-prefetch-control" content="off">
```

Teamgenik converts these paths into URLs appropriately.

#### `[meta.property]` table

```toml
[meta.property]
"fb:app_id" = "1234567890abcde"
"fb:article_style" = "default"
"fb:use_automatic_ad_placement" = "true"
"op:markup_version" = "v1.0"
"al:ios:app_name" = "App Links"
"al:android:app_name" = "App Links"
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

```toml
[meta.property]
"og:url" = "${url}"
"og:title" = "${title}"
"og:description" = "${meta.name.description}"
```

To refer to the value of a property belonging to the "meta" table, add `meta.` before the property
name.

You can embed the URL of an image or audio file into the `content` attribute of a `<meta>`
element using `%{...}` notation:

```toml
[meta.property]
"og:image" = "%{/images/icon.png}"
"og:audio" = "%{/audios/theme.mp3}"
```

### `<link>` elements

The `<link>` elements in the `<head>` element are generated by the values of properties that
belon to "link" table and "links" tables.

```toml
[link]
canonical = "https://example.com/"
license = "%{/copyright.html}"

[[links]]
blocking = "render"
href = "example.woff2"
as = "font"

[[links]]
rel = "preload"
href = "my_font.woff2"
as = "font"
type = "font/woff2"
crossorigin = "anonymous"
```

The above will generate the following `<link>` elements

```html
<link rel="canonical" href="https://example.com/">
<link rel="license" href="http://localhost:3000/copyright.html">
<link blocking="render" href="example.woff2" as="font">
<link rel="preload" href="myFont.woff2" as="font" type="font/woff2" crossorigin="anonymous">
```

When your website is published on Teamgenik, URLs generated from `%{...}` notation will be
converted appropriately.

#### Note

The following `<link>` element are always inserted within the head element.

```html
<link href="/css/tailwind.css" rel="stylesheet">
```

A `<link>` element that refers to another stylesheet cannot be inserted within the head element.

### `<script>` elements

The `<script>` elements are managed by tgweb. Users are not allowed to insert their own
`<script>` elements into the `<head>` or `<body>` elements.

#### Note

The following `<script>` elements are always inserted within the head element.

```html
<script src="/js/alpine.min.js" defer></script>
<script src="/reload/reload.js" defer></script>
```

## TODO List

See [TODO.md](./TODO.md).

## License

**tgweb** is [MIT licensed](./LICENSE).

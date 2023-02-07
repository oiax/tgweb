# tgweb - Teamgenik Website Builder Offline Tool

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

Create `index.html` in the `src` directory with the following content:

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

## Layouts

### What is a layout

Layout is the "shell," so to speak, that surrounds your pages.
Layouts allow you to manage your website efficiently.

Typically, the pages of a website have a set of areas that share most of the same content:
headers, sidebars, footers, etc.
We call this set of areas a _layout_.

The relationship between page and layout is similar to that between a work of fine art and a
picture frame.

### Adding a layout

Layouts are HTML files placed in the `src/layouts` subdirectory under the working directory.

A layout must satisfy the following two conditions:

1. Its root element is the body element.
2. The root element has only one `<tg-content>` element.

The element with the tg-content attribute indicates where in the layout the page will be inserted.

#### Example

`src/layouts/common.html`

```html
<body>
  <header>
    <div>Example</div>
  </header>
  <main>
    <tg-content />
  </main>
  <footer>&copy; Example Inc. 2023</footer>
</body>
```

### Applying this layout to a page

To apply this layout to a page, specify the name of the layout in the `tg-layout` attribute of the
root element of the page.

The name of the layout is the file name of the layout minus its extension (`.html`).
In this case, `common` is the name of the layout.

The root element of the page to which the layout is applied must be an element that can be placed
within the `<body>` element, such as the `<div>` element and `<article>` element,
rather than the `<body>` element.

#### Example

`src/index.html`

```html
<article tg-layout="common">
  <h1>Welcome!</h1>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</article>
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
      <article>
        <h1>Welcome!</h1>
        <div class="bg-green-300 p-4">
          <p>Hello, world!</p>
        </div>
      </article>
    </main>
    <footer>&copy; Example Inc. 2023</footer>
  </body>
</html>
```

## Components

### Comonent files

_Components_ are named HTML elements that can be placed in pages, articles and layouts.
Their files are live in the `src/components` subdirectory of the working directory.

A component must have only one root element. The following is an example of a correct component:

`src/components/smile.html`

```html
<span class="inline-block border-solid border-2 border-black rounded p-2">
  <i class="fas fa-smile"></i>
</span>
```

The following example is incorrect for a component because it has multiple root elements:

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

### Embeddeing content to a component

### Slots

## Managing the contents of the `<head>` element

### `<title>`

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

### `<meta>`

Not yet implemented.

### `<link>`

Not yet implemented.

#### Note

The following link element are always inserted within the head element.

```html
<link href="/css/tailwind.css" rel="stylesheet">
```

A link element that refers to another stylesheet cannot be inserted within the head element.

### `<script>`

The `<script>` elements are managed by tgweb. Users are not allowed to insert their own
`<script>` elements into the `<head>` or `<body>` elements.

Users can use [Alpine.js](https://alpinejs.dev/) to dynamically change HTML documents.

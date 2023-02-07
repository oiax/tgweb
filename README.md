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

To create a website named `foobar`, run the following command:

```bash
npx tgweb-init foobar
```

This command creates `foobar` directory in the `sites` directory.

### Add content

Create `index.html` under the foobar directory with the following content:

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
npx tgweb-server foobar
```

Then, open `http://localhost:3000` with your browser.

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

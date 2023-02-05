# tgweb - Teamgenik Website Builder Offline Tool

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

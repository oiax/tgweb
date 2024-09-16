# tgweb CHANGELOG

## 0.11.4

* 6e53dd6 Introduce `main.draft` property to page/article front matter

## 0.11.3

* dbd6759 Fix #193: Make a `<tg:segment>` embeddable into a page wrapper

## 0.11.2

* 8b3d928 Fix #194: Article cannot be embedded in page wrapper

## 0.11.1

* baba03c Introduce front matter files
* e493bf3 Introduce `main.shared-wrapper property` to the wrapper's frontmatter

## 0.11.0

* 4a63a79 Introduce `<tg:shared-component>`

## 0.10.3

* a6105d7 Remove unnecessary lines

## 0.10.2

* 3e27f6e Fix typos: lottie.min.js -> dotlottie.min.js

## 0.10.1

* ff7ed75 Copy src/animations/* to dist/animations/

## 0.10.0

* c86d5fd Make the lottie animation files playable

## 0.9.1

* b9b59c1 Fix directory handling of tgweb-dist command

## 0.9.0

* eda1f3d Add tgweb-dist command to generate files for distribution

## 0.8.3

* 92e3699 Embed the value of the meta.name property etc. in `site.toml` into the values of other
          properties.
* 5645314 If an array is specified in the meta.name field of `site.toml`, generate `<meta>` tags
          for that number of tags.

## 0.8.2

* 97ac48a Fix tram's init() so that target.dataset.tramBaseClass gets initialized only once

## 0.8.1

* 65bc50f Bug fix: styles of switch/rotator not adjusted when `transitionDuration` is not set

## 0.8.0

* 8fd059c Add `tgweb-archive` command

## 0.7.5

* 1c0ca5d Fix sort order for articles without index property

## 0.7.4

* 63c6572 Add "px" to style.width and style.height

## 0.7.3

* 4880d62 Show error when firstItem === undefined (not === null)
* 787509e Add `<!DOCTYPE html>` to generate html files
* 8b12c33 Fix bug: rotator does not work without transition-duration

## 0.7.2

* 9a2778a Introduce a new dynamic elment, Scheduler

## 0.7.1

* b5126bf Add `<style>` element for Material Symbol Variants

## 0.7.0

* 63e3151 Rename `site.toml` and `front_matter` tables
* 8aa4d4c Extend `site.toml` schema for Google Material Symbols

## 0.6.8

* 2392d47 Bug fix: the `url` prop gets unset when a page or article is updated

## 0.6.7

* b5ee1ac Update `skel/src/site.toml`

## 0.6.6

* 7e8f192 Do not adjust the size of body when switcher/rotator does not have `transition-duration`
          attribute.

## 0.6.5

* 3b4b354 Bug fix: switcher and rotator does not work when interval or transition duration is not
          set.

## 0.6.4

* 480d2ab Show the first switcher/rotator item without transition (#117)

## 0.6.3

* 4e0e128 Implement tg:paginator for switcher/rotator (#114)
* ce4d035 Adjust the size of switcher/rotator body automatically (#115)

## 0.6.2

* 4a74abb Add `window.onresize` to `tgweb_utilities.js` so that carousel body width is adjusted
          automatically
* 9c6f48a Fix `getLocalState`: copy `itemIndex` field value
* 811de60 Fix `doRenderEmbeddedArticle`: copy `itemIndex` field value
* 2d0a76d Fix switcher and rotator: find length of items on the JS side
* 09d6712 Introduce `tg:transition-duration` attribute to switcher and rotator
* 40ee889 Rename `tg:duration` attrbute of carousel to `tg:transition-duration`

## 0.6.1

* f3790e3 Allow `<link>` elements with attributes other than `href` to be rendered (#93)
* ede3e13 Allow a `<tg:if-current>` element to be placed under the `<tg:links>` elements (#101)
* 6bc99e2 Introduce `<tg:if-embedded>` and `<tg:unless-embedded>` elements (#111)

## 0.6.0

* 46b5b08 Introduce the main section in the front matter and site properties (#94)
* 7f381ba Enable data and inserts to be injected to an article (#102)
* c6d4d83 Enable a component to be embedded in another (#108)
* 0ef62b5 Abolish main.layer property (#109)

## 0.5.9

* bc3cc70 Quick and emergency fix: `toml` -> `@ltd/j-toml`

## 0.5.8

* 2577df5 Bug fix: cannot embed a data field in a segment/component template
* bac2a2d Bug fix: cannot parse local date, local datetime and local time

## 0.5.7

* fd8e8a6 Bug fix: tg:switcher with tg:choose does not work (#86)

## 0.5.6

* 747dc85 tgweb-server: Set "Content-encoding: gzip" for svgz files

## 0.5.5

* 39dbcf8 tgweb-server: Support svgz files

## 0.5.4

* 273ba9c Use `data-x` attribute in stead of `tg:data-x` to pass data to articles and components

## 0.5.3

* 6987825 Make carousel paginator scroll smoothly

## 0.5.2

* ab851ce Enable set class attribute to `<html>` tag

## 0.5.1

* b0fc697 Bug fix: Added images/audios are not copied into dist directory

## 0.5.0

* 319c223 Modify switcher/rotator so that they set `data-index` of generated HTML elements
* a3a0e88 Modify carousel so that it generates HTML fragments beforehand
* a1c06d4 Modify tram so that it works on the teamgenik.com
* 4c2cefe Set the "root-url" and "url" property of frontMatter of pages and articles
* 68b8c70 Allow Teamgenik mini-app placeholders to be embedded

## 0.4.10

* eb4dba3 Fix a bug of `tgweb_utilities.js`: `switcher.last()` does not work

## 0.4.9

* cc05439 Fix choose buttons of switcher/rotator so that they call correct javascript functions
* 3fc11cb Refer to Alpine.js properties using `this` instead of `$data`
* cae7792 Fix a bug that the carousel does not show the first item in the initial state

## 0.4.8

* 9b2545e Fix a bug where the carousel does not work when the `tg:interval` attribute is not
          specified for the carousel

## 0.4.7

* 38c9dc8 Add `@tailwindcss/container-queries` to `package.json`
* d1d593f Do not put `tailwind.css` initially; generate it by `tgweb-server` command

## 0.4.6

* 225cc21 Introduce a `layer` property to control the hierarchical relationship
          between segments and allow one segment to be embedded in another segment

## 0.4.5

### New features

* ddbc009 Make Google Fonts available

### Spec changes

* a3fbb48 Rename the property that specifies whether to use Google Material Symbols
          from `font-material-symbols` to `font.material-symbols`

### Bug fixes

* 8518e93 Fix `sort_articles.mjs` so that articles without indexes go to the end of the queue
* a111ec2 Fix `update_site_data.mjs` so that template.inserts field gets updated
* ad02599 Fix `get_type.mjs` so that extname of templates are checked
* dcf756b Fix `update_site_data.mjs` so that it updates deps of siteData.segments
* 607273c Fix `update_site_data.mjs` so that the dependencies of all templates
          are updated when the site.toml gets updated

## 0.4.4

* 589f457 Introduce `tg:tram` utility
* e3ae94e `tgweb-server` command should accept `sites/<site_name>` as the first argument

## 0.4.3

* 8d339f4 Change the attribute name prefix from `data`- to `tg:data-` for passing data
          to components and segments
* b5d1b91 Make `${...}` within the `class` attribute get expanded (#53)

## 0.4.2

* 1ef6123 Bug fix: `<tg:segment>` should pass inserts to the segment

## 0.4.1

* fc06f94 Fix render_web_page.mjs: Enable always the prev/next buttons of the rotator

## 0.4.0

* c66e20d Embed style aliases using `tg:class` attribute
* a0eca2d `<tg-*>` tags and `tg-` attributes should be denoted as `<tg:*>` and `tg:*`d
* e824074 Front matter block must be written in TOML instead of YAML
* 3193d01 03efdd0 Introduce `{...}` notation to expand modifiers in the style aliase definition
* d76434c Introduce carousel
* 9b06175 Improve switcher and rotator so that we do not have to specify the number of items and
          we can generate pagination buttons using `tg:paginator` attribute.
* 5baf7fe Introduce `tg:modal` utility

## 0.3.3

* 1ef56b3 Introduce togglers, switchers, and rotators

## 0.3.2

* 91c468a Embed custom property values into attributes of elements
          Purge attributes whose name starts with `on`, `tg-`, `x-`, `:` or `@`
* aced9a9 Fix rendewWebPage: render <a> correctly

## 0.3.1

* 00af55a Introduce Alpine.js

## 0.3.0

* 8087e10 Reimplement tgweb using htmlparser2 instead of jsdom

## 0.2.11

* e14c091 Bug fix: set dependencies for an article twice

## 0.2.10

* 8934163 Bug fix: import segment deps into page/layout deps

## 0.2.9

* 7e79485 Bug fix: initialize template with empty dependencies

## 0.2.8

* 0cf590a Fix path handlings for Windows

## 0.2.7

* d14f46f Bug fix: article wrappers do not inherit properties from articles

## 0.2.6

* 7ea512f Fix `setDepdencies/2` so that it gets layout name from site.yml
* 06f6451 Do not generate html for embedded-only articles

## 0.2.5

* 622cd19 Fix `getLayout/3` so that it reads layout name from `site.yml`

## 0.2.4

* 345583c Pass custom properties to a segment/component via `data-*` attributes
* 6f22cfc Expand custom property values in HTML element attributes
* 675267c Bug fix: expand class aliases in embedded articles

## 0.2.3

* dd1b844 Overhaul the mechanism of property inheritance
* 080ac6f Allow a segment or component have multiple top-level nodes

## 0.2.2

* 07103da Change and refine mechanism of property inheritance:
  - Do not inherit properties whose name begins with "class-"
  - Merge layout front matter just before rendering the main template
  - Make component merge the container's front matter

## 0.2.1

* 8acd48d Update `tailwind.config.js` with the value of `color_scheme.yml`

## 0.2.0

No changes

## 0.1.16

* 7d50a63 Properties whose name begins with `class-` are not inherited

## 0.1.15

* fb2cd35 Bug fix: cannot embed articles into a layout

## 0.1.14

* e07263d Fix updateSiteData/2 for Windows
* 681c4f6 Introduce segment templates that can be embedded into a page or layout

## 0.1.13

* 7152cfb Fix getTemplate/2 for to remove carriage returnes from source

## 0.1.12

* ad507f8 Introduce daisyUI
* 660ba25 Bug fix: make pages/article inherit properties from layout
* c2cb0d7 Make `tgweb-init` create `.gitignore` file

## 0.1.11

* 2c893b0 Add {shell: true} to spawn for Windows
* 94ddbd3 Handle Windows-style paths correctly
* 6a0fec4 Try to remove files only if they exist
* e5feb64 Inherit properties from layout front matter
* f5a771d Make articles sortable by filename in descending order
* ac5e3e6 Introduce font-materials-symbols property

## 0.1.10

* 1200f07 Fix applyWrapper to embed components into wrappers
* aea6464 Show error message when the specified component does not exist
* 1c9d133 Bug fix: regenerate a page dependent on an article
* eedefe9 Make create/2 to add an entry to the template list of site data
* 1ef686d Process the deletion of templates and sites.yml
* dafb0e0 Make create/2 to regenerate dependencies
* da31f70 Call createInitially/2 until chokidar returns 'ready'
* e983a5a Introduce `embedded-only` property to skip HTML file creation

## 0.1.9

* 44a2d15 Make pages to take dependencies from associated articles

## 0.1.8

* dda67cd Include articles as dependencies
* 751fd21 Bug fix: Update dom of page template
* 6d25de7 Show error message if specified article does not exist

## 0.1.7

* 6615976 Apply wrapper to articles more correctly
* ecd8fca Apply wrapper to article generated by `<tg-article>`

## 0.1.6

* 2fb77c5 Allow sorting articles by their title

## 0.1.5

* 8bbb90a Fix updateSiteData/2: process front matters
* 4422628 Update all pages and articles when site.yml gets updated

## 0.1.4

* 9b61878 Fix updateSiteData/2: convert Buffers to strings

## 0.1.3

* 0671b65 Fix getDom/1: convert Buffer to a string

## 0.1.2

* 8b85fc1 Allow single site configuration

## 0.1.1

* d4becae The value of tags attribute may be an array

## 0.1.0

* 8cd198b tgweb-init: copy `site.yml` from stubs directory
* a86a84a Generate `<link>` elements
* e492830 Generate `<meta>` elements
* 711a85c Introduce front matter

## 0.0.10

* 379515d Introduce wrapper templates

## 0.0.9

* 0207b41 Introduce `<tg-template>` elements
* ffbd295 Introduce `<tg-link>` elements
* 5c9689d Introduce `<tg-component>` and `<tg-insert>` elements
* e8ce67a Introduce `<tg-article>`, `<tg-articles>` and `<tg-links>` elements
* b868d37 Introduce `<tg-if-complete>` elements
* ae8c331 Improve the manipulation of `<tg-link>` elements

## 0.0.7

* 4bafb1b Make `tg-article`, `tg-articles` and `tg-links` accept slots
* 14baa67 Allow slots to be placed in components
* e1b497c Place pages in the `src/pages` directory

## 0.0.6

* 4ab13b8 Introduce `tg-if-complete` attribute

## 0.0.5

* db5b589 Embed contents into slots within layout
* 9e11940 Use `<tg-content></tg-content>` instead of `<div tg-content></div>`

## 0.0.4

* d4f1cd4 Use `tg-tags` instead of `tg-tag` attribute
* ca1bd73 Merge attributes of article and component

## 0.0.3

* b4769b2 Generate a list of links to articles with a specific tag

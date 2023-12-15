# tgweb - Teamgenik ウェブサイトビルダー オフラインツール

## 目次

* [必要環境](#必要環境)
* [はじめに](#はじめに)
* [ディレクトリ構造](#ディレクトリ構造)
* [複数のウェブサイトを管理する方法](#複数のウェブサイトを管理する方法)
* [ページ](#ページ)
* [フロントマター](#フロントマター)
* [カラースキーム](#カラースキーム)
* [画像](#画像)
* [音声](#音声)
* [フォントとアイコン](#フォントとアイコン)
* [Layouts](#layouts)
* [Wrappers](#wrapper)
* [Segments](#segments)
* [Components](#components)
* [Articles](#articles)
* [Tags](#tags)
* [リンク](#リンク)
* [Dynamic Elements](#dynamic-elements)
* [Embedding Teamgenik Mini-apps](#embedding-teamgenik-mini-apps)
* [Notes on Property Values](#notes-on-property-values)
* [Managing the Contents of the `<head>` Element](#managing-the-contents-of-the-head-element)
* [TODO List](#todo-list)
* [License](#license)

## 必要環境

* Node.js: 16.12 以上
* npm: 8.0 以上

## はじめに

### インストール

まず最初に、**tgweb** 用の<ins>作業ディレクトリ</ins>を作成します。ディレクトリの場所はどこでもかまいません。
例として、ホームディレクトリの下層に `my_site` というサブディレクトリを作成し、作業ディレクトリとして利用します。


```
mkdir -p ~/my_site
```

そして作業ディレクトリに移動し、`npm` コマンドで **tgweb** をインストールします。

```bash
cd my_site
npm install tgweb@latest
```

インストールが無事に終わると、作業ディレクトリの中に `node_modules` というディレクトリが作成され、このディレクトリの中に **tgweb** とその依存関係にあるライブラリがインストールされます。


### 初期化

**tgweb** を使用してウェブサイト作成を始めるにあたり、以下のコマンドを作業ディレクトリで実行します。

```bash
npx tgweb-init
```

このコマンドにより、`src` と `dist` という 2 つのサブディレクトリといくつかのファイルが作成されます。

`my_site/src/pages` ディレクトリにある `index.html` の初期状態の内容は以下になります。

```html
<body>
  <p class="p-2 text-red-500">Hello, world</p>
</body>
```

`body` 要素が `<html>` `</html>` タグで囲われていないことにご注意ください。

### tgweb サーバの起動

tgweb サーバを起動するには、以下のコマンドを実行します。

```bash
npx tgweb-server
```

このコマンドは、指定がなければ tgweb サーバをポート 3000 で公開するように起動します。
すでにポート 3000 が使用中であれば、以下のエラーメッセージが表示されます。

```
ERROR: Could not start a web server. Port 3000 is in use.
```

他のポートを指定したい場合は、環境変数 `PORT` で以下のように指定します。

```bash
PORT=4000 npx tgweb-server
```

tgweb サーバーが正常に起動すると、以下のメッセージが表示されます。

```
tailwindcss began to monitor the HTML files for changes.
Web server is listening on port 3000.
Rebuilding tailwind.css. Done in 761ms.
```

`http://loclahost:3000` をブラウザで開いてください。

"Hello, world!" というテキストが赤い文字色で表示されることを確認してください。

`<p>` タグの `class` 属性に指定されている `text-red-500` と `p-2` クラストークンは [Tailwind CSS](https://tailwindcss.com/) を利用するための記述です。

`text-red-500` トークンは `<p>` タグで囲んだ要素の文字色に coral red (`#ef4444`) を指定します。
`p-2` トークンは、`<p>` タグのパディングに 2 (8px/0.5rem) を指定します。

`dist` ディレクトリ内に `index.html` が生成されていることを確認してください。

このファイルは、`<html>` や `<head>` 要素を含む完全な HTML 文書になっています。


**tgweb** は、さらに Tailwind CSS の補助として `my_site/dist/css` ディレクトリの中に `tailwind.css` というファイルを生成します。

初期状態では、`my_site/dist/index.html` 内の `<title>` 要素が "No Title" と設定されています。この箇所については後ほど取り上げます。

### ファイル内容の変更

`my_site/src/pages/index.html` の内容を以下のように変更します。

```html
<body>
  <p class="p-2 text-green-500">Hello, world</p>
</body>
```

`http://localhost:3000` を表示しているブラウザが自動的に再読込され、"Hello, world!" の文字色が赤から緑に変更されます。

### tgweb サーバを停止する

ターミナルで `Ctrl + C` キーを押すと tgweb サーバが停止します。

## ディレクトリ構造

`npx tgweb-init` コマンドの実行によって以下のディレクトリ構造が生成されます。

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

以下は特記事項です。

* **tgweb** は `src` ディレクトリ内を走査し、HTML ファイルを `dist` ディレクトリ内に生成します。
* **tgweb** は `src` ディレクトリ内を走査し、画像ファイルと音声ファイルを `dist` ディレクトリ内に複製します。
* Tailwind CSS は、`dist` ディレクトリ内の HTML ファイルを走査し、`my_site/dist/css` ディレクトリ内に `tailwind.css` という名前の CSS ファイルを生成します。
* 上記の通りファイルが自動生成されるため、`my_site/dist` ディレクトリ内のファイルを手動で変更しても上書きにより失われます。
* ユーザが独自の CSS ファイルを追加することはできません。
* ユーザが独自の JavaScript ファイルを追加することはできません。

## 複数のウェブサイトを管理する方法

### インストールと初期化

[はじめに](#はじめに) セクションでは、tgweb を作業ディレクトリにインストールし、ひとつのウェブサイト構造を扱いました。
しかし、同一の作業ディレクトリ以下で複数のウェブサイト構造を構築することも可能です。

ここでは例として、ユーザのホームディレクトリの下層に `web` という作業ディレクトリがあると想定します。

tgweb を `npm` 経由でインストールする時点までは、ひとつのウェブサイト構造を構築する場合と手順は同じです。

```bash
mkdir ~/web
cd web
npm install tgweb@latest
```

作業ディレクトリ内に最初に構築するウェブサイトディレクトリの名前を決めます。
例として、`site_0` と名付けます。次に以下のコマンドを実行します。

```bash
npx tgweb-init site_0
```

このコマンドを実行することにより `sites` サブディレクトリが生成され、更にその中に `site_0` ディレクトリが生成されます。
`site_0` ディレクトリの中には、`src`、`dist` ディレクトリといくつかのファイルが生成されます。

作業ディレクトリ内に `sites` ディレクトリがある場合を、<ins>複数サイト構造</ins>とよび、
`sites` ディレクトリがない場合を<ins>単一サイト構造</ins>とよびます。

### ディレクトリ名を指定して tgweb サーバの起動する

上記のコマンドにより、tgweb は `web/sites/site_0/src/pages` ディレクトリ内に `index.html` を以下の内容で生成します。

```html
<body>
  <p class="p-2 text-red-500">Hello, world</p>
</body>
```

tgweb サーバの起動は以下のコマンドを実行します。

```bash
npx tgweb-server site_0
```

対象のウェブサイトのディレクトリ名を `npx tgweb-init` や `npx tgweb-server` の引数に渡すことで
ひとつの作業ディレクトリ内でも複数のウェブサイトを管理できます。

複数サイト構造を採用した場合、作業ディレクトリの構造は例えば以下のようになります。

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

`sites/` を含んだ表記でディレクトリ名を tgweb サーバのコマンド引数に渡すこともできます。

```bash
npx tgweb-server sites/site_0
```

コマンドを打ち込む文字数が増えますが、シェル補完によって末尾の番号を変更することが容易になります。

### 作業ディレクトリの構造を変える

単一サイト構造から複数サイト構造に作業ディレクトリの構造を変える場合は、以下のコマンドを実行します。
`site_0` のディレクトリ名は、適切なものに変更してください。

```bash
mkdir -p sites/site_0
mv dist src tailwind.* sites/site_0
```

反対に複数サイト構造から単一サイト構造に作業ディレクトリの構造を変える場合は、以下のコマンドを実行してください。

```bash
mv sites/site_0/* .
rm -rf sites
```

注意点として、上記のコマンドは、`sites` 下層のディレクトリに複数のディレクトリがあった場合 `site_0` 以外のディレクトリを削除します。

## ページ

### ページとは

**tgweb** では、ウェブサイトを構成するHTML文書は、テンプレートファイルの組み合わせから生成されます。 _ページ_ はそのようなテンプレート・ファイルの一種です。

ページ以外のテンプレートには、レイアウト、セグメント、ラッパー、アーティクル、部品があり、以降のセクションで順番に説明します。

ページは作業ディレクトリ下の`src/pages`サブディレクトリに置かれます。

`src/pages`ディレクトリの下にサブディレクトリを作り、その下にページを置くことも可能です。
ただし、`src/pages`ディレクトリ直下に以下のような名前のサブディレクトリを作ることはできません:

* `articles`
* `audios`
* `images`
* `tags`
* `videos`

すべてのウェブサイトは、`src/pages`ディレクトリに`index.html`という名前のファイルを持たなければなりません。
このページから、ウェブサイトの _ホームページ_ が作成されます。

### シンプルなページの追加

[レイアウト](#レイアウト)が適用されていないページは「シンプルページ」と呼ばれます。

次はシンプルページの例です:

```html
<body>
  <h1 class="text-2xl font-bold">Greeting</h1>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

ページのトップレベル要素は `<body>` 要素でなければならないことに注意してください。
通常のHTMLファイルとは異なり、tgwebページは `<html>` タグや `</html>` タグで囲まれておらず、`<head>` 要素もありません。
ページは完全なHTMLドキュメントに変換され、`dist` ディレクトリに書き込まれます。

例えば、`src/pages/index.html` は `dist/index.html` に、`src/pages/shops/new_york.html` は `dist/shops/new_york.html` に変換されます。

`<head>` 要素の内容は自動的に生成されます。
詳細は [後述](#managing-the-contents-of-the-head-element) します。

## フロントマター

### フロントマターブロック

テンプレートが `---` のみで構成される行で始まり、テンプレート内にそのような行がもう1行ある場合、この2行で囲まれた領域を _フロントマターブロック_ と呼びます。

この領域では、一連のプロパティに値を与えることができます。
このプロパティと値のペアのセットを _フロントマター_ と呼びます。

フロントマターブロックは [TOML](https://toml.io/en/)  フォーマットで記述されます。
次に示すのは、フロントマターブロックの例です:

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

上の例では、フロントマターブロックの4つの主要な構成要素が使われています。

* プロパティの定義
* テーブルヘッダー
* コメント
* 空白行

`#` 記号で始まる行はコメントとして無視されます。空白行も無視されます。

### プロパティの定義

`title = "Our Mission"` はプロパティ定義の例です。
等号の左側の `title` がプロパティの名前で、右側の `"Our Mission"` がプロパティの値です。

プロパティ名、等号、値は同じ行に記述する必要がありますが、値によっては複数行にまたがるものもあります。

プロパティ名が大文字と小文字、数字、アンダースコア、マイナス記号のみで構成されている場合は、引用符なしで書くことができます。;
そうでない場合は、次の例のように引用符で囲む必要がある。

```
"&_p" = "mb-2"
```

プロパティの値は、その型によって異なる方法で記述します。
文字列は常に引用符で囲む必要があります。
`100`、`-16`、`3.14` のように、整数と浮動小数点数は引用符で囲みません。
真偽値（`true` と `false`）も引用符で囲まず、小文字で記述します。
その他の書き方については、例が出てきたときに説明します。

### テーブルヘッダー

先の例で、`[data]` と `[style]` と書かれた行を _テーブルヘッダー_ と呼びます。

テーブルヘッダーは _テーブル_ の始まりを示します。テーブルは次のテーブルヘッダーまで、あるいはファイルの終わりまで続きます。

フロントマターブロックには以下のテーブル名があります:

* main
* data
* style
* meta.name
* meta.http-equiv
* meta.property
* link

このセクションでは、最初の2つについて説明します; 
他の4つは[Managing the Contents of the `<head>` Element](#managing-the-contents-of-the-head-element) で説明します。

### 定義済みプロパティ

フロントマターブロックの _main_ テーブルで、_定義済みプロパティ_ の値を設定します。

以下は定義済みプロパティの例です:

* `scheme`: HTMLドキュメントのURLのスキーム。`http` または `https` 。デフォルト: `http` 。
* `host`: HTMLドキュメントのURLのホスト名。デフォルト: `localhost`.
* `port`: HTMLドキュメントのURLのポート番号。 デフォルト: 3000.
* `url`: HTMLドキュメントのURL。
* `root-url`: HTMLドキュメントのルートURL。
* `title`: HTML文書のタイトル。
* `layout`: テンプレートに適用するレイアウトの名前。[Layouts](#layouts) を参照。
* `html-class`: `<html>` 要素の `class` 属性に設定された値。

通常、`scheme`、`host`、および `port` プロパティに値を指定する必要はありません。
これらのプロパティの値は、ウェブサイトがTeamgenikで公開されるときに適切に設定されます。
`url` プロパティの値は、これらのプロパティとページまたは記事へのパスから生成されます。その値は読み取り専用です。

以下の3つのプロパティは、記事においてのみ意味を持ちます:

* `index`: 記事の並べ替えに使われる整数値。
* `tags`: 記事を分類する文字列または文字列の配列。
* `embedded-only`: `true` ならば、HTMLドキュメントは作成されない。デフォルト: `false`。

詳細は [Articles](#articles) を参照してください。

### テンプレートにプロパティ値を埋め込む

定義済みのプロパティの値は `<tg:prop>` 要素によってテンプレートに埋め込むことができます。

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

### カスタムプロパティ

すでに述べたように、フロントマターブロックの `[data]` は「data」テーブルの始まりを示します。

「data」テーブル内では、カスタムプロパティを定義することができます。ウェブサイト作成者は、任意の名前のカスタムプロパティに値を設定することができます。カスタムプロパティの値は、文字列か10進数表記の数値でなければなりません。

カスタムプロパティの値は `<tg:data>` 要素によってテンプレートに埋め込むことができます。

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

また、`${...}` 記法を使えば、カスタムプロパティの値をHTML要素の属性値に埋め込むこともできます。

```html
---
[data]
div-id = "special"
---
<body>
  <div id="${div-id}">...</div>
</body>
```

しかし、`${...}` 記法は `class` 属性に対しては意味がありません。;
プロパティの値を `class` 属性に埋め込む方法については後で説明します。

### スタイルエイリアスの定義

「style」テーブルで定義されたプロパティは、クラストークンのセットにエイリアスを与えるために使用することができます。
これを _スタイル・エイリアス_ と呼びます。スタイルエイリアスの値は文字列のみです。

定義されたスタイルエイリアスを `class` 属性の値に埋め込むには、 `tg:class` 属性を使います。

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

上記のテンプレートに含まれるエイリアスを展開すると、以下の結果が得られます：

```html
<body>
  <div class="w-24 h-24 md:w-48 md:h-48 bg-blue-500 rounded-xl p-8 m-4">
    Hello, world!
  </div>
</body>
```

クラストークンの長いシーケンスは、3つの引用符で囲んで数行にわたって書くことができます。

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

連続する3つのダブルクォーテーション(`"""`)は、複数行の文字列の開始と終了を示します。

HTML要素の `class` 属性に埋め込まれる前に、プロパティの値は以下のように変換されます：

* 含まれる改行文字はすべてスペースに置き換えられる。
* 連続する先頭と末尾の空白は削除される。
* 連続したスペースは1つのスペースに置き換えられる。

要素が `class` 属性と `tg:class` 属性の両方を持つ場合、両方の値を合わせたものが最終的な `class` 属性の値となります。

### 修飾子の拡張

[レスポンシブデザイン](https://tailwindcss.com/docs/responsive-design) を実現するために、Tailwind CSS修飾子を使って以下のスタイルエイリアスを定義するとよいでしょう。

```toml
box = """
  w-16 h-16 p-1 border border-1 rounded
  md:w-32 md:h-32 md:p-2 md:rounded-md
  lg:w-48 md:h-48 lg:p-3 lg:rounded-lg
  """
```

`md:` や `lg:` のような修飾語の繰り返しが気になる場合は、次のように `{...}` 表記を使うと削除できます。

```toml
box = """
  w-16 h-16 p-1 border border-1 rounded
  md { w-32 h-32 p-2 rounded-md }
  lg { w-48 h-48 p-3 rounded-lg }
  """
```

`{...}` 表記は、[arbitrary variants](https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants) の活用に特に役立ちます。

次のようなスタイル・エイリアス `blog-article` を作成したと仮定します:

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

次のように使用できます:

```html
<article tg:class="blog-article">
  <h2>Title</h2>
  <p>Lorem ipsum dolor sit amet.</p>
  <p>Consectetur adipiscing elit.</p>
  <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
</article>
```

そうすれば、以下のように `{...}` の表記を使うことで、上記の例で `[&_h2]` と `[&_p]` の繰り返しをなくすことができます。

```toml
blog-article = """
  text-gray-900
  [&_*]:mb-2
  [&_*:last-child]:mb-0
  [&_h2] { text-xl font-bold tracking-wide capitalize }
  [&_p] { font-serif leading-5 }
  """
```

### サイト属性

`src` ディレクトリに `site.toml` という名前のファイルを作成すると、サイトレベルでプロパティの値を設定することができます。 ここで設定された値は、各ページのフロントマターで設定されたプロパティのデフォルト値となります。

`src/site.toml`

```toml
title = "No title"
layout = "common"

[data]
current-year = 2023
```

### `%{...}` 記法

画像や音声ファイルのURLを `<meta>` 要素の `content` 属性に埋め込むには `%{...}` 表記を使います:

```toml
[data]
icon-url = "%{images/icons/default.png}"
theme-url = "%{audios/our_theme.mp3}"
```

具体的な使用例については [<meta> elements](#meta-elements)を参照してください。

## カラースキーム

### カスタムカラー名

`src` ディレクトリの `color_scheme.toml` を編集することで、Tailwind CSSのカスタムカラー名を定義することができます。

カスタムカラー名は _パレット_ と _修飾子_ の組み合わせです。
パレットは3文字のアルファベット、修飾子は1文字のアルファベットです。
パレットと修飾子は、`bas-s` や `neu-d` のようにマイナス記号で結ばれます。

以下は利用可能なパレットとその用途の一覧です。

* **bas**: ベースカラー（ウェブサイト全体の背景色）
* **neu**: ニュートラルカラー（グレー、ベージュ、アイボリーなどの落ち着いた色）
* **pri**: プライマリーカラー（ベースカラーと中間色以外で最も使用頻度の高い色）
* **sec**: セカンダリーカラー (ベースカラーとニュートラルカラー以外で2番目によく使われる色)
* **acc**: アクセントカラー (ベースカラーとニュートラルカラー以外で3番目に使用頻度の高い色)
* **nav**: ナビゲーションカラー (ナビゲーション・バーまたはサイドバーの背景色)

以下は、修飾子とその意味の一覧です。

* **s**: 標準
* **b**: より明るい
* **d**: より暗い
* **c**: 対照的

ここでいう「対照的」とは、標準色の背景にその色でテキストを描いたときに視認性のよい色を意味します。

`src/color_scheme.toml`

```toml
bas-s = "#3d4451"
bas-c = "#a0aec0"
pri-s = "#45ba9f"
sec-s = "#70365d"
```

定義されたカスタムカラー名は、Tailwind CSSクラスを構成する色の名前として使用できます。例えば、`pri-s` と定義された色を要素の背景色として設定するには、その要素の `class` 属性に `bg-pri-s` クラスを指定します。

### daisyUI カラー名

また、`primary`, `secondary`, `success`, `warning` のように、[daisyUI](https://daisyui.com/) で指定された色名を使うこともできます。詳細については、daisyUIドキュメンテーションの [Colors](https://daisyui.com/docs/colors/) を参照してください。

現時点では、tgwebはdaisyUIのテーマの切り替えをサポートしていないことに注意してください。

## 画像

画像ファイルは、作業ディレクトリの下の `src/images` サブディレクトリに置かれます。

ページに画像を埋め込むには2つの方法があります。1 つは `<img>` 要素を使用する方法、もう 1 つは画像を要素の背景として設定する方法です。

Teamgenikは以下の形式の画像ファイルをサポートしています:

* AVIF ('.avif')
* BMP ('.bmp')
* GIF ('.gif')
* JPEG ('.jpg', '.jpeg')
* PNG ('.png')
* WEBP ('.webp')

### `<img>` 要素

`<img>` 要素の `src` 属性に画像ファイルの絶対パスが含まれていれば、画像はページに埋め込まれます。

```html
<img src="/images/smile.png" alt="Smile face">
```

Teamgenik が自動的に指定するので、`<img>` タグに `width` 属性と `height` 属性を記述する必要はありません。

`src` 属性の値は画像ファイルのパスは _絶対_ パスであることに注意してください。ウェブサイトがTeamgenikで公開されると、`<img>` 要素の `src` 属性の値は適切に変換されます。

また、Teamgenikでは `<img>` 要素で外部URLを参照することはできません。

#### ヒント

画像コンテナのサイズに合わせて画像のサイズを変更したい場合は、Tailwind CSSが提供する以下のクラストークンを使用します:

* `object-cover`: コンテナを覆うように画像のサイズを変更する
* `object-contain`: コンテナ内に収まるように画像のサイズを変更する
* `object-fill`: コンテナに合わせて画像を引き伸ばす
* `object-scale-down`: 画像をオリジナルサイズで表示し、必要に応じてコンテナに合わせて縮小する

詳細については、Tailwind CSS ドキュメントの [Object Fit](https://tailwindcss.com/docs/object-fit) セクションを参照してください。

### 背景画像

`images/smile.png` を `<div>` 要素の背景画像として埋め込むには、次のように記述します:

```html
<div class="bg-[url(../images/smile.png)]"></div>
```

Tailwind CSS はこの `class` 属性を検出すると、適切なCSSフラグメントを `dist/css/tailwind.css` に書き込みます。

括弧の中は `css/tailwind.css` から画像ファイルまでの相対パスであることに注意してください。
`src/images/smile.png` を `src/pages/foo/bar.html` に埋め込む場合でも、背景画像として埋め込む場合は、括弧内に `../../images/smile.png` ではなく `../images/smile.png` を指定します。

#### ヒント

背景画像のレンダリングを調整したい場合は、Tailwind CSSが提供する以下のクラストークンを使用してください:

* `bg-center`: 背景画像を背景レイヤーの中央に配置する
* `bg-repeat`: 背景画像を縦横に繰り返す
* `bg-repeat-x`: 背景画像を水平に繰り返す
* `bg-repeat-y`: 背景画像を縦に繰り返す
* `bg-cover`: 背景レイヤーを埋めるまで背景画像を拡大縮小する
* `bg-contain`: トリミングや引き伸ばしをせずに、背景画像を外縁まで拡大縮小する

詳細については、Tailwind CSS ドキュメントの [Background Position](https://tailwindcss.com/docs/background-position), [Background Repeat](https://tailwindcss.com/docs/background-repeat) , [Background Size](https://tailwindcss.com/docs/background-size) セクションを参照してください。

## 音声

音声ファイルは、作業ディレクトリの下の `src/audio` サブディレクトリに置かれます。

Teamgenikは以下の形式の音声ファイルをサポートしています:

* AAC ('.m4a')
* MP3 ('.mp3')
* Ogg Vorbis (`.ogg`)
* WAV (`.wav`)

### `<audio>` 要素

`<audio>` 要素で音声コンテンツを再生するUIオブジェクトを埋め込むことができます。

`<audio>` 要素を構成するには2つの方法があります。

ひとつは、`<audio>` 要素自体の `src` 属性に音声ファイルの _絶対_ パスを指定する方法です。

```html
<audio controls src="/audios/theme.mp3">
  <a href="/audios/theme.mp3">Download</a>
</audio>
```

ブラウザが `<audio>` 要素をサポートしていない場合、`<audio>` 要素の内容が表示されます。

もう一つは、`<audio>` 要素の中に1つ以上の `<source>` 要素を配置し、その `src` 属性に音声ファイルの絶対パスを指定する方法です。

```html
<audio controls>
  <source src="/audios/theme.ogg" type="audio/ogg">
  <source src="/audios/theme.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
```

Teamgenikでは、`<audio>` 要素と `<source>` 要素で外部URLを参照することはできません。

## フォントとアイコン

### Material Symbols

`sites.toml` の `font.material-symbols` テーブルの `outlined`、`rounded`、`sharp` プロパティの値を `true` に設定することで、Googleが提供する [Material Symbols](https://developers.google.com/fonts/docs/material_symbols) があなたのウェブサイトで利用可能になります。

```toml
[font.material-symbols]
outlined = true
rounded = true
sharp = true
```

このように書くことで、すべてのスタイルの Material Symbols が利用できるようになります。
ただし、一部のスタイルしか使用しない場合は、未使用のスタイル名を持つプロパティに `false` を指定することで、ウェブサイト訪問者の負荷を軽減すべきです。

```toml
[font.material-symbols]
outlined = false
rounded = false
sharp = true
```

あるいは、未使用のスタイル名を持つプロパティ自体を `site.toml` から削除しても構いません。

```toml
[font.material-symbols]
sharp = true
```

#### 変数の調整

Material Symbols には書体を調整するための4つの _変数_ が用意されています。
これらを指定するには、次のように記述してください:

```toml
[font.material-symbols]
rounded = { fill: 1, wght: 200, grad: 0, opsz: 24 }
sharp = { fill: 0, wght: 300, grad: 200, opsz: 40 }
```

`fill` は塗りつぶしの有無を制御する変数です。0 なら「なし」、1 なら「あり」を意味します。デフォルト値は0です。

`wght` はアイコンの「太さ（weight）」を決定する変数です。100, 200, 300, 400, 500, 600, 700 のいずれかを指定できます。100が最も細く、700が最も太くなります。デフォルト値は400です。

`grad` はアイコンの「グレード（grade）」を決定する変数です。この変数の値を変更することで、アイコンの太さを微調整できます。指定できる値は -25, 0, 200 のいずれかです。デフォルト値は0です。負の値を指定するとアイコンの線がより細くなり、正の値を指定するとアイコンの線がより太くなります。

`opsz` はアイコンの「光学サイズ（optical size）」を決定する変数です。光学サイズとは、アイコンの推奨表示サイズを示します。20, 24, 40, 48 のいずれかを指定できます。デフォルト値は24です。一般に、光学サイズの値を大きくすると、線がより細く、空間がより狭く、x-height （ベースラインと書体の小文字の平均線との間の距離）がより短くなります。

### 異体

ひとつのスタイルに対して変数の値が異なる複数の異体（variants）を用意したい場合は、次のようにスタイル名の後にドットと異体名を加えてください。

```toml
[font.material-symbols]
outlined = true
rounded = { fill: 0, wght: 200, grad: 0, opsz: 24 }
rounded.strong = { fill: 1, wght: 400, grad: 0, opsz: 24 }
rounded.bold = { fill: 0, wght: 700, grad: 0, opsz: 24 }
```

#### 利用例

「ホーム」アイコン（outlined）:

```html
<span class="material-symbols-outlined">home</span>
```

「削除」アイコン（rounded）:

```html
<span class="material-symbols-rounded">delete</span>
```

「買い物かご」アイコン（sharp）:

```html
<span class="material-symbols-sharp">shopping_bag</span>
```

「星」アイコン（rounded）の異体「strong」:

```html
<span class="material-symbols-rounded.strong">star</span>
```

### Google Fonts

[Google Fonts](https://fonts.google.com/) のRobotoフォントファミリーは、`site.toml` の "font.google-fonts" テーブルで以下のように設定することで、あなたのウェブサイトで使用することができます。

```toml
Roboto = true
```

以下はRobotフォントファミリーの使用例です：

```html
<p class="font-['Roboto']">Hello, world!</p>
```

フォントファミリ名にスペースが含まれている場合は、下記のように二重引用符で囲む必要があります：

```toml
"Noto Sans Japanese" = true
```

また、HTMLテンプレートで使用する場合は、スペースをアンダースコアに置き換えてください。

```html
<p class="font-['Noto_Sans_Japanese']">こんにちは、世界！</p>
```

フォントファイルのサイズを小さくするために、いくつかのフォントウェイト（太さ）を選択するには、`true`の代わりにウェイトを配列で指定します。

```toml
"Noto Sans Japanese" = [400, 800]
```

次の例では、ウェイトが 800 の Noto Sans Japaneseフォントファミリーを使用しています。

```html
<p class="font-['Noto_Sans_Japanese'] font-[800]">こんにちは、世界！</p>
```

各スタイルのフォントのウェイトを選択するには、以下のようにインライン・テーブルを使ってウェイトを指定する：

```toml
"Pathway Extreme" = { normal = [400, 800], italic = [400] }
```

以下の例では、イタリック体の Pathway Extreme フォントファミリーをウェイトを 400 で使用しています。

```html
<p class="font-['Pathway_Extreme'] italic font-[400]">Hello, world!</p>
```

## レイアウト

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
  <footer>&copy; Example Inc. <tg:prop name="year"></tg:prop></footer>
</body>
```

`src/pages/greeting.html`

```html
---
layout = "common"
title = "Greeting"
year = "2023"
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
However, if the following two conditions are not met, the entire element is deleted:

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

`src/pages/home.html`

```html
---
[data]
custom-name = "Alice"
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
The `<tg:content>` element indicates where in the wrapper the page will be inserted.

#### Example

`src/pages/_wrapper.html`

```html
<div class="[&_p]:mt-4">
  <tg:content></tg:content>
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
layout = "common"
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
layout = "common"
---
<div class="[&_p]:mt-4">
  <tg:content></tg:content>
</div>
```

`src/pages/index.html`

```html
<h1>Welcome!</h1>
<div class="bg-green-300 p-4">
  <p>Hello, world!</p>
</div>
```

## Segments

### Segment files

A _segment_ is a template file that can be embedded in pages, layouts or segments.
Segments cannot be embedded in templates other than these types, such as articles,
wrappers or components.

In order to embed one segment into another, certain conditions must be met.
See [Segment layers](#segment-layers).

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

You can pass custom properties to a segment using the `<tg:segment> element's `tg:data-*` attribute.

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
  <tg:segment name="hero" tg:data-image-path="hello.jpg"></tg:segment>

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

### Segment layers

Segments have a property called _layer_. This predefined property controls the hierarchical
relationship between segments.

The value of this property must be an integer greater than or equal to 0, and its default value is 0.
To embed one segment A into another segment B, the layer of A must be larger than the layer of B.

#### Example

`src/segment/foo.html`

```html
---
layer = 0
---

<tg:segment name="bar"></tg:segment>
```

`src/segment/bar.html`


```html
---
layer = 1
---

<div>Bar</div>
```

## Components

### Component files

A _components_ is a template file that can be embedded in pages, segments, articles and layouts.
However, embedding a component in another is not allowed.

Components are placed in the `src/components` subdirectory of the working directory.

The following is an example of a component:

`src/components/smile.html`

```html
<span class="inline-block border-solid border-2 border-black rounded p-2">
  <span class="material-symbols-outlined">sentiment_satisfied</span>
</span>
```
Note that you should set the `font.material-symbols` property to `true` in the `sites.toml`
in order to display the above smile icon. See [Material Symbols](#material-symbols).

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

You can pass custom properties to a component using the `<tg:component> element's `tg:data-*`
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
  <tg:component name="avatar" tg:data-name="Alice"></tg:component>
  <tg:component name="avatar" tg:data-name="Bob"></tg:component>
  <tg:component name="avatar" tg:data-name="Carol"></tg:component>
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
  <divclass="text-right">
    <tg:slot name="date"></tg:slot>
  </div>
</tg:if-complete>
```

`src/pages/hello.html`

```html
---
layout: home
---
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
message: Hi!
---
<span>
  <i class="fas fa-smile"></i>
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

### `embedded-only` property

When the value of the `embedded-only` property of an article is set to `true`, it is not converted
into a full HTML file, but is used only for embedding in a page or segment:

```html
---
embedded-only = true
---
<h3>Greeting</h3>
<p>Hello, world!</p>
```

### Embedding articles in a page

The `<tg:articles>` element can be used to embed multiple articles into a page or segment.

```html
---
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
layout = "home"
---
<main>
  <h1>Our Proposals</h1>
  <tg:articles pattern="proposals/*" order-by="filename:desc"></tg:articles>
</main>
```

### Sorting articles by their title

To sort articles by their title, set the `order-by` attribute of the `<tg:articles>` element
to `"title:asc"` or `"title:desc"`:

```html
---
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

### Filtering articles by tags

You may use _tags_ to classify your articles.

To attach tags to an article, specify their names in the `tags` property as an array
using `[...]` notation:

```html
---
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
tags = "anime"
---
<article>
  ...
</article>
```

You can use the `filter` attribute to filter articles embedded on the page:

```html
---
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

## リンク

### ウェブサイト内のリンク

`<a>` 要素を使ってウェブサイト内のページにリンクする場合は、`href` 属性でページの _絶対_ パスを指定します:

```html
<nav>
  <a href="/articles/goal">Our Goal</a>
  <a href="/articles/about">About Us</a>
</nav>
```

ウェブサイトが Teamgenik で公開されると、その中の `<a>` 要素の `href` 属性の値は適切に変換されます。

### `<tg:link>`、 `<tg:if-current>` 、 `<tg:label>`

`<tg:link>` は、 `<a>` 要素を条件付きで出現させるために使われる特別な要素です。
基本的に、この要素の内容はそのままレンダリングされます。

`<tg:link>` 要素の中に `"#"` の `href` 属性を持つ `<a>` 要素がある場合、`<tg:link>` 要素の `href` 属性の値が `<a>` 要素の `href` 属性に設定されます。

次のコードは `<a href="/articles/goal">Our Goal</a>` としてレンダリングされます:

```html
<tg:link href="/articles/goal.html">
  <a href="#">Our Goal</a>
</tg:link>
```

しかし、`/articles/goal.html` というパスを持つアーティクルが上記のコードを含む場合、この部分は生成されたHTMLドキュメントから削除されます。

0個または1個の `<tg:if-current>` 要素を `<tg:link>` 要素の中に入れることができます。
`<tg:if-current>` 要素の内容は、`<tg:link>` 要素の `href` 属性の値が、生成されるHTML文書のパスと一致する場合にのみレンダリングされます。

次のコードは、`/articles/goal.html` というパスを持つアーティクルの中で `<span class="font-bold">Our Goal</span>` としてレンダリングされます。

```html
<tg:link href="/articles/goal.html">
  <a href="#">Our Goal</a>
  <tg:if-current>
    <span class="font-bold">Our Goal</span>
  </tg:if-current>
</tg:link>
```

`<tg:label>` 要素を使えば、上記のコードから重複を取り除くことができます。

```html
<tg:link href="/articles/goal.html" label="Our Goal">
  <a href="#"><tg:label></tg:label></a>
  <tg:if-current>
    <span class="font-bold"><tg:label></tg:label></span>
  </tg:if-current>
</tg:link>
```

この要素は、`<tg:link>` 要素の `label` 属性で指定された値で置き換えられます。

#### 例

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

###  `<tg:link>` に `component` 属性を付ける

`<tg:link>` 要素に `component` 属性があると、その値に対応する名前の部品の内容が `<tg:link>` 要素の内容になります。

例えば、次のような内容の `nav_link` 部品があるとします。

`src/components/nav_link.html`

```html
<a href="#" class="underline text-blue-500"><tg:label></tg:label></a>
<tg:if-current>
  <span class="font-bold"><tg:label></tg:label></span>
</tg:if-current>
```

この場合、`<tg:link>` 要素は次のように構成できます：

```html
<tg:link component="nav_link" href="/articles/goal.html" label="Our Goal"></tg:link>
```

上記のコードは、以下のコードとまったく同じと解釈されます。

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
There must be more than one element with the `tg:item` attribute in the switcher.
We call them _switcher items_.

Swticher items are assigned unique _index numbers_ starting from zero in sequence.
A switcher has a state represented by an integer value, called an _current index number_.
A switcher item will only be displayed if its index number matches the current index number of the
switcher.

When the user clicks or taps an element with a `tg:choose` attribute inside the switcher,
the switcher's current index number is set to the value of the the attribute.

Here is an example switcher:

```html
<div tg:switcher>
  <div tg:item>A</div>
  <div tg:item>B</div>
  <div tg:item>C</div>
  <div tg:item>D</div>
  <div tg:item>E</div>
  <nav>
    <button type="button" tg:choose="1">a</button>
    <button type="button" tg:choose="2">b</button>
    <button type="button" tg:choose="3">c</button>
    <button type="button" tg:choose="4">d</button>
    <button type="button" tg:choose="5">e</button>
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
    tg:choose="1"
    class="btn"
    tg:current-class="btn-primary"
    tg:normal-class="btn-secondary">a</button>
```

You can create a button that change the state of the switcher using special attributes such as
`tg:first`, `tg:prev`, `tg:next`, `tg:last`, etc. instead of the `tg:choose` attribute.

```html
<div tg:switcher>
  <div tg:item>A</div>
  <div tg:item>B</div>
  <div tg:item>C</div>
  <div tg:item>D</div>
  <div tg:item>E</div>
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
<div tg:switcher tg:interval="2000">
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
<div tg:rotator tg:interval="2000">
  <div tg:when="1">A</div>
  <div tg:when="2">B</div>
  <div tg:when="3">C</div>
  <div tg:when="4">D</div>
  <div tg:when="5">E</div>
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
`tg:duration` attribute of the carousel.

```html
<div tg:carousel tg:interval="3000" tg:duration="500">
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

If the `tg:duration` attribute is set on the carousel, a user clicking/tapping the "prev" or
"next" button while the carousel body is shifting horizontally will have no effect.
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

When the `tg:duration` attribute is set on the carousel, a user clicking/tapping the pagination
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

### Tram

#### Basics

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
description = Description
robots = "index,follow"
generator = Teamgenik
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
[http-equiv]
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
belon to "link" table.

```toml
[link]
archives = "https://example.com/archives/"
license = "%{/copyright.html}"
```

The above will generate the following `<link>` elements

```html
<link rel="archives" content="https://example.com/archives/">
<link rel="license" content="http://localhost:3000/copyright.html">
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

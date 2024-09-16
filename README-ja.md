# tgweb - Teamgenik ウェブサイトビルダー オフラインツール

## 目次

* [必要環境](#必要環境)
* [はじめに](#はじめに)
* [ディレクトリ構造](#ディレクトリ構造)
* [複数のウェブサイトを管理する方法](#複数のウェブサイトを管理する方法)
* [ページ](#ページ)
* [フロントマター](#フロントマター)
* [配色](#配色)
* [画像](#画像)
* [アニメーション](#アニメーション)
* [音声](#音声)
* [フォントとアイコン](#フォントとアイコン)
* [レイアウト](#レイアウト)
* [ラッパー](#ラッパー)
* [セグメント](#セグメント)
* [部品](#部品)
* [アーティクル](#アーティクル)
* [何が何に埋め込めるのか?](#何が何に埋め込めるのか)
* [リンク](#リンク)
* [リンクリスト](#リンクリスト)
* [動的要素](#動的要素)
  * [Modal](#modal)
  * [Toggler](#toggler)
  * [Switcher](#switcher)
  * [Rotator](#rotator)
  * [Carousel](#carousel)
  * [Scheduler](#scheduler)
  * [Tram](#tram)
  * [Notes on Alpine.js](#nodes-on-alpinejs)
* [ミニアプリの埋め込み](#ミニアプリの埋め込み)
* [サイトプロパティとプロパティの継承](#サイトプロパティとプロパティの継承)
* [head要素の内容の管理](#head要素の内容の管理)
* [特殊なタグと属性のリスト](#特殊なタグと属性のリスト)
* [TODO List](#todo-list)
* [License](#license)

## 必要環境

* Node.js: 20 以上
* npm: 8.0 以上

## はじめに

### インストール

まず最初に、**tgweb** 用の「作業ディレクトリ」を作成します。ディレクトリの場所はどこでもかまいません。
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

### 配布用ウェブサイトデータの生成

配布用ウェブサイトデータを生成するには、以下のコマンドを実行します。

```bash
npx tgweb-dist
```

## ディレクトリ構造

`npx tgweb-init` コマンドの実行によって以下のディレクトリ構造が生成されます。

```plain
.
├── dist
├── node_modules
├── src
│   ├── animations
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

[はじめに](#はじめに) では、tgweb を作業ディレクトリにインストールし、ひとつのウェブサイト構造を扱いました。
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

作業ディレクトリ内に `sites` ディレクトリがある場合を、「複数サイト構造」とよび、
`sites` ディレクトリがない場合を「単一サイト構造」とよびます。

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
    │       ├── animations
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
            ├── animations
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

### ディレクトリ名を指定して配布用ウェブサイトデータを生成する

サブディレクトリ `sites/_site_0` にあるウェブサイトの配布用データを生刺青するには、以下のコマンドを実行します。

```bash
npx tgweb-dist site_0
```

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

### `src` ディレクトリのアーカイブ

`npx tgweb-archive` コマンドを使用すると `src` ディレクトリをZIP形式で圧縮したファイルを作ることができます。

単一サイト構造の場合、作業ディレクトリ上でこのコマンドを実行すると作業ディレクトリの名前に拡張子 `.zip` を加えた名前のアーカイブファイルがカレントディレクトリに作られます。

複数サイト構造の場合、作業ディレクトリ上で `npx tgweb-archive site_0` のように対象ウェブサイトのディレクトリ名を指定してください。その結果、そのディレクトリ名に拡張子 `.zip` を加えた名前のアーカイブファイルがカレントディレクトリ作られます。

## ページ

### ページとは

**tgweb** では、ウェブサイトを構成するHTML文書は、テンプレートファイルの組み合わせから生成されます。「ページ」はそのようなテンプレート・ファイルの一種です。

ページ以外のテンプレートには、レイアウト、セグメント、ラッパー、アーティクル、部品があり、以降で順番に説明します。

ページは作業ディレクトリ下の`src/pages`サブディレクトリに置かれます。

`src/pages`ディレクトリの下にサブディレクトリを作り、その下にページを置くことも可能です。
ただし、`src/pages`ディレクトリ直下に以下のような名前のサブディレクトリを作ることはできません:

* `animations`
* `articles`
* `audios`
* `images`
* `tags`
* `videos`

すべてのウェブサイトは、`src/pages`ディレクトリに`index.html`という名前のファイルを持たなければなりません。
このページから、ウェブサイトの「ホームページ」が作成されます。

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

#### 例

`src/pages/index.html` を上のシンプルページの内容に変更します。

`dist/index.html` には次のような `<html>` や `<head>` 要素を含む完全なHTML文書が生成されます。

```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <body>
      <h1 class="text-2xl font-bold">Greeting</h1>
      <div class="bg-green-300 p-4">
        <p>Hello, world!</p>
      </div>
    </body>
  </body>
</html>
```

`<head>` 要素の内容は自動的に生成されます。
詳細は [後述](#managing-the-contents-of-the-head-element) します。

ブラウザでこのページを開くには、URLとして `http://localhost:3000` を指定します。

## フロントマター

### フロントマターブロック

テンプレートが `---` のみで構成される行で始まり、テンプレート内にそのような行がもう1行ある場合、この2行で囲まれた領域を「フロントマターブロック」と呼びます。

この領域では、一連のプロパティに値を与えることができます。
このプロパティと値のペアのセットを「フロントマター」と呼びます。

フロントマターブロックは [TOML](https://toml.io/en/) フォーマットで記述されます。
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
* セクションヘッダー
* コメント
* 空白行

`#` 記号で始まる行はコメントとして無視されます。空白行も無視されます。

### フロントマターファイル

テンプレートファイルのファイル名の本体に拡張子 `.toml` を加えた名前を持つファイルが存在するとき、そのファイルの中身はテンプレートファイルのフロントマターとして解釈されます。そのファイルは**フロントマターファイル**と呼ばれます。

例えば、`src/pages` ディレクトリに `index.html` と `index.toml` が存在するとき、後者は前者のフロントマターファイルとなります。

テンプレートファイルがフロントマターブロックとフロントマターファイルの両方を持つ場合は、フロントマターファイルが優先されます。

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

### セクションヘッダー

先の例で、`[data]` と `[style]` と書かれた行を「セクションヘッダー」と呼びます。TOMLでは「テーブルヘッダー」と呼びますが、Tgwebでは「セクションヘッダー」と呼びます。

セクションヘッダーは「セクション」の始まりを示します。セクションは次のセクションヘッダーまで、あるいはファイルの終わりまで続きます。

フロントマターブロックには以下のセクション名があります:

* main
* data
* style
* meta.name
* meta.http-equiv
* meta.property
* link

ここでは、最初の3つについて説明します;
他の3つは[head要素の内容の管理](#head要素の内容の管理) で説明します。

### 定義済みプロパティ

フロントマターブロックの「main」セクションで、「定義済みプロパティ」の値を設定します。

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
`url` プロパティの値は、これらのプロパティとページまたはアーティクルへのパスから生成されます。その値は読み取り専用です。

以下の3つのプロパティは、アーティクルにおいてのみ意味を持ちます:

* `index`: アーティクの並べ替えに使われる整数値。
* `tags`: アーティクを分類する文字列または文字列の配列。
* `embedded-only`: `true` ならば、HTMLドキュメントは作成されない。デフォルト: `false`。

詳細は [アーティクル](#アーティクル) を参照してください。

`shared-wrapper` プロパティはラッパーにおいてのみ意味を持ちます。
詳細は [共有ラッパー](#共有ラッパー) を参照してください。

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

すでに述べたように、フロントマターブロックの `[data]` は「data」セクションの始まりを示します。

「data」セクション内では、カスタムプロパティを定義することができます。ウェブサイト作成者は、任意の名前のカスタムプロパティに値を設定することができます。カスタムプロパティの値は、文字列か10進数表記の数値でなければなりません。

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

「style」セクションで定義されたプロパティは、クラストークンのセットにエイリアスを与えるために使用することができます。
これを「スタイル・エイリアス」と呼びます。スタイルエイリアスの値は文字列のみです。

定義されたスタイルエイリアスを `class` 属性の値に埋め込むには、`tg:class` 属性を使います。

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

### プロパティの継承
ページのフロントマターで特定のプロパティに値が設定されていない場合、ラッパーやレイアウトのフロントマターやサイトプロパティを検索します。詳しくは、[サイトプロパティとプロパティの継承](#サイトプロパティとプロパティの継承) を参照してください。

## 配色

### カスタムカラー名

`src` ディレクトリの `color_scheme.toml` を編集することで、Tailwind CSSのカスタムカラー名を定義することができます。

カスタムカラー名は「パレット」と「修飾子」の組み合わせです。
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

`src` 属性の値は画像ファイルのパスは「絶対」パスであることに注意してください。ウェブサイトがTeamgenikで公開されると、`<img>` 要素の `src` 属性の値は適切に変換されます。

また、Teamgenikでは `<img>` 要素で外部URLを参照することはできません。

#### ヒント

画像コンテナのサイズに合わせて画像のサイズを変更したい場合は、Tailwind CSSが提供する以下のクラストークンを使用します:

* `object-cover`: コンテナを覆うように画像のサイズを変更する
* `object-contain`: コンテナ内に収まるように画像のサイズを変更する
* `object-fill`: コンテナに合わせて画像を引き伸ばす
* `object-scale-down`: 画像をオリジナルサイズで表示し、必要に応じてコンテナに合わせて縮小する

詳細については、Tailwind CSS ドキュメントの [Object Fit](https://tailwindcss.com/docs/object-fit) を参照してください。

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

詳細については、Tailwind CSS ドキュメントの [Background Position](https://tailwindcss.com/docs/background-position), [Background Repeat](https://tailwindcss.com/docs/background-repeat) , [Background Size](https://tailwindcss.com/docs/background-size) を参照してください。

## アニメーション

Tgweb は Lottie 形式のアニメーションファイルに対応しています。アニメーションファイルは、作業ディレクトリの下の `src/animations` サブディレクトリに置かれます。

アニメーションファイルの拡張子は `.json` または `.lottie` です。

### `<tg:animation>` 要素

`<tg:animation>` 要素でアニメーションを Web ページ内に埋め込むことができます。その `src` 属性にアニメーションファイルの名前を指定すればアニメーションが再生されます。次の例は、`src/animations` サブディレクトリに置かれたアニメーションファイル `cat.json` を再生します。

```html
<tg:animation src="cat.json"></tg:animation>
```

次の例は、`src/animations/common` サブディレクトリに置かれたアニメーションファイル `flag.lottie` を再生します。

```html
<tg:animation src="common/flag.lottie"></tg:animation>
```

デフォルトでアニメーションは 300px の幅と 150px の高さで表示されます。幅と高さを調整するには、`<tg:animation>` 要素に対して `width` および `height` 属性に整数値を指定してください。

```html
<tg:animation src="cat.json" width="100" height="100"></tg:animation>
```
アニメーションの背景色等を調整するには、`<tg:animation>` 要素に対して `class` 属性を指定してください。

```html
<tg:animation src="cat.json" class="bg-red-200"></tg:animation>
```

`<tg:animation>` 要素には他に以下の属性を設定できます：

* `loop`: ループ再生するかどうかを示す真偽値（デフォルト: `"true"`）
* `autoplay`: 自動再生するかどうかを示す真偽値（デフォルト: `"true"`）
* `click`: クリックまたはタップで再生状態をトグルするかどうかを示す真偽値（デフォルト: `"false"`）
* `hover`: マウスホーバー中のみ再生するかどうかを示す真偽値（デフォルト: `"false"`）

`click` 属性と `hover` 属性の値がともに `"true"` の場合、`click` 属性のみが有効となります。
また、`autoplay` 属性が `"true"` の場合、`hover` 属性は無視されます。

アニメーションファイルの入手または作成する方法については、[LottieFiles](https://lottiefiles.com/jp/) を参照してください。

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

ひとつは、`<audio>` 要素自体の `src` 属性に音声ファイルの「絶対」パスを指定する方法です。

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

### マテリアル シンボル

`sites.toml` の `font.material-symbols` セクションの `outlined`、`rounded`、`sharp` プロパティの値を `true` に設定することで、Googleが提供する [マテリアル シンボル](https://developers.google.com/fonts/docs/material_symbols) があなたのウェブサイトで利用可能になります。

```toml
[font.material-symbols]
outlined = true
rounded = true
sharp = true
```

このように書くことで、すべてのスタイルの マテリアル シンボル が利用できるようになります。
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

マテリアル シンボルには書体を調整するための4つの「変数」が用意されています。
これらを指定するには、次のように記述してください:

```toml
[font.material-symbols]
rounded = { fill = 1, wght = 200, grad = 0, opsz = 24 }
sharp = { fill = 0, wght = 300, grad = 200, opsz = 40 }
```

`fill` は塗りつぶしの有無を制御する変数です。0 なら「なし」、1 なら「あり」を意味します。デフォルト値は0です。

`wght` はアイコンの「太さ（weight）」を決定する変数です。100, 200, 300, 400, 500, 600, 700 のいずれかを指定できます。100が最も細く、700が最も太くなります。デフォルト値は400です。

`grad` はアイコンの「グレード（grade）」を決定する変数です。この変数の値を変更することで、アイコンの太さを微調整できます。指定できる値は -25, 0, 200 のいずれかです。デフォルト値は0です。負の値を指定するとアイコンの線がより細くなり、正の値を指定するとアイコンの線がより太くなります。

`opsz` はアイコンの「光学サイズ（optical size）」を決定する変数です。光学サイズとは、アイコンの推奨表示サイズを示します。20, 24, 40, 48 のいずれかを指定できます。デフォルト値は24です。一般に、光学サイズの値を大きくすると、線がより細く、空間がより狭く、x-height （ベースラインと書体の小文字の平均線との間の距離）がより短くなります。

### 異体

ひとつのスタイルに対して変数の値が異なる複数の異体（variants）を用意したい場合は、次のようにスタイル名の後にマイナス記号と異体名を加えてください。

```toml
[font.material-symbols]
outlined = true
sharp = true
rounded = { fill = 0, wght = 200, grad = 0, opsz = 24 }
rounded-strong = { fill = 1, wght = 400, grad = 0, opsz = 24 }
rounded-bold = { fill = 0, wght = 700, grad = 0, opsz = 24 }
```

異体名には小文字 (`a-z`) と数字 (`0-9`) しか使えないことに注意してください。

#### テンプレートにシンボルを埋め込む方法

マテリアル シンボルは、`<span>` 要素に対して `material-symbols-` で始まる `class` 属性を指定し、その内容としてシンボルの名前またはコードポイントを配置することで、テンプレートに埋め込むことができます。異体名を持つスタイルを `class` 属性に指定する場合は、スタイル名と異体名の間はマイナス記号ではなくスペースとしてください。

シンボルの名前は「スネークケース」に変換する必要があります。つまり、名前に含まれるすべてのスペースをアンダースコアに、すべての大文字を小文字に置き換えてください。

シンボルのコードポイントは、`e88a` のように4桁の16進数です。
`<span>` 要素の内容として指定する場合は、`&#xe88a;` のように `&#x` と `;` で囲んでください。

各シンボルのコードポイントは[Material Symbols and Icons](https://fonts.google.com/icons)で確認できます。

シンボル名の方が使いやすいが、コードポイントにも利点があります。

シンボル名を使用すると、フォントファイルがダウンロードされるまで、シンボル名の幅のスペースがシンボルの代わりに表示されるため、ウェブページのレイアウトが一時的に崩れることがあります。コードポイントを使用することで、レイアウトの乱れを減らすことができます。

#### 使用例

「ホーム」アイコン（outlined）:

```html
<span class="material-symbols-outlined">home</span>
<span class="material-symbols-outlined">&#xe88a;</span>
```

「削除」アイコン（rounded）:

```html
<span class="material-symbols-rounded">delete</span>
<span class="material-symbols-rounded">&#xe872;</span>
```

「買い物かご」アイコン（sharp）:

```html
<span class="material-symbols-sharp">shopping_bag</span>
<span class="material-symbols-sharp">&#xf1cc;</span>
```

「星」アイコン（rounded）の異体「strong」:

```html
<span class="material-symbols-rounded strong">star</span>
<span class="material-symbols-rounded strong">&#xe838;</span>
```

### Google Fonts

[Google Fonts](https://fonts.google.com/) のRobotoフォントファミリーは、`site.toml` の "font.google-fonts" セクションで以下のように設定することで、あなたのウェブサイトで使用することができます。

```toml
Roboto = true
```

以下はRobotフォントファミリーの使用例です：

```html
<p class="font-['Roboto']">Hello, world!</p>
```

フォントファミリ名にスペースが含まれている場合は、下記のように二重引用符で囲む必要があります：

```toml
"Noto Sans JP" = true
```

また、HTMLテンプレートで使用する場合は、スペースをアンダースコアに置き換えてください。

```html
<p class="font-['Noto_Sans_JP']">こんにちは、世界！</p>
```

フォントファイルのサイズを小さくするために、いくつかのフォントウェイト（太さ）を選択するには、`true`の代わりにウェイトを配列で指定します。

```toml
"Noto Sans JP" = [400, 800]
```

次の例では、ウェイトが 800 の Noto Sans JPフォントファミリーを使用しています。

```html
<p class="font-['Noto_Sans_JP'] font-[800]">こんにちは、世界！</p>
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

### レイアウトとは

通常、ウェブサイトのページには、ほとんどのコンテンツを共有する一連の領域があります： ヘッダー、サイドバー、フッターなどです。

この一連の領域をひとつのテンプレートとしてページから分離すると、ウェブサイトの管理が容易になります。この分割されたテンプレートを「レイアウト」と呼びます。

### レイアウトの追加

レイアウトは、作業ディレクトリ下の `src/layouts` サブディレクトリに置かれるHTMLファイルです。

レイアウトは次の 3 つの条件を満たす必要があります:

1. トップレベル要素は1つしかない。
2. トップレベル要素は `<body>` 要素である。
3. トップレベル要素は、その子孫要素内に `<tg:content>` 要素を1つだけ含む。

`<tg:content>` 要素は、レイアウトのどこにページが挿入されるかを示します。

#### 例

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

`<tg:content></tg:content>` の代わりに `<tg:content />` を書くことは「できない」ことに注意してください。

### ページにレイアウトを適用する

このレイアウトをページに適用するには、ページのフロントマターの `layout` プロパティにレイアウト名を指定します。

レイアウトの名前は、レイアウトのファイル名から拡張子（`.html`）を除いたものです。この場合、`common` がレイアウトの名前です。

#### 例

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

前の例で示したレイアウト `common` をこのページファイルに適用すると、次のようなHTML文書が生成されます：

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

### レイアウトにプロパティ値を埋め込む

ページのフロントマターで設定されたプロパティの値は、`<tg:prop>` 要素を使ってレイアウトに埋め込むことができます。

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

### スロットとインサート

`<tg:slot>` 要素はレイアウト内のプレースホルダーで、ページ内で指定した内容を埋めることができます。`<tg:slot>` 要素には `name` 属性を指定する必要があります。

レイアウトのスロットにコンテンツを埋め込むには、レイアウトを適用するページに `<tg:insert>` 要素を配置します。

`<tg:insert>` 要素の `name` プロパティの値としてスロット名を指定すると、スロットは`<tg:insert>` 要素の内容に置き換えられます。

ページコンテンツがレイアウト内の `<tg:content>` 要素に挿入されると、すべての `<tg:insert>` 要素がページコンテンツから削除されます。

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

レイアウト `product` がページ `product1.html` に適用されると、次のようなHTML文書が生成される：

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

### スロットの代替コンテンツ

スロットに挿入されるコンテンツが定義されていない場合、`<tg:slot>` 要素の内容が代替コンテンツとして使用されます。

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

レイアウト `message` がページ `home.html` に適用されると、次のようなHTML文書が生成されます：

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

通常、レイアウト内の `<tg:if-complete>` 要素は単にその内容で置き換えられます。
ただし、以下の3つの条件を満たさない場合は、要素全体が削除されます：

* その中のすべての `<tg:prop>` 要素に挿入されるプロパティ値が定義されている。
* その中のすべての `<tg:data>` 要素に挿入されるカスタムプロパティ値が定義されている。
* その中のすべての`<tg:slot>`要素に挿入される内容が定義されている。

#### 例

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

レイアウト `message` がページ `home1.html` に適用されると、次のようなHTML文書が生成されます：

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

レイアウト `message` がページ `home2.html` に適用されると、次のようなHTML文書が生成されます：

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

## ラッパー

### ラッパーとは

ラッパーとは、レイアウトとページの中間のレベルに存在するテンプレートのことです。

ラッパーを使えば、共通のスタイルや共通の要素を一群のページに追加できます。

### ラッパーの追加

ラッパーのファイル名は常に `_wrapper.html` です。作業ディレクトリ下の`src/pages`サブディレクトリの直下かその子孫ディレクトリに配置します。

あるディレクトリーに置かれたラッパーは、そのディレクトリーと子孫ディレクトリー内のすべてのページに適用されます。

もし、あるディレクトリにラッパーが存在しない場合、ディレクトリ階層で下から順番に最初に見つかったラッパーが、そのディレクトリのラッパーとなります。

例えば、`src/pages/foo/_wrapper.html` が存在し、`_wrapper.html` が `src/pages/foo/bar` ディレクトリにも `src/pages/foo/bar/baz` ディレクトリにも存在しない場合、`src/pages/foo/_wrapper.html` は `src/pages/foo/bar/baz` ディレクトリのラッパーとなります。

基本的に、ラッパーはレイアウトと同じように書きます。
`<tg:content>`要素は、ラッパー内のどこにページが挿入されるかを示します。

#### 例

`src/pages/mission/_wrapper.html`

```html
<h1 class="text-xl bg-blue-400 p-2">Our Mission</h1>
<div class="[&_p]:mt-2 [&_p]:pl-2">
  <tg:content></tg:content>
</div>
```

`class` 属性値 `[&_p]:mt-2 [&_p]:pl-2` は、このラッパー内の全ての `<p>` 要素の `margin-top` と `padding-left` をスケール2（8px/0.5rem）に設定します。`[&_p]`の表記については [Using arbitrary variants](https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants)を参照してください。

### ラッパーをページに適用する

すでに述べたように、あるディレクトリーに置かれたラッパーは、そのディレクトリーと子孫ディレクトリー内のすべてのページに適用されます。この例では、`src/pages/mission/` ディレクトリとその子孫ディレクトリ `src/pages/mission/member_mission/` に次の２つのページが存在するとします。

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

ラッパー `_wrapper.html` がこれら2つのページに適用されるので、それぞれの `body` 部は次のように生成されます。

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

どちらのページも、`<p>` 要素の `margin-top` と `padding-left` はスケール2（8px/0.5rem）に設定されます。このように特定のディレクトリーとその子孫ディレクトリー内のすべてのページに共通のスタイルや共通の要素を追加できます。

### ラッパープロパティ

ラッパーのフロントマターで設定されたプロパティの値は、そのラッパーが適用されるページのプロパティのデフォルト値になります。もし、ページのフロントマターで同じプロパティに値が設定されている場合は、ページでの設定が優先されます。

ラッパーのプロパティ値は、サイトのプロパティ値よりも優先されます。

#### 例

この例では、ラッパーのプロパティ値として `title = "Team's Mission"` が定義されています。そして、`<tg:prop>` 要素を使って `h1` 要素の内容として記述されています。

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

上記のラッパーを次の2つのページに適用します。

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

`team_mission.html` の方は、フロントマターでプロパティ `title` を再定義していませんが、`member_mission/alice_mission.html` の方は再定義しています。

ラッパー `_wrapper.html` がこれら2つのページに適用されると、それぞれの `body` 部は次のように生成されます。

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

`team_mission.html` の方は、ラッパーで定義したのプロパティ `title` がレンダリングされています。一方、`member_mission/alice_mission.html` の方はページで再定義した `title` がレンダリングされています。

## 共有ラッパー

複数のサイト間で共有されるラッパーを**共有ラッパー** (shared wrappers)と呼びます。

共有ラッパーは、作業ディレクトリの `src/shared_wrappers` サブディレクトリに置かれます。通常、このサブディレクトリは他のディレクトリへのシンボリックリンクです。

[複数のウェブサイトを管理する方法](#複数のウェブサイトを管理する方法)で説明した方法でウェブサイトの作業ディレクトリを初期化した場合、`src/shared_wrappers` サブディレクトリは `../../../shared_wrappers` ディレクトリを参照するシンボリックリンクとして作られます。

`"decorated.html"` という名前の共通ラッパーをあるディレクトリのラッパーとして使用したければ、
そのディレクトリに次のような中身を持つ `_wrapper.html` を作成してください：

```
---
[main]
shared-wrapper = "decorated"
---
```

## セグメント

### セグメントファイル

「segment」はページ、レイアウト、セグメントに埋め込むことができるテンプレートファイルです。セグメントはアーティクル、ラッパー、部品など、これらのタイプ以外のテンプレートに埋め込むことはできません。

セグメントを別のセグメントに埋め込むときは、循環参照を避けるように注意する必要があります。循環参照が検出された場合、生成されたHTMLにエラーメッセージが挿入されます。

セグメントは作業ディレクトリの `src/segments` サブディレクトリに置かれます。

以下はセグメントの例です :

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

### セグメントをページに埋め込む

ページにセグメントを埋め込むには、配置したい場所に `<tg:segment>` 要素を追加し、`name` 属性でセグメント名を指定します。

#### 例

```html
<div>
  <tg:segment name="hero"></tg:segment>

  <main>
    ...
  </main>
</div>
```

### カスタムプロパティをセグメントに渡す

`<tg:segment>` 要素の `data-*` 属性を使って、セグメントにカスタムプロパティを渡すことができます。

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

### スロット

レイアウトと同様、スロットをセグメント内に配置できます。セグメント内のスロットにコンテンツを埋め込む方法は、レイアウトと同様です。

#### 例

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

### プロパティの値をセグメントに埋め込む

`<tg:prop>` 要素と `<tg:data>` 要素は、セグメントにプロパティの値を埋め込むことができます。

```html
---
[data]
message = "Hi!"
---
<div>
  <tg:data name="message"></tg:data>
</div>
```

セグメントは、それが埋め込まれているページやレイアウトからプロパティを継承することに注意してください。同じ名前のプロパティが部品とページまたはレイアウトで定義されている場合、ページまたはレイアウトで定義されている値が優先されます。

## 部品

### 部品ファイル

「部品」はページ、セグメント、部品、アーティクル、レイアウトに埋め込むことができるテンプレートファイルです。

部品は、作業ディレクトリの `src/components` サブディレクトリに置かれます。

以下は部品の例です:

`src/components/smile.html`

```html
<span class="inline-block border-solid border-2 border-black rounded p-2">
  <span class="material-symbols-outlined">sentiment_satisfied</span>
</span>
```

上記のスマイル・アイコンを表示するには、`sites.toml` の `font.material-symbols` セクション内のプロパティ（この例では `outlined` プロパティ）を `true` に設定する必要があることに注意してください。詳しくは [マテリアル シンボル](#マテリアル-シンボル)を参照してください。

部品を別の部品に埋め込む場合は、循環参照を避けるように注意する必要があります。循環参照が検出された場合、生成されたHTMLにエラーメッセージが挿入されます。

### 部品を埋め込む

部品をページやアーティクル、レイアウトに埋め込むには、配置したい場所に `<tg:component>` 要素を追加し、`name` 属性でその名前を指定します。

#### 例

```html
<p>
  <tg:component name="smile"></tg:component>
  How are you?
</p>
```

`<tg:component>` 要素の `data-*` 属性を使って、カスタムプロパティを部品に渡すことができます。

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

### スロット

レイアウトやセグメントと同様、スロットを部品内に配置できます。部品内のスロットにコンテンツを埋め込む方法は、レイアウトやセグメントと同様です。

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

### プロパティの値を部品に埋め込む

`<tg:prop>` 要素と `<tg:data>` 要素は、部品にプロパティの値を埋め込むことができます。

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

部品は、それが埋め込まれているページやアーティクルからプロパティを継承することに注意してください。同じ名前のプロパティが部品とページまたはアーティクルで定義されている場合、ページまたはアーティクルで定義されている値が優先されます。

### 共有部品

複数のサイト間で共有される部品を**共有部品** (shared components)と呼びます。

共有部品は、作業ディレクトリの `src/shared_components` サブディレクトリに置かれます。通常、このサブディレクトリは他のディレクトリへのシンボリックリンクです。

[複数のウェブサイトを管理する方法](#複数のウェブサイトを管理する方法)で説明した方法でウェブサイトの作業ディレクトリを初期化した場合、`src/shared_components` サブディレクトリは `../../../shared_components` ディレクトリを参照するシンボリックリンクとして作られます。

共有部品の作り方は部品と同じです。共有部品でもスロットを利用できます。

共有部品をページやアーティクル、レイアウト、部品に埋め込むには、配置したい場所に `<tg:shared-component>` 要素を追加し、`name` 属性でその名前を指定します。

共有部品の中に別の共有部品を埋め込むことは可能ですが、共有部品の中に普通の部品を埋め込むことはできません。

#### 例

```html
<p>
  <tg:shared-component name="smile"></tg:shared-component>
  How are you?
</p>
```

## アーティクル

### アーティクルとは

ページと同様、「アーティクル」はHTML文書を生成するためのテンプレート・ファイルです。

アーティクルは、作業ディレクトリの `src/articles` サブディレクトリに置かれます。`src/articles` ディレクトリの下にサブディレクトリを作り、その下にアーティクルを置くことも可能です。

アーティクルは完全なHTML文書に変換され、`dist/articles` ディレクトリに書き込まれます。

例えば、`src/articles/tech.html` は `dist/articles/tech.html` に、`src/articles/blog/happy_new_year.html` は `dist/articles/blog/happy_new_year.html` に変換されます。

アーティクルとページは、以下の点でまったく同じ特徴を持っています：

* レイアウトを適用することができる。
* 画像や音声を埋め込むこともできる。
* `<head>` 要素の内容は、[後述](#managing-the-contents-of-the-head-element) する方法で自動的に生成される。.

#### 例

ここでは、アーティクルを作成し、それをブラウザで表示する方法を説明します。

次の内容で `src/articles/glossary.html` を作成します。

```html
---
[main]
title = "Glossary"
---
<h3>Glossary</h3>
<p>HTML: HyperText Markup Language</p>
<p>CSS: Cascading Style Sheets</p>
```

次のような `<html>` や `<head>` 要素を含む完全なHTML文書として、`dist/articles/glossary.html` が生成されます。

```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <h1>Glossary</h1>
    <p>HTML: HyperText Markup Language</p>
    <p>CSS: Cascading Style Sheets</p>
  </body>
</html>
```

URLとして `http://localhost:3000/articles/glossary.html` を指定するとブラウザで表示することができます。

### ページやセグメントにアーティクルを埋め込む

部品のように、アーティクルはページやセグメントに埋め込むことができます。ページのラッパーにも埋め込むことができます。
`<tg:article>` 要素を次のようにアーティクルを埋め込みたい場所に配置します:

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

`<tg:article>` 要素の `name` 属性の値は、拡張子 (`.html`) を除いたアーティクルファイル名にする必要があります。

部品とは異なり、アーティクルはページにのみ埋め込むことができます。アーティクルを他のアーティクルやレイアウトに埋め込むことはできません。

レイアウトやセグメントと同様に、スロットはアーティクルの中に置くことができます。また、 `<tg:article>` 要素の `data-*` 属性を使ってアーティクルにカスタムプロパティを渡すこともできます。

### `embedded-only` プロパティ

アーティクルの `embedded-only` プロパティの値が `true` に設定されている場合、完全なHTMLファイルには変換されず、ページやセグメントへの埋め込みにのみ使用されます。

```html
---
[main]
embedded-only = true
---
<h3>Greeting</h3>
<p>Hello, world!</p>
```

### `<tg:if-embedded>` と `<tg:unless-embedded>`

`<tg:if-embedded>` 要素はアーティクルのテンプレートの中で使われ、アーティクルが他のページやセグメントの中に埋め込まれた時にのみ表示されます。

`<tg:unless-embedded>` 要素はアーティクルのテンプレートの中で使われ、アーティクルが個別のウェブページとして生成される時にのみ表示されます。

### ページに複数のアーティクルを埋め込む

`<tg:articles>` 要素は、複数のアーティクルをページやセグメントに埋め込むために使うことができます。

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

上記の例では、`src/articles/proposals` ディレクトリのすべてのアーティクルを `<h1>` 要素の下に埋め込んでいます。

デフォルトでは、アーティクルはファイル名の昇順（アルファベット順）でソートされます。

アーティクルをファイル名の降順に並べ替えるには、`<tg:articles>` 要素の `order-by` 属性を `"filename:desc"` に設定します：

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

`<tg:articles>` 要素の `data-*` 属性を使ってアーティクルにカスタムプロパティを渡すことができます。

### アーティクルをタイトルで並べ替える

アーティクルをタイトルでソートするには、`<tg:articles>` 要素の `order-by` 属性を `"title:asc"` または `"title:desc"` に設定します：

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

### アーティクルを任意の順序で並べ替える

アーティクルを任意の順序で並べ替えるには、各アーティクルに `index` プロパティを整数値に設定します：

```html
---
[main]
index = 123
---
<article>
  ...
</article>
```

そして、`<tg:articles>` 要素の `order-by` 属性に `"index:asc"` または `"index:desc"` を設定します：

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

`index` プロパティを持たないアーティクルは、`index` プロパティを持つアーティクルの後にファイル名の昇順で並べられます。

`order-by` 属性の値は、コロン一つで区切られた文字列です。コロンの左側は `"title"` 、`"index"` 、`"filename"` のいずれかです。コロンの右側は `"asc"` または `"desc"` でなければならず、`"asc"` は「昇順」、`"desc"` は「降順」を意味します。

## 何が何に埋め込めるのか?

テンプレートには、ページ、レイアウト、ラッパー、セグメント、部品、アーティクルがあります。この中のセグメント、部品、アーティクルは、それぞれ `<tg:component>`、`<tg:segment>`、`<tg:article>`、`<tg:articles>` 要素で他のテンプレートに埋め込むことができます。

ここで、何が何に埋め込めるのかを整理しておきます。

埋め込み先↓  | `<tg:component>` | `<tg:segment>` | `<tg:article>` | `<tg:articles>`
-- | -- | -- | -- | --
ページ | ◯ | ◯ | ◯ | ◯
ページのラッパー | ◯ | ◯ | ◯ | ◯
レイアウト |  ◯ | ◯ | ✕ | ✕
セグメント | ◯ | ◯ | ◯ | ◯
部品 | ◯ | ✕ | ✕ | ✕
アーティクル | ◯ | ✕ | ✕  | ✕
アーティクルのラッパー | ◯ | ✕ | ✕  | ✕

## リンク

### ウェブサイト内のリンク

`<a>` 要素を使ってウェブサイト内のページにリンクする場合は、`href` 属性でページの「絶対」パスを指定します:

```html
<nav>
  <a href="/articles/goal.html">Our Goal</a>
  <a href="/articles/about.html">About Us</a>
</nav>
```

ウェブサイトが Teamgenik で公開されると、その中の `<a>` 要素の `href` 属性の値は適切に変換されます。

### `<tg:link>`、`<tg:if-current>`、`<tg:label>`

`<tg:link>` は、`<a>` 要素を条件付きで出現させるために使われる特別な要素です。
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

### `<tg:link>` に `component` 属性を付ける

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

## リンクリスト

### アーティクルへのリンクリストの作成

`<tg:links>` 要素は、あらゆるテンプレート（ページ、レイアウト、部品、アーティクル）にアーティクルへのリンクを埋め込むために使用できます。

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

`<tg:links>` 要素は1つ以上の `<a>` 要素と0つ以上の `<tg:prop>` 要素、`<tg:data>` 要素、`<tg:slot>` 要素を含みます。

`<a>` の `href` 属性の値は、アーティクルのURLに置き換えられます。`<tg:prop>` 要素と `<tg:data>` 要素は、埋め込まれるアーティクルのプロパティの値で置き換えられます。`<tg:slot>` 要素は、埋め込まれるアーティクル内で定義された `<tg:insert>` 要素の内容に置き換えられます。

`<tg:links>` 要素の内側では、`<tg:if-complete>` 要素は部品の内側と同じように機能します。つまり、`<tg:if-complete>` 要素は、その中のすべての `<tg:prop>` 、`<tg:data>` 、`<tg:slot>` 要素に値または内容が提供されない限り、出力から削除されます。

デフォルトでは、アーティクルはファイル名の昇順（アルファベット順）でソートされます。アーティクルをタイトルでソートするには、`<tg:links>` 要素の `order-by` 属性を `"title:asc"` または `"title:desc"` に設定します:

```html
<tg:links pattern="proposals/*" order-by="title:asc">
  <li>
    ...
  </li>
</tg:links>
```

`order-by` 属性に設定する値の書き方については、[アーティクルをタイトルで並べ替える](#アーティクルをタイトルで並べ替える)を参照してください。

アーティクルを任意の順序で並べ替えるには、各アーティクルのフロントマターに `index` プロパティを追加します：

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

次に、`<tg:links>` 要素の `order-by` 属性を指定します。

```html
<tg:links pattern="proposals/*" order-by="index:asc">
  <li>
    ...
  </li>
</tg:links>
```

現在の仕様では、`<tg:component>` 要素を `<tg:links>` 要素の中に入れることはできません。

0個または1個の `<tg:if-current>` 要素を `<tg:links>` 要素の中に入れることができます。`<tg:if-current>` 要素の内容は、アーティクルのパスが生成されるHTMLドキュメントのパスである場合にのみレンダリングされます。

### タグによるアーティクルのフィルタリング

「タグ」を使ってアーティクルを分類することができます。

アーティクルにタグを付けるには、`tags` プロパティにタグ名を `[...]` 記法の配列で指定します：

```html
---
[main]
tags = [ "travel", "europe" ]
---
<article>
  ...
</article>
```

アーティクルに一つのタグを付けるには、`tags` プロパティの値を文字列で指定することができます：

```html
---
[main]
tags = "anime"
---
<article>
  ...
</article>
```

`filter` 属性を使って、ページに埋め込まれたアーティクルをフィルタリングすることができます：

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

`filter` 属性の値は、コロン一つで区切られた文字列です。現在の仕様では、コロンの左側は常に `"tag"` で、コロンの右側はタグ名です。

`filter` 属性を使ってアーティクルへのリンクのリストをフィルタリングすることもできます：

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
          <tg:prop name="title"></tg:prop>
        </a>
      </li>
    </tg:links>
  </ul>
</main>
```

ページにタグを割り当てることはできません。

### `<tg:links>` に `component` 属性を付ける

`<tg:links>` 要素に `component` 属性があると、その値に対応する名前の部品の内容が `<tg:links>` 要素の内容になります。

例えば、次のような内容の `nav_link` 部品があるとする。

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

この場合、`<tg:links>` 要素は次のように構成できます：

```html
<tg:links component="nav_link" pattern="proposals/*"></tg:links>
```

上記のコードは、以下のコードとまったく同じと解釈されます。

```html
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
```

## 動的要素

ここでは、modal や carousel などの動的要素をウェブサイトに導入する方法を説明します。

### Modal

HTML要素に `tg:modal` 属性を指定すると、その要素の子孫要素で以下の属性が利用できるようになります:

* `tg:open`
* `tg:close`

`tg:modal` 属性を持つHTML要素を「modal」と呼びます。modal は `open` と `close` の2つの状態を持ちます。初期状態は `close` です。

modal の内部には `<dialog>` 要素が 1 つなければなりません。初期状態では、この要素は表示されません。ユーザーが `tg:open` 属性を持つ要素をクリックすると、`<dialog>` 要素が表示されます。逆に、ユーザーが `tg:close` 属性を持つ要素をクリックすると、`<dialog>` 要素は消えます。

以下はモーダルの例です:

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

`<dialog>` 要素の直下には、「バックドロップ」と呼ばれる表示領域と同じ大きさの透明な要素が挿入されます。バックドロップは `<dialog>` 要素以外のすべてのページ内容を非アクティブにします。

`<dialog>` 要素の `class` 属性の値にあるクラス・トークン `backdrop:bg-gray-800/80` は、背景色に半透明の濃い灰色を適用します。詳細はTailwind CSS Documentationの [Dialog Backdrops](https://tailwindcss.com/docs/hover-focus-and-other-states#dialog-backdrops) を参照してください。

### Toggler

HTML要素に `tg:toggler` 属性を指定すると、その要素の子孫要素で以下の属性が利用できるようになります:

* `tg:when`
* `tg:toggle`

`tg:toggler` 属性を持つHTML要素を「toggler」と呼びます。toggler は `on` と `off` の2つの状態を持ちます。初期状態は `off` です。

toggler 内の `tg:when` 属性を持つ要素は、その値が toggler の状態と一致した場合のみ表示されます。

toggler の中にある `tg:toggle` 属性を持つ要素をクリックまたはタップすると、toggler の状態がその属性の値に設定されます。

以下は toggler の例です:

```html
<div tg:toggler>
  <button type="button" tg:toggle="on" tg:when="off">Open</button>
  <div tg:when="on">
    <button type="button" tg:toggle="off">Close</button>
    <p>Hello, world!</p>
  </div>
</div>
```

この例をブラウザで見ると、最初は "Open" ボタンだけがユーザーに見えます。このボタンをクリックまたはタップすると、toggler の状態が `on` に設定され、 "Open" ボタンは消え、代わりに "Close" ボタンと "Hello, world" パラグラフが表示されます。さらに "Close" ボタンをクリックまたはタップすると、初期状態に戻ります。

`tg:toggle` 属性の値が省略された場合、ユーザーが要素をクリックまたはタップすると toggler の状態が反転します。つまり、上記の例は次のように書き換えることができます:

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

#### Switcher の基本

HTML要素に `tg:switcher` 属性を指定すると、その要素の子孫要素で以下の属性が利用できるようになります:

* `tg:item`
* `tg:choose`
* `tg:first`
* `tg:prev`
* `tg:next`
* `tg:last`
* `tg:paginator`

`tg:switcher` 属性を持つHTML要素を「switcher」と呼びます。

switcher の内部には、必ず `tg:body` 属性を持つ要素、つまり「switcherボディ」がなければなりません。さらに、`tg:item`属性を持つ要素、つまり「switcherアイテム」がなければなりません。


switcherアイテムには、0から順番にユニークな「index 番号」が割り当てられます。switcherは、「現在のindex番号」と呼ばれる整数値で表される状態を持っています。switcherアイテムは、そのインデックス番号が switcher の現在のインデックス番号と一致する場合のみ表示されます。

ユーザーが switcher の中の `tg:choose` 属性を持つ要素をクリックまたはタップすると、switcher の現在のインデックス番号がその属性の値に設定されます。

以下は switcher の例です:

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

ボタンの `tg:choose` 属性の値が switcher の現在のインデックス番号と一致する場合、ユーザーがこのボタンをクリックまたはタップしても何も起こりません。

これを視覚的に現すために、`tg:current-class` と `tg:normal-class` 属性を使用してボタンに適用されるスタイルを変更します。

```html
  <button
    type="button"
    tg:choose="0"
    class="btn"
    tg:current-class="btn-primary cursor-default"
    tg:normal-class="btn-secondary">a</button>
```

`tg:choose` 属性の代わりに、`tg:first`、`tg:prev`、`tg:next`、`tg:last` などの特別な属性を使用して、スイッチャーの状態を変更するボタンを作成できます。

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

switcher の現在のインデックス番号がその下限に一致する場合、ユーザーが `tg:first` または `tg:prev` 属性のボタンをクリックまたはタップしても何も起こりません。

同様に、switcher の現在のインデックス番号がその上限と一致する場合、ユーザーが `tg:next` または `tg:last` 属性のボタンをクリックまたはタップしても何も起こりません。

これを視覚的に現すために、`tg:enabled-class` と `tg:disabled-class` 属性を使用してボタンに適用されるスタイルを変更します。

```html
  <button
    type="button"
    tg:first
    class="btn"
    tg:enabled-class="btn-primary"
    tg:disabled-class="btn-disabled">First</button>
```

#### Switcher の自動切り替えとフェードイン／フェードアウト効果

switcher が `tg:interval` 属性を持つ場合、switcher のインデックス番号は指定された間隔で1ずつ増加します（単位：ミリ秒）。

```html
<div tg:switcher tg:interval="5000">
  ...
</div>
```

switcherアイテムにフェードイン／フェードアウトの効果を加えたい場合は、switcher の `tg:transition-duration` 属性にフェードイン／フェードアウトが完了するまでの時間をミリ秒単位で指定します。

```html
<div tg:switcher tg:interval="5000" tg:transition-duration="750">
  ...
</div>
```

ユーザーが `tg:choose` 属性付きのボタンなどをクリックまたはタップした場合、switcher の状態は自動的に変化しなくなります。

#### Paginator

switcher の中には、`tg:paginator` 属性を持つ要素があるかもしれません。この要素は、ユーザーが表示される switcherアイテムを選択するためのボタン・グループのテンプレートになります。これらのボタンを「ページネーションボタン」と呼びます。

例えば、switcher 項目の数が5つの場合、次のコード例は5つの `<button>` 要素を内部に持つ `<nav>` 要素を生成します。

```html
<div tg:switcher>
  ...
  <nav>
    <button type="button" tg:paginator></button>
  </nav>
</div>
```

このままでは、単なる `<button></button>` 要素が作られるだけなのでユーザにはには何も見えません。CSSでスタイルを指定する必要があります。例えば、次のようにすると丸いボタンが現れます。

```html
<nav>
  <button
    tg:paginator
    class="rounded-full w-6 h-6 mx-1 bg-gray-500"
  ></button>
</nav>
```

さらに、次のようにするとUIが洗練されます。

```html
<nav>
  <button
    type="button"
    tg:paginator
    class="rounded-full w-6 h-6 mx-1 opacity-50"
    tg:normal-class="bg-teal-400 hover:opacity-75"
    tg:current-class="bg-orange-400 cursor-default"
  ></button>
</nav>
```

### Rotator

`tg:rotator` 属性を持つHTML要素を「rotator」と呼びます。

rotator は、3つの条件がある switcher とまったく同じように振る舞います：

* 現在のインデックス番号が上限と一致するときにユーザーが `tg:next` 属性のボタンをクリックすると、インデックス番号はその下限に設定されます。
* 現在のインデックス番号が下限値に一致するときに `tg:prev` 属性のボタンをクリックすると、インデックス番号は上限値に設定されます。
* `tg:interval` 属性が設定されている場合、現在のインデックス番号が上限値に達すると、次回はインデックス番号が下限値に設定されます。

rotator の例です:

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

#### Carousel の基本

`tg:carousel` 属性を持つHTML要素を「carousel」と呼びます。

これにより、ウェブサイト制作者は複数のコンテンツをスライドショーのような形式で連続して表示することができます。

carousel の内部には、必ず `tg:frame` 属性を持つ要素、つまり「carousel frame」がなければなりません。carouselフレームの中には、`tg:body` 属性を持つ要素、「carouselボディ」が必要です。また、carouselボディ の中に `tg:item` 属性を持つ要素、「carouselアイテム」がなければなりません。

carousel body の幅は、最初の carouselアイテム の幅の整数倍になるように自動的に計算されるので、ウェブサイト作成者が指定する必要はありません。その幅は、すべての carouselアイテム を水平に整列させるのに十分な大きさになるが、carouselフレームの `overflow: hidden` スタイルのため、ウェブサイトの訪問者にはその一部しか見えません。carousel効果は、埋め込まれたJavaScriptプログラムで carousel body を左右に移動させることで実現されます。

carouselフレームの幅は、ウェブサイト作成者が調整する必要があります。通常は、carouselフレームと最初の carouselアイテム の幅を同じにします。そうすることで、carousel が静止している間、carouselフレームには1つの carouselアイテム だけが表示されます。常に複数の carousel項目 表示したい場合は、carouselフレームの幅を最初の carouselアイテム の幅より大きくしてください。

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


rotator と同様に、`tg:prev` または `tg:next` 属性を持つ要素を carousel の内側に置くことで、ユーザーは carousel の状態をコントロールすることができます。

```html
<nav>
  <button type="button" tg:prev>Prev</button>
  <button type="button" tg:next>Next</button>
</nav>
```

#### Carousel のオートローテーションとアニメーション効果

carousel のアイテムを一定時間ごとに自動的にローテーションさせるには、カルーセルの `tg:interval` 属性に正の整数を指定します。この属性で指定された値は、ミリ秒単位の時間として解釈されます。

```html
<div tg:carousel tg:interval="3000">
```

carousel のローテーションにアニメーション効果を加えたい場合は、carousel の `tg:transition-duration` 属性を指定します。

```html
<div tg:carousel tg:interval="3000" tg:transition-duration="500">
```

デフォルトでは、カルーセル・アイテムの水平方向の動きは線形、つまり等速で動きます。

carousel の動き方を微調整したい場合は、"ease-"で始まる名前のクラスをcarouselボディに指定します。

```html
<div tg:carousel tg:transition-duration="1000">
  <div tg:frame tg:class="carousel-frame">
    <div tg:body class="ease-in-out" tg:class="carousel-body">
      ...
    </div>
  </div>
</div>
```

`ease-in-out` クラスは、変化の始まりと終わりで動きを緩やかにします。詳細は [Transition Timing Function](https://tailwindcss.com/docs/transition-timing-function) を参照。

carousel に `tg:transition-duration` 属性が設定されている場合、carouselボディが水平方向に移動している間にユーザーが "prev "または "next "ボタンをクリック/タップしても、何の効果もありません。これを視覚的に示すには、ボタンに `tg:enabled-class` と `tg:disabled-class` 属性を指定します。

`tg:enabled-class` 属性で指定されたクラス・トークンは、carouselボディが停止している時にボタンの `class` 属性に追加され、`tg:disabled-class` 属性で指定されたクラス・トークンは、carouselボディが移動している時にボタンの `class` 属性に追加されます。

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

carousel の中には、`tg:paginator` 属性を持つ要素があります。この要素は、ユーザーが carouselフレームの中央に表示される carouselアイテムを選択するためのボタングループのテンプレートになります。これらのボタンを「ページネーションボタン」と呼びます。

例えば、carouselアイテムの数が5つの場合、次のコード例は5つの `<button>` 要素を内部に持つ `<nav>` 要素を生成します。

```html
<div tg:carousel>
  ...
  <nav>
    <button type="button" tg:paginator></button>
  </nav>
</div>
```

各ページネーションボタンは carouselアイテムの1つに対応しています。

必要であれば、`tg:choose` 属性で carouselアイテムの番号を指定することで、個々のページネーション・ボタンをコード化することができます。

次の例は、前の例と同じように、5つの `<button>` 要素を持つ `<nav>` 要素を生成します。

```html
<nav>
  <button type="button" tg:choose="0"></button>
  <button type="button" tg:choose="1"></button>
  <button type="button" tg:choose="2"></button>
  <button type="button" tg:choose="3"></button>
  <button type="button" tg:choose="4"></button>
</nav>
```

各 carouselアイテムには0から始まる番号が振られていることに注意してください。

carouselフレームの中央に表示される carouselアイテムに対応するページネーションボタンに目立つスタイルを与えたい場合は、`tg:normal-class` 属性と `tg:current-class` 属性を使用します。

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

`tg:normal-class` 属性で指定されたクラス・トークンは、現在 carouselフレームの中央に表示されていない carouselアイテムに対応するボタンに適用され、`tg:current-class` 属性で指定されたクラス・トークンは、現在 carouselフレームの中央に表示されている carouselアイテムに対応するボタンに適用されます。

カルーセルに `tg:transition-duration` 属性が設定されている場合、carouselボディが水平方向に移動している間にユーザーがページ分割ボタンをクリック/タップしても、何の効果もありません。これを視覚的に示すには、ボタンに `tg:disabled-class` 属性を指定します。

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

`tg:disabled-class` 属性で指定されたクラス・トークンは、carouselボディが移動する際に、すべてのページネーションボタンの `class` 属性に追加されます。

### Scheduler

「Scheduler」は、HTML要素とその子孫要素の `class` 属性を時間と共に変更する仕組みです。

以下は scheduler 設定の簡単な例です:

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

`tg:scheduler` 属性は、この要素が scheduler よって管理されていることを宣言しています。この要素の `class` 属性の値は「ベースクラス」と呼ばれます。

ベースクラスに `tg:init` 属性の値を加えたものが、この要素の `class` 属性となります。この例では、`<div>` 要素の `class` 属性は初期値 `"w-24 mx-auto p-4 text-center text-white bg-black"` に設定されます。

`tg:` という属性と数字の並びを組み合わせることで、ウェブページが読み込まれてから一定の時間が経過した時点で、この要素の `class` 属性を変更します。数字の並びは経過時間をミリ秒単位で表します。

この例では、`<div>` 要素の `class` 属性の値は次のように時間と共に変化します:

* 1秒後: `w-24 mx-auto p-4 text-center text-white bg-red-500`
* 2秒後: `w-24 mx-auto p-4 text-center text-white bg-blue-500`
* 3秒後: `w-24 mx-auto p-4 text-center text-white bg-green-500`

以下の例では、フェードイン効果を得るために scheduler を使用しています:

```html
<div
  tg:scheduler
  tg:init="opacity-0"
  tg:0="opacity-100 transition duration-500"
>
  Fade In
</div>
```

初期状態では、この `<div>` 要素の `class` 属性の値は `opacity-0` を含んでいるので、その内容はユーザーには見えません。ページが読み込まれた瞬間に、この `<div>` 要素の `class` 属性から `opacity-0` が削除され、代わりに `opacity-100` が追加されます。`tg:0` 属性に含まれる `transition duration-500` のおかげで、`opacity-100` の効果は0.5秒かけて徐々に適用されます。

### Tram

#### Tram の基本

「tram」は、要素と表示領域の位置関係の変化に応じて、HTML要素やその子孫要素の `class` 属性を変更する仕組みです。

ユーザーが tarm を配置したウェブページを上から下へスクロールすると、tarm は下から上へ進行します。tram の上端が表示領域の下端に接したとき、tram の進行度は0となります。tram の下端が表示領域の上端に接したとき、tram の進行度は100となります。

以下は tram の簡単な設定例です。:

```html
<div tg:tram>
  <div
    class="w-48 h-48 mx-auto"
    tg:init="bg-black"
    tg:forward-50="bg-red-500"
  >
  </div>
</div>
```

この tram は内側に１つの `<div>` 要素を持っています。内側の要素は `tg:forward-50` 属性を持ち、この属性があることでこの要素が tram の「ターゲット」となります。

ターゲットの `class` 属性の値は「ベースクラス」と呼ばれます。最初は、ベースクラスに `tg:init` 属性で指定された `bg-black` を加えたものが、class属性の実際の値がになります。そして、`tg:forward-50` という属性を指定することで、tram の進行度が50になった瞬間に、ベースクラスに `bg-red-500` を加えたものがターゲットのclass属性として設定されます。50のような数字で表される tram の進行度は「トリガーポイント」と呼ばれます。

名前が `tg:forward-` で始まる属性は「フォワードトリガー」と呼ばれ、名前が `tg:backward-` で始まる属性は「バックトリガー」と呼ばれます。フォワードトリガーで指定されたクラストークンは、tram が前進中にそのトリガーのトリガーポイントに達すると、ターゲットの `class` 属性に追加されます。バックトリガーで指定されたクラストークンは、tram が後方へ移動中にそのトリガーのトリガーポイントに到達すると、ターゲットの `class` 属性に追加されます。

1つのターゲットに複数のトリガーを設定することが可能です。
次の例では、tram が進むにつれて背景色が黒から赤へ、そして赤から緑へと変化します。

```html
<div tg:tram>
  <div
    class="w-48 h-48 mx-auto"
    tg:init="bg-black"
    tg:forward-25="bg-red-500"
    tg:forward-50="bg-green-500"
  >
  </div>
</div>
```

色の変化を緩やかにしたい場合は、`transition`と`duration-1000`をベースクラスに追加します:

```html
<div tg:tram>
  <div
    class="w-48 h-48 mx-auto transition duration-1000"
    tg:init="bg-black"
    tg:forward-50="bg-red-500"
  >
  </div>
</div>
```

こうすることで、tram が表示領域の中央まで進むと、1000ミリ秒かけて背景色が黒から赤に切り替わります。

ユーザーがウェブページを下から上へスクロールすると、tram は画面の上から下へ後退します。

tram が後方に移動している間にターゲットの `class` 属性を変更したい場合は、後方トリガーを指定します:

```html
<div tg:tram>
  <div
    class="w-48 h-48 mx-auto"
    tg:init="bg-black"
    tg:forward-50="bg-red-500"
    tg:backward-50="bg-black"
  >
  </div>
</div>
```

上の例では、tram が後方に移動しながら表示領域の中央に到達した瞬間に、ターゲットの背景色が赤から黒に変わります。

#### トリガーポイント

これまでは0から100までの「裸の」整数を使ってトリガーポイントを表現してきたが、整数に「単位」を加えることで、様々なトリガーポイントを表現することができます。

`100%` は、tram の長さ（高さ）に等しい前進に相当するトリガーポイントを表します。例えば、`tg:forward-50%` 属性に設定されたクラストークンは、tram が表示領域の底から tram の半分の長さだけ進んだときに、ターゲットの `class` 属性に追加されます。

次の例では、tram のターゲットは最初は表示領域の左端より外側にあり、tram が進んでその下端が表示領域の下端に触れると、1000msかけて元の位置に移動します。

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

`100vh` は、表示領域の高さに等しい進捗に相当するトリガーポイントを表します。例えば、`tg:forward-50vh` 属性に設定されたクラストークンは、tram の頭部が表示領域の中点と同じ高さにあるとき、ターゲットの `class` 属性に追加されます。

`100px` は100ピクセルの進行に対応するトリガーポイントを表します。例えば、`tg:forward-64px` 属性は、tramが表示領域の下端から64ピクセル進んだときに適用されるべきクラストークンを値として持っています。

これらの単位には、`+` または `-` という接尾辞を追加することができます。接尾辞 `+` は、tramの進行が表示領域の上端を基準として測定されることを意味します。例えば、`50%+` はtramが表示領域の上から半分の長さだけ進んだことを示します。

接尾辞 `-` は、tram の進行基準が表示領域の上端であり、トリガーポイントがビューポートの上端から後方に離れていることを意味します。例えば、`64px-` は tram の先頭が表示領域の上端から64ピクセル後方にあることを示します。

### Alpine.jsについてのメモ

tgwebは [Alpine.js](https://alpinejs.dev/) を使って動的なコンテンツ操作を実現しています。ただし、`x-data` 、 `@click` 、 `:class` のようなAlpine.jsに由来する属性は、ウェブサイトの作者自身が使用することはできません。これらの属性が HTML ソースファイルで見つかった場合、それらは削除されます。

## ミニアプリの埋め込み

### ミニアプリとは

Teamgenikはノーコード開発プラットフォームという側面を持っています。Teamgenikで作成されたアプリケーションは「ミニアプリ」と呼ばれます。TeamgenikのSTUDIOスペースではミニアプリを作成でき、MARKETスペースではミニアプリを取得または購入できます。

ミニアプリには2つの用途があります:

1. BASEスペースで独立したウィジェットとして使用できます。
2. 個人またはチームのウェブサイトに埋め込むことができます。

ミニアプリはTeamgenikで公開されているウェブサイトにのみ埋め込むことができます。そのため、`npx tgweb-server` コマンドで起動したウェブサーバーが配信するウェブページの上でミニアプリケーションを実行することはできません。ただし、ミニアプリのプレースホルダーを埋め込むことは可能です。その後、`npx tgweb-push` コマンドでウェブサイトデータをTeamgenikにアップロードし、ミニアプリを埋め込んだウェブサイトを公開できます。

**Note** `npx tgweb-push` コマンドはまだ使用できません。

### ミニアプリの設定

ミニアプリのプレースホルダをウェブページに埋め込むには、ミニアプリのデフォルトロケールを指定し、`site.toml` にミニアプリの名前、ID、表示名を登録する必要があります。以下にセットアップの例を示します。

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

ミニアプリのテキストが国際化されると、`default-locale` プロパティで設定されたロケールで翻訳されます。

各ミニアプリのコンフィギュレーションの最初の行に `[[apps]]` を置かなければなりません。「apps」という言葉は二重の角括弧で囲まれていることに注意してください。

`name` プロパティは、設定するミニアプリを識別するための名前です。その値はどんな文字列でもよいですが、後述の `<tg:app>` タグの `name` 属性に対応するものでなければなりません。

`id` プロパティは、Teamgenik上のミニアプリに割り当てられた識別子 (ID) です。その値は UUID (Universally Unique IDentifier) の形をしています。各ミニアプリのIDは、Teamgenik BASEスペース内の「ミニアプリ」タブで確認できます。このプロパティはオプションです。

このIDは、Teamgenikで公開されているウェブサイト上で実際にミニアプリを実行するために必要ですが、単にローカル環境のウェブページにプレースホルダを埋め込み、その外観を確認したい場合は省略できます。

`display-name` プロパティの値はプレースホルダー内に表示される文字列です。このプロパティが省略された場合、代わりに `name` プロパティの値が使用されます。

### ミニアプリのプレースホルダーをウェブページに埋め込む

ミニアプリのプレースホルダーをウェブページに埋め込むには、`<tg:app>` 要素を使います。その `name` 属性の値は、`site.toml` で説明したミニアプリの `name` プロパティと一致しなければなりません。以下は `<tg:app>` 要素の使用例です。

```html
<tg:app name="score_board"></tg:app>
```

`<tg:app>` 要素は `expanded` 属性を持つことができます。この属性はミニアプリの表示モードを制御します。

ミニアプリには、標準モードと拡張モードの2つの表示モードがあります。標準モードのミニアプリのレイアウトは横幅300ピクセルに最適化され、拡張モードのミニアプリのレイアウトは横幅640ピクセルに最適化されます。

`expanded` 属性はブーリアン属性で、この属性が存在すればミニ・アプリは拡張モードで表示され、そうでなければ標準モードで表示されます。以下は `expanded` 属性の使用例です:

```html
<tg:app name="score_board" expanded></tg:app>
```

ミニアプリのプレースホルダー自体には特定の幅と高さがないことに注意してください。通常、プレースホルダーの幅は次のように `<div>` 要素で囲んで固定します：

```html
<div class="w-[300px]">
  <tg:app name="score_board"></tg:app>
</div>
```

以下のように最小の高さを指定することで、ミニアプリケーションのコンテンツが変更されたときに、ウェブページのレイアウトがぐらつくのを防ぐことができます。

```html
<div class="w-[300px] min-h-[450px]">
  <tg:app name="score_board"></tg:app>
</div>
```

ブラウザの表示幅が 640 ピクセル以上かどうかに応じて表示モードを切り替えるには、次のように 2 つのプレースホルダーを配置し、適切な Tailwind CSS クラス トークンのセットを含む `<div>` 要素でそれぞれを囲みます。

```html
<div class="w-[300px] sm:hidden">
  <tg:app name="score_board"></tg:app>
</div>
<div class="w-[640px] hidden sm:block">
  <tg:app name="score_board" expanded></tg:app>
</div>
```

`sm:hidden` クラスは、ブラウザーの表示幅が 640 ピクセルを超える場合に要素を非表示にします。`hidden sm:block` クラスは、ブラウザの表示幅が 640 ピクセル未満の場合に要素を非表示にします。

ここで説明した Tailwind CSS クラス トークンの詳細については、次のページを参照してください:

* https://tailwindcss.com/docs/width#arbitrary-values
* https://tailwindcss.com/docs/min-height#arbitrary-values
* https://tailwindcss.com/docs/responsive-design
* https://tailwindcss.com/docs/display


## サイトプロパティとプロパティの継承

### サイトプロパティ

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

### プロパティの継承

ページのフロントマターで特定のプロパティに値が設定されていない場合、tgwebは以下の順序で値を検索します。

1. 可能な場合は、そのラッパーのフロントマター
2. 可能な場合は、そのレイアウトのフロントマター
3. 可能な場合は、`sites.toml`

例えば、あるページのフロントマターで、次のようにカスタムプロパティ `x` の値が `"a"` と設定されているとします。

```
[data]
x = "a"
```

また、ラッパーのフロントマターが以下のような設定になっているとします:

```
[data]
x = "b"
y = "c"
```

この場合、このページのカスタムプロパティ `x` の値は `"a"` であり、カスタムプロパティ `y` の値は `"c"` です。

さらに、このページに適用されているレイアウトのフロントマターが以下のような設定になっているとします:

```
[data]
z = "d"
```

この場合、このページのプロパティ `z` の値は `"d"` となります。

また更に、`sites.toml` が以下のような設定になっているとします:

```
[data]
s = "e"
```

この場合、このページのカスタムプロパティ `s` の値は `"e"` となります。

カスタムプロパティだけでなく、`title` のような定義済みのプロパティも継承されます。また、"meta"、"http-equiv"、"meta-property"、"link" セクションに属するプロパティも継承されます。ただし、"style" セクションに属するプロパティは _継承されません_ 。

### プロパティ値をアーティクルに埋め込む

アーティクルが独立した HTML ドキュメントとしてレンダリングされるとき、プロパティの継承のメカニズムはページと全く同じです。

アーティクルがページ、セグメント、レイアウトに埋め込まれるとき、もしあれば、アーティクルを囲むラッパーと `site.toml` からプロパティを継承しますが、そのアーティクルを埋め込むページ、セグメント、レイアウトからは継承しません。

### ラッパーやレイアウトへのプロパティ値の埋め込み

ラッパーやレイアウトがページやアーティクルに適用されるとき、そのラッパーやレイアウトの `<tg:prop>` や `<tg:data>` 要素に置き換えられる値は、ページやアーティクルが持つプロパティの値です。

例えば、あるページに次のようなフロントマターがあるとします。

```
[data]
x = "a"
```

そして、そのラッパーが次のようなフロントマターとHTML断片を持っているとします。:

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

すると、そこから生成されるHTML文書の `<header>` 要素のテキスト内容は、"b c "ではなく、"a c "となります。

### プロパティの値をセグメントに埋め込む

セグメントがページに埋め込まれるとき、そのセグメントの `<tg:prop>` 要素と `<tg:data>` 要素に置き換えられる値は、ページが持つプロパティの値です。

同様に、セグメントがレイアウトの中にあるとき、そのセグメント内の `<tg:prop>` と `<tg:data>` 要素に置き換えられる値は、メインテンプレート（ページまたはアーティクル）のプロパティの値です。

### プロパティの値を部品に埋め込む

部品がページ、アーティクル、セグメント、ラッパー、レイアウトに埋め込まれるとき、そのテンプレートの `<tg:prop>` と `<tg:data>` 要素に置き換えられる値は、メインテンプレート（ページまたはアーティクル）のプロパティの値です。

## head要素の内容の管理

### `<title>` 要素

`<title>` 要素の内容は、ページやアーティクルのテンプレートから以下のルールで決定されます：

1. もしあれば、`title` プロパティの値
2. もしあれば、最初の `<h1>` 要素のテキスト内容
3. もしあれば、最初の `<h2>` 要素のテキスト内容
4. もしあれば、最初の `<h3>` 要素のテキスト内容
5. もしあれば、最初の `<h4>` 要素のテキスト内容
6. もしあれば、最初の `<h5>` 要素のテキスト内容
7. もしあれば、最初の `<h6>` 要素のテキスト内容
8. `"No Title"`

ページやアーティクルのフロントマターで `title` プロパティの値が設定されていなくても、ラッパーやレイアウト、あるいは `sites.toml` から継承している場合があることに注意してください。

#### Examples

以下のテンプレートから生成されるHTMLドキュメントのタイトルは "Greeting" になります:

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

文字列 "Welcome!" は次のテンプレートからタイトルとして抽出されます。

```html
<body>
  <h1>Welcome!</h1>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

次のテンプレートがHTMLドキュメントとしてレンダリングされる場合、そのタイトルは "No Title" となります:

```html
<body>
  <div class="text-2xl">Welcome!</div>
  <div class="bg-green-300 p-4">
    <p>Hello, world!</p>
  </div>
</body>
```

### `<meta>` 要素

`<head>` 要素内の `<meta>` 要素は "meta"、"http-equiv"、"meta-property" セクションに属するプロパティの値によって生成されます。


生成されたHTML文書の `<head>` 要素には、必ず `<meta charset="utf-8">` 要素が含まれていることに注意してください。

#### `[meta.name]` セクション

"meta.name" セクションに属するプロパティに値を設定することで、`name` 属性を持つ `<meta>` 要素を生成できます:

```toml
[meta.name]
viewport = "width=device-width, initial-scale=1"
theme-color = "#2da0a8"
description = "Description"
robots = "index,follow"
generator = "Teamgenik"
```

上記のようにプロパティの値を設定すると、以下の `<meta>` 要素が生成される。

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#2da0a8">
<meta name="description" content="Description">
<meta name="robots" content="index,follow">
<meta name="generator" content="Teamgenik">
```

同じ名前の `<meta>` 要素を複数生成したい場合は、次のように記述します。

```toml
[meta.name]
googlebot = [ "index,follow", "notranslate" ]
```

上記は以下の `<meta>` 要素を生成します。

```html
<meta name="googlebot" content="index,follow">
<meta name="googlebot" content="notranslate">
```

#### `[meta.http-equiv]` セクション

"http-equiv" セクションに属するプロパティに値を設定することで、`http-equiv` 属性を持つ `<meta>` 要素を生成できます。

```toml
[meta.http-equiv]
content-security-policy = "default-src 'self'"
x-dns-prefetch-control = "off"
```

上記の設定により、以下の `<meta>` 要素が生成されます:

```html
<meta http-equiv="content-security-policy" content="default-src 'self'">
<meta http-equiv="x-dns-prefetch-control" content="off">
```

Teamgenikはこれらのパスを適切にURLに変換します。

#### `[meta.property]` セクション

```toml
[meta.property]
"fb:app_id" = "1234567890abcde"
"fb:article_style" = "default"
"fb:use_automatic_ad_placement" = "true"
"op:markup_version" = "v1.0"
"al:ios:app_name" = "App Links"
"al:android:app_name" = "App Links"
```

上記の設定は、以下の `<meta>` 要素を生成します。

```html
<meta property="fb:app_id" content="1234567890abcde">
<meta property="fb:article_style" content="default">
<meta property="fb:use_automatic_ad_placement" content="true">
<meta property="op:markup_version" content="v1.0">
<meta property="al:ios:app_name" content="App Links">
<meta property="al:android:app_name" content="App Links">
```

プロパティの値は、`${...}` 記法を使って `<meta>` 要素の `content` 属性に埋め込むことができます:

```toml
[meta.property]
"og:url" = "${url}"
"og:title" = "${title}"
"og:description" = "${meta.name.description}"
```

"meta" セクションに属するプロパティの値を参照するには、プロパティ名の前に `meta.` を加えます。

画像や音声ファイルのURLは、`%{...}` 記法を使って `<meta>` 要素の `content` 属性に埋め込むことができます：

```toml
[meta.property]
"og:image" = "%{/images/icon.png}"
"og:audio" = "%{/audios/theme.mp3}"
```

### `<link>` 要素

`<head>` 要素内の `<link>` 要素は、"link" セクションと "links" セクションに属するプロパティの値によって生成されます。

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

上記は以下の `<link>` 要素を生成します。

```html
<link rel="canonical" href="https://example.com/">
<link rel="license" href="http://localhost:3000/copyright.html">
<link blocking="render" href="example.woff2" as="font">
<link rel="preload" href="myFont.woff2" as="font" type="font/woff2" crossorigin="anonymous">
```

ウェブサイトがTeamgenikで公開されると、`%{...}` 表記から生成されたURLは適切に変換されます。

#### Note

次の `<link>` 要素は常にhead要素の中に挿入されます。

```html
<link href="/css/tailwind.css" rel="stylesheet">
```

他のスタイルシートを参照する `<link>` 要素をhead要素内に挿入することはできません。

### `<script>` elements

`<script>` 要素はtgwebが管理します。`<script>` 要素を `<head>` 要素や `<body>` 要素に挿入することはできません。

#### Note

次の `<script>` 要素は常にhead要素内に挿入されます。

```html
<script src="/js/alpine.min.js" defer></script>
<script src="/reload/reload.js" defer></script>
```

## 特殊なタグと属性のリスト

### 特殊タグのリスト

* `<tg:animation>`: [アニメーション](#アニメーション)
* `<tg:article>`: [ページやセグメントにアーティクルを埋め込む](#ページやセグメントにアーティクルを埋め込む)
* `<tg:articles>`: [ページに複数のアーティクルを埋め込む](#ページに複数のアーティクルを埋め込む)
* `<tg:app>`: [ミニアプリの埋め込み](#ミニアプリの埋め込み)
* `<tg:component>`: [部品を埋め込む](#部品を埋め込む)
* `<tg:content>`: [レイアウトの追加](#レイアウトの追加), [ラッパーの追加](#ラッパーの追加)
* `<tg:data>`: [カスタムプロパティ](#カスタムプロパティ)
* `<tg:if-complete>`: [`<tg:if-complete>`](#tgif-complete)
* `<tg:if-current>`: [`<tg:link>、<tg:if-current>、<tg:label>`](#tglinktgif-currenttglabel)
* `<tg:if-embedded>`: [`<tg:if-embedded> と <tg:unless-embedded>`](#tgif-embedded-と-tgunless-embedded)
* `<tg:insert>`: [スロットとインサート](#スロットとインサート)
* `<tg:label>`: [`<tg:link>、<tg:if-current>、<tg:label>`](#tglinktgif-currenttglabel)
* `<tg:link>`: [`<tg:link>、<tg:if-current>、<tg:label>`](#tglinktgif-currenttglabel)
* `<tg:links>`: [リンクリスト](#リンクリスト)
* `<tg:prop>`: [Embedding predefined property values in a template](#embedding-predefined-property-values-in-a-template)
* `<tg:segment>`: [Embedding segments into a page](#embedding-predefined-property-values-in-a-template)
* `<tg:shared-component>`: [共有部品](#共有部品)
* `<tg:slot>`: [スロットとインサート](#スロットとインサート)
* `<tg:unless-embedded>`: [`<tg:if-embedded> と <tg:unless-embedded>`](#tgif-embedded-と-tgunless-embedded)

### 特殊属性のリスト

* `tg:1000`, etc.: [Scheduler](#scheduler)
* `tg:backward-*`: [Tram](#tram)
* `tg:body`: [Switcher](#switcher), [Rotator](#rotator), [Carousel](#carousel)
* `tg:carousel`: [Carousel](#carousel)
* `tg:choose`: [Switcher](#switcher), [Rotator](#rotator)
* `tg:class`: [スタイルエイリアスの定義](#スタイルエイリアスの定義)
* `tg:close`: [Modal](#modal)
* `tg:current-class`: [Switcher](#switcher), [Rotator](#rotator), [Carousel](#carousel)
* `tg:disabled-class`: [Carousel](#carousel)
* `tg:enabled-class`: [Carousel](#carousel)
* `tg:first`: [Switcher](#switcher), [Rotator](#rotator)
* `tg:frame`: [Carousel](#carousel)
* `tg:forward-*`: [Tram](#tram)
* `tg:init`: [Scheduler](#scheduler), [Tram](#tram)
* `tg:interval`: [Rotator](#rotator), [Carousel](#carousel)
* `tg:item`: [Carousel](#carousel)
* `tg:last`: [Switcher](#switcher), [Rotator](#rotator)
* `tg:modal`: [Modal](#modal)
* `tg:next`: [Switcher](#switcher), [Rotator](#rotator)
* `tg:normal-class`: [Switcher](#switcher), [Rotator](#rotator), [Carousel](#carousel)
* `tg:open`: [Modal](#modal)
* `tg:paginator`: [Switcher/Paginator](#paginator), [Carousel/Paginator](#paginator-1)
* `tg:prev`: [Switcher](#switcher), [Rotator](#rotator)
* `tg:rotator`: [Rotator](#rotator)
* `tg:switcher`: [Switcher](#switcher)
* `tg:scheduler`: [Scheduler](#scheduler)
* `tg:toggle`: [Toggler](#toggler)
* `tg:toggler`: [Toggler](#toggler)
* `tg:tram`: [Tram](#tram)
* `tg:transition-duration`: [Carousel](#carousel)
* `tg:when`: [Toggler](#toggler)

## TODO List

See [TODO.md](./TODO.md).

## License

**tgweb** is [MIT licensed](./LICENSE).

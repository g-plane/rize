<h1 align="center">Rize</h1>

<p align="center">
  <a href="https://circleci.com/gh/g-plane/rize/"><img src="https://flat.badgen.net/circleci/github/g-plane/rize" alt="Circle CI Build Status"></a>
  <a href="https://codecov.io/gh/g-plane/rize"><img src="https://flat.badgen.net/codecov/c/github/g-plane/rize" alt="Coverage"></a>
  <a href="https://github.com/g-plane/rize/blob/master/LICENSE"><img src="https://flat.badgen.net/github/license/g-plane/rize" alt="License"></a>
  <a href="https://www.npmjs.com/package/rize"><img src="https://flat.badgen.net/npm/v/rize" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/rize"><img src="https://flat.badgen.net/npm/dm/rize" alt="NPM Downloads"></a>
</p>

Rize is a high-level, fluent and chainable API provided library which let you use puppeteer simply.

"Rize" is pronounced like /ɾize/, not /raɪzɪ/. "Rize" is one of characters in [*Is the Order a Rabbit?*](https://en.wikipedia.org/wiki/Is_the_Order_a_Rabbit%3F).

### Translations

[简体中文](https://rize.js.org/zh-CN/)

We need your help to translate the docs!

## Installation

You should install `puppeteer` at the same time.

```bash
yarn add --dev puppeteer rize
```

or via npm:

```bash
npm install --save-dev puppeteer rize
```

If you are in China, you may specify Chromium binary mirror.

On Linux or macOS:

```bash
PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors yarn add --dev puppeteer rize
```

On Windows:

```shell
SET PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors yarn add --dev puppeteer rize
```

## Basic Usage

### Import

It's recommended to use ES-style import:

```javascript
import Rize from 'rize'
```

Or using CommonJS-style import, if you don't use any build tools:

```javascript
const Rize = require('rize')
```

### Getting Started

Just like this:

```javascript
const rize = new Rize()
```

You can pass some options to the constructor,
and these options are `puppeteer`'s options:

```javascript
const rize = new Rize({ headless: false })
```

All `Rize`'s APIs are chainable, so you can do something like this:

```javascript
const rize = new Rize()
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
  .assertSee('Node.js')
  .end()  // Don't forget to call `end` function to exit browser!
```

All available APIs are listed [here](https://rize.js.org/api/classes/_index_.rize.html).

## Documentation

Please visit [rize.js.org](https://rize.js.org)

## Contribution

Before you contribute to Rize, please read [Contributing Guide](./.github/CONTRIBUTING.md).

## License

MIT License

Copyright (c) 2018-present Pig Fang

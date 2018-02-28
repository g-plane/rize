<h1 align="center">Rize</h1>

<p align="center">
  <a href="https://travis-ci.org/g-plane/rize"><img src="https://img.shields.io/travis/g-plane/rize.svg?style=flat-square" alt="Travis Build Status"></a>
  <a href="https://ci.appveyor.com/project/g-plane/rize"><img src="https://img.shields.io/appveyor/ci/g-plane/rize.svg?style=flat-square&logo=appveyor" alt="AppVeyor Build Status"></a>
  <a href="https://codecov.io/gh/g-plane/rize"><img src="https://img.shields.io/codecov/c/github/g-plane/rize.svg?style=flat-square" alt="Coverage"></a>
  <a href="https://github.com/g-plane/rize/blob/master/LICENSE"><img src="https://img.shields.io/github/license/g-plane/rize.svg?style=flat-square" alt="License"></a>
  <a href="https://www.npmjs.com/package/rize"><img src="https://img.shields.io/npm/v/rize.svg?style=flat-square" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/rize"><img src="https://img.shields.io/npm/dm/rize.svg?style=flat-square" alt="NPM Downloads"></a>
</p>

Rize is a high-level, fluent and chainable API provided library which let you use puppeteer simply.

## Installation

You should install `puppeteer` at the same time.

```shell
yarn add --dev puppeteer rize
```

or via npm:

```shell
npm install --save-dev puppeteer rize
```

If you are in China, you may specify Chrome binary mirror.

On Linux or macOS:

```shell
PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org yarn add --dev puppeteer rize
```

On Windows:

```shell
SET PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org yarn add --dev puppeteer rize
```

For TypeScript users, you should install type declarations of `puppeteer`:

```shell
yarn add --dev @types/puppeteer
```

or 

```shell
npm install --save-dev @types/puppeteer
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
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
  .assertSee('Node.js')
  .end()  // Don't forget to call `end` function to exit browser!
```

All available APIs are listed [here](https://rize.js.org/classes/_index_.rize.html). 

### Lifecycle Hooks

`Rize` provides lifecycle hooks. You can use these hooks in `Rize` options.

```javascript
new Rize({
  beforeLaunch () {
    console.log('The browser is going to launch.')
  },
  afterLaunched () {
    // You can visit browser and page instance here.
    this.browser
    this.page
  }
})
```

## License

MIT License

Copyright (c) 2018-present Pig Fang

# Introduction

Rize is a high-level, fluent and chainable API provided library which let you use puppeteer simply.

## Features

- Full TypeScript support

- Chainable API

- You still can visit low-level `puppeteer` browser and page instance.

- Providing lots of useful assertions

## API Reference

If you are looking for all available APIs of `Rize`, please go [here](https://rize.js.org/api/modules/_index_.html).

## Installation

`puppeteer` is as a peer dependency of `Rize`, so you should install `puppeteer` manually.

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
PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org yarn add --dev puppeteer rize
```

On Windows:

```batch
SET PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org yarn add --dev puppeteer rize
```

For TypeScript users, you should install type declarations of `puppeteer`:

```bash
yarn add --dev @types/puppeteer
```

or 

```bash
npm install --save-dev @types/puppeteer
```
## Getting Started

We recommend to use ES-style `import` syntax:

```javascript
import Rize from 'rize'
```

Also, using CommonJS-style syntax is OK:

```javascript
const Rize = require('rize')
```

Now we can create a `Rize` instance:

```javascript
const rize = new Rize()
```

Here is an example:

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
  .assertSee('Node.js')
  .end()  // Don't forget to call `end` function to exit browser!
```
Now you can go ahead to read this documentation to look for more details!

## FAQ

See [FAQ](./faq.md).

## License

MIT License

Copyright (c) 2018-present Pig Fang

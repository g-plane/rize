<h1 align="center">Rize</h1>

<p align="center">
  <a href="https://travis-ci.org/g-plane/rize"><img src="https://img.shields.io/travis/g-plane/rize.svg?style=flat-square" alt="Travis Build Status"></a>
  <a href="https://ci.appveyor.com/project/g-plane/rize"><img src="https://img.shields.io/appveyor/ci/g-plane/rize.svg?style=flat-square&logo=appveyor" alt="AppVeyor Build Status"></a>
  <a href="https://codecov.io/gh/g-plane/rize"><img src="https://img.shields.io/codecov/c/github/g-plane/rize.svg?style=flat-square" alt="Coverage"></a>
  <a href="https://github.com/g-plane/rize/blob/master/LICENSE"><img src="https://img.shields.io/github/license/g-plane/rize.svg?style=flat-square" alt="License"></a>
  <a href="https://www.npmjs.com/package/rize"><img src="https://img.shields.io/npm/v/rize.svg?style=flat-square" alt="NPM Version"></a>
  <a href="https://www.npmjs.com/package/rize"><img src="https://img.shields.io/npm/dm/rize.svg?style=flat-square" alt="NPM Downloads"></a>
</p>

Rize is a high-level and fluent API provided library which let you use puppeteer simply.

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

## License

MIT License

Copyright (c) 2018-present Pig Fang

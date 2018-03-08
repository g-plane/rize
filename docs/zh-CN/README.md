# 介绍

Rize 是一个提供顶层的、流畅并且可以链式调用的 API 的库，它能让您简单地使用 puppeteer。

## 特性

- 完全的 TypeScript 支持

- 可链式调用的 API

- 您仍然可以访问底层的 `puppeteer` 的浏览器实例和页面实例

- 提供了很多方便有用的断言方法（用于测试）

## API 参考

如果您在查找 `Rize` 的所有可用的方法，请移步至[这里](https://rize.js.org/api/modules/_index_.html)。

## 安装

`puppeteer` 是 `Rize` 的一个 peer dependency，因此您需要额外地安装 `puppeteer`。

```bash
yarn add --dev puppeteer rize
```

或者通过 npm：

```bash
npm install --save-dev puppeteer rize
```

对于中国用户，最好指定 Chromium 的镜像：

对于 Linux 或 macOS 用户：

```bash
PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org yarn add --dev puppeteer rize
```

Windows 用户：

```batch
SET PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org yarn add --dev puppeteer rize
```

对于 TypeScript 用户，您可能需要安装 `puppeteer` 的类型定义文件。这是可选的。如果您需要直接访问 puppeteer 的 API，推荐您安装它：

```bash
yarn add --dev @types/puppeteer
```

或

```bash
npm install --save-dev @types/puppeteer
```
## 快速开始

我们推荐使用 ES 风格的 `import` 语法：

```javascript
import Rize from 'rize'
```

当然，使用 CommonJS 风格的语法也是可以的：

```javascript
const Rize = require('rize')
```

现在我们来创建一个 `Rize` 实例：

```javascript
const rize = new Rize()
```

这里是一个例子：

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
  .assertSee('Node.js')
  .end()  // 别忘了调用 `end` 方法来退出浏览器！
```
现在您可以继续阅读本文档来获取更多信息！

## 常见问题

见 [FAQ](./faq.md) 页面。

## 开源许可

MIT License

Copyright (c) 2018-present Pig Fang

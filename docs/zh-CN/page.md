# 页面操作

Rize 提供了一些基本的页面操作，例如导航和 HTTP 认证。

## 导航

最常用的操作是通过 [`goto`](https://rize.js.org/api/classes/_index_.rize.html#goto) 方法来访问一个页面。

```javascript
rize.goto('http://example.com')
```

您可以前进、后退或刷新当前页面：

```javascript
rize.forward()
rize.back()
rize.refresh()
```

## 页面配置

您可以指定 user agent：

```javascript
rize.withUserAgent(/* user agent */)
```

HTTP 认证：

```javascript
rize.withAuth('username', 'password')
```

修改 HTTP 头部：

```javascript
rize.withHeaders({/* 额外的头部信息 */})
```



## 在页面中执行函数

### 基本用法

您可以在*浏览器*环境中执行函数或表达式。注意是浏览器而不是在 Node.js 中。因此如果您想在 Node.js 环境中执行什么，请使用 [`execute`](https://rize.js.org/api/classes/_index_.rize.html#execute) 方法。

```javascript
rize.evaluate(() => console.log('output in browser not node.js'))
```

您可以传递一个字符串，它将会被当成表达式来执行：

```javascript
rize.evaluate('console.log("output in browser not node.js")')
```

初学者可能会犯这样的错误，就是直接访问外部变量：

```javascript
// 别这么干！
const greeting = 'hi'
rize.evaluate(() => console.log(greeting))
```

就像上面所说的，函数或表达式会在浏览器中执行。然而，变量 `greeting` 并不存在于浏览器的 JavaScript 环境中。（除非它确实存在或您曾经定义过它）因此上面的代码会抛出 `ReferenceError` 错误。

解决方法是写一个带有参数的函数然后向它传递参数。像这样：

```javascript
const greeting = 'hi'
rize.evaluate(message => console.log(message), greeting)  // 没问题！
```

### 获取返回值

为了保持 API 能可链式调用， [`evaluate`](https://rize.js.org/api/classes/_index_.rize.html#evaluate) 方法不会返回您的函数或表达式的返回值，它只会返回当前 `Rize` 实例，尽管您的函数或表达式会返回一些东西。

有一个方法 [`evaluateWithReturn`](https://rize.js.org/api/classes/_index_.rize.html#evaluatewithreturn) 它可以让您获取返回值（经过 Promise 包装）。

```javascript
(async () => {
  const rize = new Rize()
  const byExpr = await rize.evaluateWithReturn('document.title')
  const byFunc = await rize.evaluateWithReturn(() => document.title)
})()
```

### `evaluate` 方法与 `execute` 方法的区别

TL;DR: `evaluate` 方法中的代码会在浏览器中执行而  `execute` 方法中的代码会在 Node.js 中执行。

当您使用 `evaluate` 方法的时候，您的函数会被转换成字符串（通过调用 `toString` 方法），参数也会被序列化。因此如果您的参数不能被序列化，将会发生错误。

您的函数在被转换成字符串、参数被序列化后（表达式不需要转换，因为它本来就是字符串），代码会被发送至浏览器然而交给浏览器执行。这意味着您的代码可以访问浏览器环境中的一些变量（如 `window` 和 `document`）。

而 [`execute`](https://rize.js.org/api/classes/_index_.rize.html#execute) 方法则能让你在完成上一个操作后执行一些事情。所有的代码会在 Node.js 环境中执行。例如，我们可以打日志，然后保存到磁盘中：

```javascript
const fs = require('fs')

const rize = new Rize()
rize
  .goto('http://example.com')
  .execute(() => fs.writeFileSync('operations.log', 'visiting...'))
```

查看 [`execute`](https://rize.js.org/api/classes/_index_.rize.html#execute) 方法的文档可以获取更多信息。

## 添加标签

您可以向页面中添加 `<script>` 或 `<style>` 标签，您可以理解为注入 JavaScript 或 CSS 代码。

如果要添加 `<script>` 标签，请使用 [`addScriptTag`](https://rize.js.org/api/classes/_index_.rize.html#addscripttag) 方法；如果要添加 `<style>` 标签，请使用 [`addStyleTag`](https://rize.js.org/api/classes/_index_.rize.html#addstyletag) 方法。

这两个方法有相同的函数签名。第一个参数是 `type`，它**只能**是 `url`, `path` 或 `content` 三者之一。第二个参数是 `value`，具体内容取决于第一个参数。

- 如果第一个参数 `type` 是 `url`，您应该给出一个远程的 JS/CSS 文件的 URL。
- 如果第一个参数 `type` 是 `path`，您应该给出本地 JS/CSS 文件的路径。
- 如果第一个参数 `type` 是 `content`，您应该给出有效的 JavaScript/CSS 代码。

> 除非您手动指定使用旧版的 Chrome/Chromium，您可以随意地使用最新的 ES 特性。

## 多页面

Rize 支持多页面（也称标签页）。

在使用 Rize 的多页面功能之前，您最好理解下面一些内容。当您启动浏览器之后，浏览器中会有两个页面，一个是由 puppeteer 默认创建的，另一个是由 Rize 创建的。这对于不打算使用多页面功能的人来说是很方便的。（您不必手动新建页面。）

### 打开新页面

若要打开一个新页面，请使用 [`newPage`](https://rize.js.org/api/classes/_index_.rize.html#newpage) 方法。

```javascript
rize.newPage()
```

[`newPage`](https://rize.js.org/api/classes/_index_.rize.html#newpage) 接收两个参数（都是可选的）。第一个是 `name`，当您要切换页面的时候，您可以使用这个名称来区分不同的页面。

第二个参数是 `options`，有两个选项。

`force` 选项用于当您使用已经存在的 `name` 值的时候，可以强制替换相同名字的旧页面。如果 `force` 为 true，当您使用一个已经存在的名字来打开新页面的时候，已有的页面会被新页面替换。否则原页面会保留，不会打开新页面。

`stayCurrent` 选项用于当新页面打开之后是否停留在当前的旧页面。如果 `stayCurrent` 为 true，在打开一个新的页面之后，当前的活动前面不会改变。否则在新建一个页面后，会切换到新页面。

### 关闭页面

通过调用 [`closePage`](https://rize.js.org/api/classes/_index_.rize.html#closepage) 方法来关闭页面：

```javascript
rize.closePage()
```

您也可以指定您想要关闭的页面的名称：

```javascript
rize.closePage('page1')
```

### 切换到另一个页面

[`switchPage`](https://rize.js.org/api/classes/_index_.rize.html#switchpage) 方法接收一个参数，它可以是字符串，也可以是数字。

如果是字符串，它表示 `name`，也就是您想要切换到的页面的名称。

如果是数字，它会从内部的包含所有页面的数组中按索引找出您想要的页面，然后切换到它。

```javascript
rize.switchPage(0)
rize.switchPage('page0')
```


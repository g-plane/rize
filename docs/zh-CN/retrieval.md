# 获取数据

有时候您可能只是想获取数据而不是做断言，例如利用 Rize 和 puppeteer 爬虫。

所有能返回数据的方法都会返回经过 Promise 包装的值。也就是说，它们是异步的。我们建议您使用 ES2017 的 `async/await` 语法。

## 页面标题和内容

获取标题很简单：

```javascript
(async () => {
  const rize = new Rize()
  const title = await rize.title()
})()
```

还有文本内容：

```javascript
(async () => {
  const rize = new Rize()
  const text = await rize.text()
})()
```

[`text`](https://rize.js.org/api/classes/_index_.rize.html#text) 方法有一个可选的参数，您可以传递一个 CSS 选择器，它表示从对应的元素中获取文本。这个参数的默认值是 `body`。

获取 HTML 内容：

```javascript
(async () => {
  const rize = new Rize()
  const html = await rize.html()
})()
```

[`html`](https://rize.js.org/api/classes/_index_.rize.html#html) 方法同样有一个可选的参数，您可以传递一个 CSS 选择器，它表示从对应的元素中获取 HTML。这个参数的默认值是 `html`，这意味着获取整个 HTML 文档。

## 页面信息

Rize 还提供了一些可以获取当前页面信息的方法。

您可以获取 URL：

```javascript
(async () => {
  const rize = new Rize()
  const url = await rize.url()
})()
```

还有 query string：

```javascript
(async () => {
  const rize = new Rize()
  const value = await rize.queryString('key1')
})()
```

还有 cookie(s)：

```javascript
(async () => {
  const rize = new Rize()
  const cookie = await rize.cookie()    // 只获取一个 cookie
  const cookies = await rize.cookies()  // 获取包含 cookies 的数组
})()
```

## 元素

通过使用 [`attribute`](https://rize.js.org/api/classes/_index_.rize.html#attribute), [`style`](https://rize.js.org/api/classes/_index_.rize.html#style), [`value`](https://rize.js.org/api/classes/_index_.rize.html#value) 和 [`hasClass`](https://rize.js.org/api/classes/_index_.rize.html#hasclass) 方法，您可以很方便地获取元素的数据：

```javascript
(async () => {
  const rize = new Rize()

  // 获取属性
  const value = await rize.attribute('input', 'value')
  
  // 获取样式
  const fontSize = await rize.style('div', 'font-size')
  
  // 获取值。这等同于 `rize.attribute(/* 选择器 */, 'value')`
  const val = await rize.value('input')
  
  // 获取某个元素是否包含某个 class
  const hasMyClass = await rize.hasClass('div', 'my-class')
})()
```

不过，[`value`](https://rize.js.org/api/classes/_index_.rize.html#value) 方法可以接收第二个参数。当您传递第二个参数，它将设置该元素的值而不是获取值，同时返回当前的 `Rize` 实例，不是 `Promise`。

```javascript
const rize = new Rize()
rize.value('input', 'new-value')
// ... 这里可以使用可链式调用的方法
```

您还可以获知一个元素是否可见或存在：

```javascript
(async () => {
  const rize = new Rize()
  const visible = await rize.isVisible('div')
  const present = await rize.isPresent('canvas')
})()
```

## 其它方法

前往[这个页面](https://rize.js.org/api/classes/_index_.rize.html)可以查看全部的方法。
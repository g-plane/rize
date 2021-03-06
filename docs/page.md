# Page Operations

Rize provides some basic operations for page such as navigation and authentication.

## Navigation

The most common operation is visit a page by using [`goto`](https://rize.js.org/api/classes/_index_.rize.html#goto) method.

```javascript
rize.goto('http://example.com')
```

And, you can go forward, go back and refresh current page:

```javascript
rize.forward()
rize.back()
rize.refresh()
```

## Page configuration

You can specify user agent string:

```javascript
rize.withUserAgent(/* user agent */)
```

HTTP authentication:

```javascript
rize.withAuth('username', 'password')
```

HTTP headers:

```javascript
rize.withHeaders({/* extra headers */})
```



## Evaluating function in page

### Basic usage

You can evaluating function or expression in *browser* context. Note that it is in browser not in Node.js, so if you want to do something in Node.js environment, please use [`execute`](https://rize.js.org/api/classes/_index_.rize.html#execute) method.

```javascript
rize.evaluate(() => console.log('output in browser not node.js'))
```

You can pass a string and it will be treated as an expression:

```javascript
rize.evaluate('console.log("output in browser not node.js")')
```

Beginners may make a mistake to visit variables directly:

```javascript
// Don't do like this!
const greeting = 'hi'
rize.evaluate(() => console.log(greeting))
```

As mentioned above, the function or expression will be evaluated in browser context. However, the variable `greeting` was not existed in browser context. (Unless the page really defined it or you have defined it.) So the code above will throw a `ReferenceError`.

The solution is write a function with parameter(s) and pass argument(s) manually like this:

```javascript
const greeting = 'hi'
rize.evaluate(message => console.log(message), greeting)  // Works!
```

### Retrieve return value

To keep the API chainable, the [`evaluate`](https://rize.js.org/api/classes/_index_.rize.html#evaluate) method doesn't return the value of your function or expression and it will return the current `Rize` instance, though your function or expression will return something.

There is another method called [`evaluateWithReturn`](https://rize.js.org/api/classes/_index_.rize.html#evaluatewithreturn) and it can let you retrieve the return value(wrapped with `Promise`).

```javascript
(async () => {
  const rize = new Rize()
  const byExpr = await rize.evaluateWithReturn('document.title')
  const byFunc = await rize.evaluateWithReturn(() => document.title)
})()
```

### Difference between `evaluate` method and `execute` method

TL;DR: The code in `evaluate` method will be evaluate in browser while the code in `execute` method will be execute in Node.js.

When you use `evaluate` method, your function will be stringify (by calling `toString` method) and your arguments will be serialized. So if your arguments cannot be serialized some errors will be occurred.

After stringified your function (expression will be passed as string so no need to do that) and serialized your arguments, those code will be sent to browser and evaluated in browser. That means your code can visit variables in browser context (such as `window` and `document`).

And the [`execute`](https://rize.js.org/api/classes/_index_.rize.html#execute) method just give you a chance to do something after last operation. All the code will be execute in Node.js. For example, we can log something to a file on the disk:

```javascript
const fs = require('fs')

const rize = new Rize()
rize
  .goto('http://example.com')
  .execute(() => fs.writeFileSync('operations.log', 'visiting...'))
```

You can check out more info by reading documentation of [`execute`](https://rize.js.org/api/classes/_index_.rize.html#execute) method.

## Adding tags

You can add `<script>` or `<style>` tag to current page, just like injecting some JavaScript code or CSS code.

To add `<script>` tag, please use [`addScriptTag`](https://rize.js.org/api/classes/_index_.rize.html#addscripttag) method; to add `<style>` tag, please use [`addStyleTag`](https://rize.js.org/api/classes/_index_.rize.html#addstyletag) method.

These two method have the same function signature. The first parameter `type` can **only** be `url`, `path` or `content`. The second parameter is `value`, which decided by the first parameter.

- If the first parameter `type` is `url`, you should give a URL to a remote JS/CSS file. 
- If the first parameter `type` is `path`, you should give a path to a local JS/CSS file.
- If the first parameter `type` is `content`, you should give valid JavaScript code/CSS code.

> Unless you have specify an old version Chrome/Chromium, you can feel free to use latest ES features.

## Multiple pages

Rize supports multiple pages (aka tabs).

You should understand something when using multiple pages in Rize. When you launched puppeteer, there will be two pages. One is created by puppeteer by default and the another one is created by Rize. This is useful if you aren't going to use multiple pages. (You don't need to open a new page manually.)

### Open a new page

To open a new page, just call the [`newPage`](https://rize.js.org/api/classes/_index_.rize.html#newpage) method.

```javascript
rize.newPage()
```

The [`newPage`](https://rize.js.org/api/classes/_index_.rize.html#newpage) receive two arguments (both are optional). The first one is `name`. You can use this to identify different pages and it is useful when you want to switch page.

The second one is `options` which has two options.

The `force` option is used to replace the old page with the same `name` you gave. If `force` is true, when you open a new page with duplicated name, existing page will be replaced with this new one. Otherwise, the existing page will be kept and no new page will be created.

The `stayCurrent` option is used to determine if stay in current page after new page was created. If `stayCurrent` is true, after opened a new page, the active page won't be changed. Otherwise, the active page will be switched to the new page.

### Close a page

To close the page, just call [`closePage`](https://rize.js.org/api/classes/_index_.rize.html#closepage) method.

```javascript
rize.closePage()
```

Or you can give the name of the page you want to close:

```javascript
rize.closePage('page1')
```

### Switch to another page

The [`switchPage`](https://rize.js.org/api/classes/_index_.rize.html#switchpage) receive one argument and it can be a string or a number.

When it is a string, it means `name`. It is the name of the page you want to switch to.

When it is a number, it will find the page by index in the internal array of pages and switch to it.

```javascript
rize.switchPage(0)
rize.switchPage('page0')
```


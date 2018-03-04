# Retrieving Data

Sometimes you may just want to retrieve data not assert something, such as you are using Rize and puppeteer to do web crawling.

All methods which are used to retrieve data return Promise-wrapped data. In other words, those are asynchronous operations. We suggest you use ES2017 `async/await` syntax.

## Page title and content

Retrieve title is simple:

```javascript
(async () => {
  const rize = new Rize()
  const title = await rize.title()
})()
```

For text content:

```javascript
(async () => {
  const rize = new Rize()
  const text = await rize.text()
})()
```

The [`text`](https://rize.js.org/api/classes/_index_.rize.html#text) method has one parameter, and you can pass a CSS selector to it, which means retrieve text content from the given element. The default value of this parameter is `body`.

For HTML content:

```javascript
(async () => {
  const rize = new Rize()
  const html = await rize.html()
})()
```

The [`html`](https://rize.js.org/api/classes/_index_.rize.html#html) method also has one parameter, and you can pass a CSS selector to it, which means retrieve HTML from the given element. The default value of this parameter is `html`, which means retrieve the whole html document.

## Page info

Rize also provides some methods to retrieve the information of current page.

You can get URL:

```javascript
(async () => {
  const rize = new Rize()
  const url = await rize.url()
})()
```

And query string:

```javascript
(async () => {
  const rize = new Rize()
  const value = await rize.queryString('key1')
})()
```

And cookie(s):

```javascript
(async () => {
  const rize = new Rize()
  const cookie = await rize.cookie()    // This returns one cookie
  const cookies = await rize.cookies()  // This returns an array of cookies
})()
```

## Element

It's easy to retrieve some information by using [`attribute`](https://rize.js.org/api/classes/_index_.rize.html#attribute), [`style`](https://rize.js.org/api/classes/_index_.rize.html#style), [`value`](https://rize.js.org/api/classes/_index_.rize.html#value) and [`hasClass`](https://rize.js.org/api/classes/_index_.rize.html#hasclass) methods.

```javascript
(async () => {
  const rize = new Rize()

  // Retrieve attribute
  const value = await rize.attribute('input', 'value')
  
  // Retrieve style
  const fontSize = await rize.style('div', 'font-size')
  
  // Retrieve value. This equals to `rize.attribute(/* selector */, 'value')`
  const val = await rize.value('input')
  
  // Does an element has a given class name?
  const hasMyClass = await rize.hasClass('div', 'my-class')
})()
```

However, the [`value`](https://rize.js.org/api/classes/_index_.rize.html#value) method can receive the second parameters. When you pass it, it means set the value instead of retrieving value and it returns `this`, not a `Promise`.

```javascript
const rize = new Rize()
rize.value('input', 'new-value')
// ... chainable methods here
```

And, you can check if an element is visible or present:

```javascript
(async () => {
  const rize = new Rize()
  const visible = await rize.isVisible('div')
  const present = await rize.isPresent('canvas')
})()
```

## Other methods

For all available methods, please check [this page](https://rize.js.org/api/classes/_index_.rize.html).
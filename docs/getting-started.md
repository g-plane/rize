# Getting Started

Most of Rize APIs are chainable and all the operations will be executed in the order of you called.

Now let me show you an example to visit GitHub to search something and save a screenshot.

To make us see what happened, we can pass `headless: false` flag to Rize.

```javascript
const rize = new Rize({ headless: false })
```

As we know, in `puppeteer`, after you launched the browser, you must new a page. However, in Rize, you don't need to do that.

So we just visit "https://github.com/"

```javascript
rize.goto('https://github.com/')
```

Now we want to search "node", so we can type "node" to the search box. The selector of the search box is `input.header-search-input`.

```javascript
rize.type('input.header-search-input', 'node')
```

Don't forget most of Rize APIs are chain able, so we can make it elegant:

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
```

Press `Enter` to submit the search query:

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
```

Well, we can submit to search now. However once you submitted the current page will be navigated to the result page. We must wait for the navigation:

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
```

Let's go ahead and save a screenshot:

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
  .saveScreenshot('searching-node.png')
```

If all work well, you should find a screenshot file in current directory.

Now are everything done? Not really. Don't forget to exit the browser:

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
  .saveScreenshot('searching-node.png')
  .end()
```

That's all! For more advanced usage, please read other sections of this documentation.
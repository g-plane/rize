# FAQ

## Why is it called "Rize"?

"Rize" is a character in *[Is the Order a Rabbit?](https://en.wikipedia.org/wiki/Is_the_Order_a_Rabbit%3F)*.

Her full name is "Rize Tedeza" and written "リゼ" in Japanese.

So "Rize" is pronounced like /ɾize/, not /raɪzɪ/.

## Why do you want to make this library?

Puppeteer has done a great job to control Chromium/Chrome and we can use puppeteer for web crawling, automated test and etc. However, the code for using puppeteer doesn't seem to be elegant and simple.

Here is an example for using puppeteer directly:

```javascript
const puppeteer = require('puppeteer')
void (async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://github.com')
  await page.screenshot({ path: 'github.png' })
  await browser.close()
})()
```

As you can see, most puppeteer's operations are asynchronous. So we must use ES2017 syntax `async/await`. (How about using `Promise`? Maybe the code will be unreadable!)

This is just a tiny example. If we have a large project, there will be many `await` keyword.

That is the reason why I want to make this library. *Greatly inspired by jQuery and Laravel Dusk.*

Now let me show you an example for using Rize:

```javascript
const Rize = require('rize')
const rize = new Rize()
rize
  .goto('https://github.com')
  .saveScreenshot('github.png')
  .end()
```

No more redundant code and keep elegant!

Additionally, this library provides some useful assertions for testing, such as `assertUrlIs`.

## Can I still visit the puppeteer's browser instance and call puppeteer's API?

Absolutely you can!

Rize won't prevent you visit puppeteer's all available methods. What you need to do is use the `browser` or `page` property on `Rize` instance:

```javascript
const Rize = require('rize')
const rize = new Rize()
rize.browser  // This is equivalent to puppeteer.Browser
rize.page     // This is equivalent to puppeteer.Page
```

## Can I integrated it with some testing framework (such as Jest, mocha...)?

You can use any testing framework you like.
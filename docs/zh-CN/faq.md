# FAQ

## 为什么叫 “Rize”?

“Rize” 是《[请问您今天要来点兔子吗？](https://zh.moegirl.org/%E8%AF%B7%E9%97%AE%E6%82%A8%E4%BB%8A%E5%A4%A9%E8%A6%81%E6%9D%A5%E7%82%B9%E5%85%94%E5%AD%90%E5%90%97)》中的一个角色。

她全名是“天天座理世”，日语写作“リゼ”。

所以 “Rize” 的发音是 /ɾize/，而不是 /raɪzɪ/.

## 你为什么会创建这个库？

Puppeteer 在控制 Chromium/Chrome 方面干得很好，我们也可以利用 puppeteer 来做爬虫、自动化 UI 测试等等。然而，编写使用 puppeteer 的代码并不优雅、并不简单。

下面是一个直接使用 puppeteer 的例子：

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

正如您所见，puppeteer 的大多数的操作是异步的。因此我们必须使用 ES2017 的语法 `async/await`。（你说使用 `Promise`？那只会让代码变得难以阅读！）

这还只是一个小小的例子。要是在一个大项目里，将会满是 `await` 关键字。

这就是我创建这个库的原因。*并且受到了 jQuery 和 Laravel Dusk 的启发。*

现在来看看使用 Rize 的例子：

```javascript
const Rize = require('rize')
const rize = new Rize()
rize
  .goto('https://github.com')
  .saveScreenshot('github.png')
  .end()
```

不再有多余的代码，同时变得优雅！

另外，这个库还提供了一些有用的用于测试的断言方法，例如 `assertUrlIs`。

## 我还能访问 puppeteer 的浏览器实例并且调用 puppeteer 的 API 吗？

当然可以！

Rize 并不会阻止您调用 puppeteer 所有可用的方法。您只需要访问 `Rize` 实例上的 `browser` 或 `page` 属性：

```javascript
const Rize = require('rize')
const rize = new Rize()
rize.browser  // 这等同于 puppeteer.Browser
rize.page     // 这等同于 puppeteer.Page
```

## 我可以将这个库和其它的测试框架一起使用吗（例如 Jest、 mocha 等等）？

您可以使用任何您喜欢的测试框架。

### 对于 Jest 用户

我们推荐使用 Jest。您不需要修改任何配置。

### 对于 Mocha 用户

您不需要修改任何配置。

不过，由于 Mocha 的限制，您不能同时使用 `done` 回调和 `async/await`。

您应该像下面这样做：

```javascript
describe('some tests', () => {
  it('a test', async () => {
    const rize = new Rize()
    // 做点别的……
    await rize.end()
  })
})
```

下面是个反面例子：

```javascript
describe('some tests', () => {
  it('a test', async done => {
    const rize = new Rize()
    // 做点别的……
    rize.end(done)
  })
})
```

### 对于 AVA 用户

您应该在 `package.json` 中把` failWithoutAssertions` 设为 `false`。

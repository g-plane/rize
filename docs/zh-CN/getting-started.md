# 开始

Rize 的大多数 API 都是可链式调用的，所有的操作会按您调用的顺序去执行。

现在我们来看看一个例子。这个例子将会访问 GitHub 并搜索一些东西，然后保存截图。

为了能让我们看到这个过程发生了什么，我们可以传递标志 `headless: false` 给 Rize。

```javascript
const rize = new Rize({ headless: false })
```

您可能已经知道，在 `puppeteer` 中，在启动浏览器之后，您必须新建一个页面。然而在 Rize 中，您不需要这么做。

我们来访问 https://github.com/

```javascript
rize.goto('https://github.com/')
```

现在我们想要搜索 “node”，所以只需输入 “node” 到搜索框中。搜索框的选择器是 `input.header-search-input`。

```javascript
rize.type('input.header-search-input', 'node')
```

别忘了 Rize 的大多数的 API 是可链式调用的，因此我们让代码变得优雅：

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
```

按 `Enter` 键来提交搜索：

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
```

好，现在我们已经提交了搜索。但是在您提交之后，当前页面会被转向到搜索结果页面。我们必须等待这次转向：

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
```

保存截图：

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
  .saveScreenshot('searching-node.png')
```

如果一切工作正常，您将会在当前目录发现一张截图。

现在已经完成任务了吗？并不！别忘了退出浏览器：

```javascript
rize
  .goto('https://github.com/')
  .type('input.header-search-input', 'node')
  .press('Enter')
  .waitForNavigation()
  .saveScreenshot('searching-node.png')
  .end()
```

全部完成！想要了解更多用法，请阅读本文档的其它部分。
# 测试

许多开发者会使用 puppeteer 去进行自动化的 UI 测试。然而 puppeteer 仅仅是一个用于控制 Chromium 的软件，它不可能提供断言方法让您用于测试。

Rize 提供了很多有用的断言方法用于测试。Rize 仅仅是一个库并且使用了 Node.js 的 `assert` 模块，所以您可以将它和任何您喜欢的测试框架一起使用。

## 断言页面信息

您可能想断言当前页面的 URL，那么您可以使用 [`assertUrlIs`](https://rize.js.org/api/classes/_index_.rize.html#asserturlis) 方法：

```javascript
rize.assertUrlIs('https://example.com/')
```

如果您想检查 URL 是否匹配指定的正则表达式，可以使用 [`assertUrlMatch`](https://rize.js.org/api/classes/_index_.rize.html#asserturlmatch) 方法：

```javascript
rize.assertUrlMatch(/^https?/)
```

您也可以断言 query string。只需使用 [`assertQueryStringHas`](https://rize.js.org/api/classes/_index_.rize.html#assertquerystringhas) 方法：

```javascript
rize.assertQueryStringHas('key')
```

您可能还想检查 query string 上的值，而不仅仅是键：

```javascript
rize.assertQueryStringHas('key', 'value')
```

上面的断言表示检查 query string 中 `key` 对应的值。如果实际的值与给定的不同，测试将不能通过。

您甚至可以断言 query string 不存在指定的键：

```javascript
rize.assertQueryStringMissing('nope')
```

另外，如果您想断言 cookies 您可以使用 [`assertCookieHas`](https://rize.js.org/api/classes/_index_.rize.html#assertcookiehas) 方法。

## 断言页面内容和元素

### 页面

您可以用 [`assertTitle`](https://rize.js.org/api/classes/_index_.rize.html#asserttitle) 方法或 [`assertTitleContains`](https://rize.js.org/api/classes/_index_.rize.html#asserttitlecontains) 方法断言当前页面的标题。

```javascript
rize.assertTitle('page title')
```

```javascript
rize.assertTitleContains('title')
```

如果您想检查当前页面是否包含指定的文本，可以使用 [`assertSee`](https://rize.js.org/api/classes/_index_.rize.html#assertsee) 方法。

```javascript
rize.assertSee('something')
```

您也可以使用 [`assertSeeIn`](https://rize.js.org/api/classes/_index_.rize.html#assertseein) 方法来断言某些文本是否存在某个元素中，您只需要给出该元素的选择器。

```javascript
rize.assertSeeIn('#greeting', 'Hello!')
```

您还可以使用 [`assertDontSee`](https://rize.js.org/api/classes/_index_.rize.html#assertdontsee) 或 [`assertDontSeeIn`](https://rize.js.org/api/classes/_index_.rize.html#assertdontseein) 方法来断言指定的文本是否不存在于页面或某个元素中。

### 元素

您可以断言某个元素的状态：

```javascript
rize.assertElementPresent('div')
rize.assertElementMissing('div')
rize.assertElementVisible('div')
rize.assertElementHidden('div')
```

可以检查某个元素是否包含指定的 class：

```javascript
rize.assertClassHas('#greeting', 'pull-right')
```

或不存在某个 class：

```javascript
rize.assertClassMissing('#greeting', 'pull-left')
```

您可以断言某个复选框或某个单选框或某个下拉菜单的状态：

```javascript
rize.assertChecked('input[type=checkbox]')
rize.assertNotChecked('input[type=checkbox]')
rize.assertRadioSelected('input[type=radio]', 'south')
rize.assertRadioNotSelected('input[type=radio]', 'north')
```

也可以使用 [`assertValueIs`](https://rize.js.org/api/classes/_index_.rize.html#assertvalueis) 方法或 [`assertValueIsNot`](https://rize.js.org/api/classes/_index_.rize.html#assertvalueisnot) 方法来断言它的值。

## 全部的 API

所有的断言方法都在[这里](https://rize.js.org/api/classes/_index_.rize.html)列出，它们都以 `assert` 开头。

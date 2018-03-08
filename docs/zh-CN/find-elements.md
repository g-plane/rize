# 查找元素

## 简介

`Rize` 的所有 API 都只是寻找符合您所给的 CSS 选择器的第一个元素。不过，有时候您可能想要查找第一个元素后面的元素，就像 `document.querySelectorAll` 那样。

Rize 提供了三个方法可以让您查找元素。如果您喜欢，您还可以用 XPath 来查找。这三个方法是 [`find`](https://rize.js.org/api/classes/_index_.rize.html#find)， [`findAll`](https://rize.js.org/api/classes/_index_.rize.html#findall) 和 [`findByXPath`](https://rize.js.org/api/classes/_index_.rize.html#findbyxpath)。

`find` 方法仅仅是查找符合您所给的 CSS 选择器的第一个元素，就像 `document.querySelector` 那样。因此大多数时候，您不需要这个方法。

`findAll` 方法有些像 `document.querySelectorAll`，但它并不是返回包含元素的数组。实际上，您需要指定您想要的元素在结果数组中的索引。 `findByXPath` 方法跟 `findAll` 和 `findByXPath` 差不多，只不过它使用的是 XPath。

下面的例子和文档都是使用 `findAll `为例子。`findByXPath` 的用法跟 `findAll` 一样。（只是把 CSS 选择器换成 XPath 而已）

## 函数的签名

### 第一个参数

`findAll` 方法的第一个参数是 CSS 选择器，而 `findByXPath` 方法的第一个参数是 XPath 表达式。Rize 会按照您给的 CSS 选择器或 XPath 表达式来查找元素。

### 第二个参数

对于那两个方法而言，第二个参数是 `index`。您必须指定您想要的元素在元素搜索结果数组中的索引。

### 第三个参数

第三个参数是一个函数。您可以传递 Rize 的 API。但要注意，并不是全部的 API 都是可以的。

那个函数不能有超过三个参数。如果您有超过三个参数的函数，请重构它或用另一个参数对它进行包装。（一个函数有太多参数并不是一个良好的实践）

除此之外，第三个参数，也就是那个函数，必须接收一个 CSS 选择器作为第一个参数。

### 剩余的参数

所有的剩余参数都会当作参数传递给您的那个函数（即第三个参数）。

## 例子

下面是一些例子：

```javascript
const rize = new Rize()
rize.findAll('div', 0, rize.assertVisible)
rize.findAll('div', 1, rize.assertClassHas, 'my-class')
```

上面的例子都是没问题的，因为 `assertVisible` 方法和 `assertClassHas` 方法接收 CSS 选择器作为函数的第一个参数。

但是下面这个不行：

```javascript
// 别这么干！
const rize = new Rize()
rize.findAll('div', 0, rize.assertTitle)
```

尽管 `assertTitle` 方法的第一个参数是字符串，但它不是 CSS 选择器。

事实上，您可以传递一个自己定义的函数，而不仅仅是 Rize 的 API。

```javascript
(async () => {
  const rize = new Rize()
  const value = await rize.findAll(
    'input',
    0,
    selector => rize.evaluate(
      s => document.querySelector(s).value,
      selector
    )
  )
})()
```

您可能想知道 `find`， `findAll` 和 `findByXPath` 方法的返回值。实际上，这取决于您传递的那个函数（也就是第三个参数）。
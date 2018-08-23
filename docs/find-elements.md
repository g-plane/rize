# Find Elements

## Brief

All the APIs of `Rize` just support the first element which matched the CSS selector you gave. However, sometimes you may want to find non-first-matched element, just like calling `document.querySelectorAll`.

Rize provides three special methods to let you find elements, even by XPath, if you like. These three methods are [`find`](https://rize.js.org/api/classes/_index_.rize.html#find), [`findAll`](https://rize.js.org/api/classes/_index_.rize.html#findall) and [`findByXPath`](https://rize.js.org/api/classes/_index_.rize.html#findbyxpath).

The `find` method just find the first element which matched the CSS selector, whose behavior is like `document.querySelector`. So most of time you may not need to use this method.

The `findAll` method does as `document.querySelectorAll`, but it doesn't return an array of elements. In fact, you should specify the index of the element you want to operate. The `findByXPath` method does the same thing and the difference between `findAll` and `findByXPath` is the former use CSS selector while the latter use XPath.

All the examples and documentation below will use `findAll`. As the usage of `findByXPath` is same as `findAll`. (Just replace the CSS selector with XPath.)

## Signature of those methods

### The first parameter

The first parameter of `findAll` method is CSS selector while the first parameter of `findByXPath` is an XPath expression. So Rize will find elements according to the CSS selector or XPath expression you gave.

### The second parameter

The second parameter of those two methods is `index`. You must specify the index of the element you want in the array of elements.

### The third parameter

The third parameter of those two methods is a function. You can pass Rize APIs here, but not all APIs work.

That function must have no more than three parameters. If you have a function which has more than three parameters, please refactor it or write another function to wrap it. (Too many parameters in one function is not a good practice.)

Besides, the first parameter of that function must receive a string as a valid CSS selector.

### The rest parameters

All the rest parameters will be passes as arguments to the third parameter (which is a function).

## Examples

Here are some examples:

```javascript
const rize = new Rize()
rize.findAll('div', 0, rize.assertVisible)
rize.findAll('div', 1, rize.assertClassHas, 'my-class')
```

The example above are valid, because the method `assertVisible` and `assertClassHas` receive a string as CSS selector in their first parameter.

However, the example below are invalid:

```javascript
// Don't do like this!
const rize = new Rize()
rize.findAll('div', 0, rize.assertTitle)
```

Though the first parameter of `assertTitle` receive a string, it is not regarded as CSS selector.

As a matter of fact, you can pass a custom function not only Rize's APIs.

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

You may concern about what is the return value of `find`, `findAll` and `findByXPath` method. Honestly, it is determined by the function you passed as the third parameter.
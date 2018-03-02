# Testing

Many developers use puppeteer to execute automated UI tests. However puppeteer is just a software to control Chromium and it is impossible to provide some assertion methods.

Rize provides a lot of useful assertion methods for testing. Rize is just a library and it use Node.js' `assert` module so you can use Rize with any testing frameworks you like.

## Asserting page information

You may want to assert the URL of current page, so you can use [`assertUrlIs`](https://rize.js.org/api/classes/_index_.rize.html#asserturlis) method:

```javascript
rize.assertUrlIs('https://example.com/')
```

If you want to check the URL is matched a given regular expression, use [`assertUrlMatch`](https://rize.js.org/api/classes/_index_.rize.html#asserturlmatch) method:

```javascript
rize.assertUrlMatch(/^https?/)
```

Also, you can assert the query string. Just use [`assertQueryStringHas`](https://rize.js.org/api/classes/_index_.rize.html#assertquerystringhas) method:

```javascript
rize.assertQueryStringHas('key')
```

You may want to check the query string value and not just the key:

```javascript
rize.assertQueryStringHas('key', 'value')
```

The assertion above means check the value of `key` in query string. If the value does not equal to the value you gave, test will fail.

Even you can assert the query string misses a key:

```javascript
rize.assertQueryStringMissing('nope')
```

Additionally, if you want to assert cookies, you can use [`assertCookieHas`](https://rize.js.org/api/classes/_index_.rize.html#assertcookiehas) method.

## Asserting page content and elements

### Page

You can assert page title with [`assertTitle`](https://rize.js.org/api/classes/_index_.rize.html#asserttitle) method or [`assertTitleContains`](https://rize.js.org/api/classes/_index_.rize.html#asserttitlecontains) method.

```javascript
rize.assertTitle('page title')
```

```javascript
rize.assertTitleContains('title')
```

If you want to check if the page contains expected text, just use [`assertSee`](https://rize.js.org/api/classes/_index_.rize.html#assertsee) method.

```javascript
rize.assertSee('something')
```

You also can use [`assertSeeIn`](https://rize.js.org/api/classes/_index_.rize.html#assertseein) method to assert that expected text is in an element, and you just need to specify the selector of the element.

```javascript
rize.assertSeeIn('#greeting', 'Hello!')
```

You can use [`assertDontSee`](https://rize.js.org/api/classes/_index_.rize.html#assertdontsee) or [`assertDontSeeIn`](https://rize.js.org/api/classes/_index_.rize.html#assertdontseein) method to assert that expected text is not in the page or element.

### Elements

You can assert the state of an element:

```javascript
rize.assertElementPresent('div')
rize.assertElementMissing('div')
rize.assertElementVisible('div')
rize.assertElementHidden('div')
```

You can check if an element contains a class:

```javascript
rize.assertClassHas('#greeting', 'pull-right')
```

Or missing a class:

```javascript
rize.assertClassMissing('#greeting', 'pull-left')
```

You can assert the state of a checkbox, a radio button or a dropdown:

```javascript
rize.assertChecked('input[type=checkbox]')
rize.assertNotChecked('input[type=checkbox]')
rize.assertRadioSelected('input[type=radio]', 'south')
rize.assertRadioNotSelected('input[type=radio]', 'north')
```

And you can assert the value by using [`assertValueIs`](https://rize.js.org/api/classes/_index_.rize.html#assertvalueis) method or [`assertValueIsNot`](https://rize.js.org/api/classes/_index_.rize.html#assertvalueisnot) method.

## Full APIs

All the assertion APIs of Rize are listed [here](https://rize.js.org/api/classes/_index_.rize.html). Those methods are prefixed with `assert`.
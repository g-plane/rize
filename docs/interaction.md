# Interact With Page

It's easy to interact with page and elements by using Rize. 

All the examples below supposed that you have created a `Rize` instance and navigated to a valid page.

## Interact with elements

To interact with elements, you should provide a valid CSS selector which points to the element you want to interact.

### Click and hover

For example, we have a page like this:

```html
<button id="submit">
    Submit!
</button>
```

And we can click this button:

```javascript
rize.click('#submit')
```

Sometimes you may want to hover on it instead of clicking on it to see something happened, and you just need to call `hover` method:

```javascript
rize.hover('#submit')
```

Rize also provides [`rightClick`](https://rize.js.org/api/classes/_index_.rize.html#rightclick) method and [`doubleClick`](https://rize.js.org/api/classes/_index_.rize.html#doubleclick) method.

### Typing some text

Let's suppose we have a page like this:

```html
<input name="character" type="text" />
```

The way to typing some text on that `<input>` element is call [`type`](https://rize.js.org/api/classes/_index_.rize.html#type) method:

```javascript
rize.type('[name="character"]', 'Rize')
```

If you call `type` method again, it won't clear existing text and it will append the new text to element.

```javascript
rize.type('[name="character"]', ' Tedeza')

// Now the value of that element is "Rize Tedeza".
```

So you can call [`clear`](https://rize.js.org/api/classes/_index_.rize.html#clear) method to clear the text.

```javascript
rize.clear('[name="character"]')

// Nothing on that element now.
```

### Interact with forms

It is easy to [check](https://rize.js.org/api/classes/_index_.rize.html#check) or [uncheck](https://rize.js.org/api/classes/_index_.rize.html#uncheck) a checkbox:

```javascript
rize.check('input#item1[type="checkbox"]').uncheck('input#item2[type="checkbox"]')
```

Select a radio button:

```javascript
rize.radio('input#sex[type="radio"]', 'male')
```

The second argument of [`radio`](https://rize.js.org/api/classes/_index_.rize.html#radio) method is the value of the radio button you want to select.

Choose one or more items of dropdown:

```javascript
rize.select('select#food', 'vegetables')  // For single choice
rize.select('select#character', ['Rize', 'Syaro'])  // For multiple choices
```

Attaching a file to an `<input type="file" />` is also easy.

```javascript
rize.uploadFile('input[type="file"]', 'my-file.png')
```



## Working with keyboard

Rize provides three methods ([`press`](https://rize.js.org/api/classes/_index_.rize.html#press), [`keyDown`](https://rize.js.org/api/classes/_index_.rize.html#keydown) and [`keyUp`](https://rize.js.org/api/classes/_index_.rize.html#keyup)) to let you work with keyboard.

Just press a key:

```javascript
rize.press('Enter')
```

Or dispatch a `keydown` event or `keyup` event as you need:

```javascript
rize.keyDown('Enter')
rize.keyUp('Enter')
```

To check out all available keys, please visit https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js

## Working with mouse

You can use [`mouseMoveTo`](https://rize.js.org/api/classes/_index_.rize.html#mousemoveto) method to move mouse:

```javascript
rize.mouseMoveTo(50, 45)
```

Or click a mouse button:

```javascript
rize.mouseClick(1, 1)
rize.mouseClick(1, 1, { button: 'right' })
rize.mouseClick(1, 1, { clickCount: 2 })
rize.mouseClick(1, 1, { button: 'right', clickCount: 2 })
```

Even "down" a mouse button or "up" a mouse button:

```javascript
rize.mouseDown()             // Keep down "left" button once.
rize.mouseDown('middle')     // Keep down "middle" button once.
rize.mouseDown('right')      // Keep down "right" button once.
rize.mouseDown('left', 2)    // Keep down "left" button twice.
rize.mouseDown('right', 2)   // Keep down "right" button twice.
```

The usage of [`mouseUp`](https://rize.js.org/api/classes/_index_.rize.html#mouseup) method is same as the [`mouseDown`](https://rize.js.org/api/classes/_index_.rize.html#mousedown) method.
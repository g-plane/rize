# 交互

使用 Rize 您可以很简单地与页面和元素进行交互。

下面所有的例子都假设您已经创建 `Rize` 实例并访问到一个有效的页面。

## 与元素交互

如果要与元素交互，您必须提供指向您想要进行交互的元素的 CSS 选择器。

### 单击和鼠标悬浮

例如，我们有这样一个页面：

```html
<button id="submit">
    Submit!
</button>
```

我们可以单击那个按钮：

```javascript
rize.click('#submit')
```

有时候您可能想为了查看某些效果，把鼠标悬浮在其上方而不是单击它，那么您可以调用 `hover` 方法：

```javascript
rize.hover('#submit')
```

Rize 还提供 [`rightClick`](https://rize.js.org/api/classes/_index_.rize.html#rightclick) 方法和 [`doubleClick`](https://rize.js.org/api/classes/_index_.rize.html#doubleclick) 方法。

### 输入文本

假设我们有这样一个页面：

```html
<input name="character" type="text" />
```

利用 [`type`](https://rize.js.org/api/classes/_index_.rize.html#type) 方法我们可以向那个 `<input>` 元素中输入文本：

```javascript
rize.type('[name="character"]', 'Rize')
```

如果我们继续调用 `type` 方法，它不会清除已有的文本，只会在其后追回文本。

```javascript
rize.type('[name="character"]', ' Tedeza')

// 现在 input 元素的值为“Rize Tedeza”
```

您可以使用 [`clear`](https://rize.js.org/api/classes/_index_.rize.html#clear) 方法来清除文本：

```javascript
rize.clear('[name="character"]')

// input 元素上什么都没有啦
```

### 与表单交互

[check](https://rize.js.org/api/classes/_index_.rize.html#check)（选择） 或 [uncheck](https://rize.js.org/api/classes/_index_.rize.html#uncheck)（取消选择）一个复选框很简单：

```javascript
rize.check('input#item1[type="checkbox"]').uncheck('input#item2[type="checkbox"]')
```

选择一个单选按钮：

```javascript
rize.radio('input#sex[type="radio"]', 'male')
```

[`radio`](https://rize.js.org/api/classes/_index_.rize.html#radio) 方法的第二个参数是您想要选择的单选按钮的值（value）。

选择下拉菜单中的一个或多个选项：

```javascript
rize.select('select#food', 'vegetables')  // 单选
rize.select('select#character', ['Rize', 'Syaro'])  // 多选
```

往 `<input type="file" />` 是添加文件也很简单：

```javascript
rize.uploadFile('input[type="file"]', 'my-file.png')
```



## 使用键盘

Rize 提供了三个方法（[`press`](https://rize.js.org/api/classes/_index_.rize.html#press)， [`keyDown`](https://rize.js.org/api/classes/_index_.rize.html#keydown) 和 [`keyUp`](https://rize.js.org/api/classes/_index_.rize.html#keyup)）可以让您使用键盘。

按一个键：

```javascript
rize.press('Enter')
```

或者根据需要触发 `keydown` 事件或 `keyup` 事件：

```javascript
rize.keyDown('Enter')
rize.keyUp('Enter')
```

若要查看所有可用的按键，请前往 https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js

## 使用鼠标

您可以使用 [`mouseMoveTo`](https://rize.js.org/api/classes/_index_.rize.html#mousemoveto) 方法来移动鼠标：

```javascript
rize.mouseMoveTo(50, 45)
```

按某个鼠标按键：

```javascript
rize.mouseClick(1, 1)
rize.mouseClick(1, 1, { button: 'right' })
rize.mouseClick(1, 1, { clickCount: 2 })
rize.mouseClick(1, 1, { button: 'right', clickCount: 2 })
```

甚至按下或抬起某个鼠标按键：

```javascript
rize.mouseDown()             // 按下鼠标左键一次
rize.mouseDown('middle')     // 按下鼠标中键一次
rize.mouseDown('right')      // 按下鼠标右键一次
rize.mouseDown('left', 2)    // 按下鼠标左键两次
rize.mouseDown('right', 2)   // 按下鼠标右键两次
```

[`mouseUp`](https://rize.js.org/api/classes/_index_.rize.html#mouseup) 方法的用法与 [`mouseDown`](https://rize.js.org/api/classes/_index_.rize.html#mousedown) 方法相同。
import http from 'http'
import { getPortPromise as getPort } from 'portfinder'
import Rize from 'rize'

test('click on an element', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><button>not clicked</button></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(() => instance.page.evaluate(
      () => (
        document
          .querySelector('button')!
          .onclick = function () { this.textContent = 'clicked' }
      )
    ))
    .click('button')
    .execute(async () => {
      const text: string = await instance.page.evaluate(
        () => document.querySelector('button')!.textContent
      )
      expect(text).toBe('clicked')
      server.close()
    })
    .end()
}, process.env.CI ? 8000 : 5000)

test('double click on an element', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><button>not double clicked</button></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(() => instance.page.evaluate(
      () => (
        document
          .querySelector('button')!
          .ondblclick = function () { this.textContent = 'double clicked' }
      )
    ))
    .doubleClick('button')
    .execute(async () => {
      const text: string = await instance.page.evaluate(
        () => document.querySelector('button')!.textContent
      )
      expect(text).toBe('double clicked')
      server.close()
    })
    .end()
})

test('right click on an element', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><button>not right clicked</button></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(() => instance.page.evaluate(
      () => (
        document
          .querySelector('button')!
          .onmouseup = function (e) {
            if (e.button === 2) { this.textContent = 'right clicked' }
          }
      )
    ))
    .rightClick('button')
    .execute(async () => {
      const text: string = await instance.page.evaluate(
        () => document.querySelector('button')!.textContent
      )
      expect(text).toBe('right clicked')
      server.close()
    })
    .end()
})

test('click a link', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body>
        <a>click me</a>
        <script>
          document.querySelector('a').onclick = function () {
            this.textContent = 'clicked'
          }
        </script>
      </body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .clickLink('click me')
    .execute(async (browser, page) => {
      const text = await page.$eval(
        'a',
        element => element.textContent
      )
      expect(text).toBe('clicked')
      server.close()
    })
    .end()
})

test('hover on an element', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><button>not hovered</button></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(() => instance.page.evaluate(
      () => (
        document
          .querySelector('button')!
          .onmouseenter = function () { this.textContent = 'hovered' }
      )
    ))
    .hover('button')
    .execute(async () => {
      const text: string = await instance.page.evaluate(
        () => document.querySelector('button')!.textContent
      )
      expect(text).toBe('hovered')
      server.close()
    })
    .end()
})

test('type text to an element', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><input value="" /></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .type('input', 'rize')
    .execute(async () => {
      const text: string = await instance.page.evaluate(
        () => document.querySelector('input')!.value
      )
      expect(text).toBe('rize')
      server.close()
    })
    .end()
})

test('send character to an element', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html></html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(async (browser, page) => {
      await page.evaluate(() => {
        document.onkeypress = event => {
          document.body.textContent = event.key
        }
      })
    })
    .sendChar('リ')
    .execute(async () => {
      const text: string = await instance.page.evaluate(
        () => document.body.textContent
      )
      expect(text).toBe('リ')
      server.close()
    })
    .end()
})

test('clear text on an element', async () => {
  expect.assertions(3)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body>
        <input value="rize" />
        <textarea>rize</textarea>
        <div>rize</div>
      </body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .clear('input')
    .clear('textarea')
    .clear('div')  // Should no errors threw.
    .execute(async () => {
      const input: string = await instance.page.$eval(
        'input',
        element => (element as HTMLInputElement).value
      )
      expect(input).toBe('')
      const textarea: string = await instance.page.$eval(
        'textarea',
        element => element.textContent
      )
      expect(textarea).toBe('')
      const div: string = await instance.page.$eval(
        'div',
        element => element.textContent
      )
      expect(div).toBe('rize')  // Text should not be modified.
      server.close()
    })
    .end()
})

test('focus on an element', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><button>not focused</button></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(() => instance.page.evaluate(
      () => (
        document
          .querySelector('button')!
          .onfocus = function () { this.textContent = 'focused' }
      )
    ))
    .focus('button')
    .execute(async () => {
      const text: string = await instance.page.evaluate(
        () => document.querySelector('button')!.textContent
      )
      expect(text).toBe('focused')
      server.close()
    })
    .end()
})

test('select values on an element', async () => {
  expect.assertions(2)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body>
        <select id="single">
          <option>rize</option>
          <option selected>syaro</option>
        </select>
        <select multiple="multiple" id="multiple">
          <option>rize</option>
          <option>chino</option>
          <option>cocoa</option>
        </select>
      </body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .select('#single', 'rize')
    .execute(async () => {
      const selectedIndex: number = await instance.page.evaluate(
        () =>
          document.querySelector<HTMLSelectElement>('#single')!.selectedIndex
      )
      expect(selectedIndex).toBe(0)
    })
    .select('#multiple', ['chino', 'rize'])
    .execute(async () => {
      const selected = await instance.page.evaluate(
        () => {
          const first: HTMLOptionElement = document
            .querySelector<HTMLSelectElement>('#multiple')!.item(0)
          const second: HTMLOptionElement = document
            .querySelector<HTMLSelectElement>('#multiple')!.item(1)
          const third: HTMLOptionElement = document
            .querySelector<HTMLSelectElement>('#multiple')!.item(2)
          return [first.selected, second.selected, third.selected]
        }
      )
      expect(selected).toEqual([true, true, false])
      server.close()
    })
    .end()
})

test('check a checkbox', async () => {
  expect.assertions(2)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><input type="checkbox" /></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(async (browser, page) => {
      const checked = await page.$eval(
        'input',
        element => (element as HTMLInputElement).checked
      )
      expect(checked).toBe(false)
    })
    .check('input')
    .execute(async (browser, page) => {
      const checked = await page.$eval(
        'input',
        element => (element as HTMLInputElement).checked
      )
      expect(checked).toBe(true)
      server.close()
    })
    .end()
})

test('uncheck a checkbox', async () => {
  expect.assertions(2)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><input type="checkbox" checked /></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(async (browser, page) => {
      const checked = await page.$eval(
        'input',
        element => (element as HTMLInputElement).checked
      )
      expect(checked).toBe(true)
    })
    .uncheck('input')
    .execute(async (browser, page) => {
      const checked = await page.$eval(
        'input',
        element => (element as HTMLInputElement).checked
      )
      expect(checked).toBe(false)
      server.close()
    })
    .end()
})

test('check a radio', async () => {
  expect.assertions(2)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><input type="radio" value="val" /></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(async (browser, page) => {
      const checked = await page.$eval(
        'input',
        element => (element as HTMLInputElement).checked
      )
      expect(checked).toBe(false)
    })
    .radio('input', 'val')
    .execute(async (browser, page) => {
      const checked = await page.$eval(
        'input',
        element => (element as HTMLInputElement).checked
      )
      expect(checked).toBe(true)
      server.close()
    })
    .end()
})

test('press a key on an element', async () => {
  expect.assertions(2)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <div>not pressed</div>
      <body><button>not pressed</button></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(() => instance.page.evaluate(
      () => {
        document.body.onkeypress = function (event) {
          if (event.key === 'a') {
            this.querySelector('div')!.textContent = 'pressed `a`'
          }
        }
        document
          .querySelector('button')!
          .onkeypress = function (event) {
            event.stopPropagation()
            if (event.key === 'b') {
              this.textContent = 'pressed `b`'
            }
          }
      }
    ))
    .press('a')
    .execute(async () => {
      const divText: string = await instance.page.evaluate(
        () => document.querySelector('div')!.textContent
      )
      expect(divText).toBe('pressed `a`')
    })
    .press('b', 'button')
    .execute(async () => {
      const buttonText: string = await instance.page.evaluate(
        () => document.querySelector('button')!.textContent
      )
      expect(buttonText).toBe('pressed `b`')
      server.close()
    })
    .end()
})

test('key down on an element', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(() => instance.page.evaluate(
      () => {
        document.body.onkeydown = function (event) {
            if (event.key === 'a') {
              this.textContent = 'key down'
            }
          }
      }
    ))
    .keyDown('a')
    .execute(async () => {
      const text: string = await instance.page.$eval(
        'body',
        element => element.textContent
      )
      expect(text).toBe('key down')
      server.close()
    })
    .end()
})

test('key up on an element', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(() => instance.page.evaluate(
      () => {
        document.body.onkeyup = function (event) {
            if (event.key === 'a') {
              this.textContent = 'key up'
            }
          }
      }
    ))
    .keyUp('a')
    .execute(async () => {
      const text: string = await instance.page.$eval(
        'body',
        element => element.textContent
      )
      expect(text).toBe('key up')
      server.close()
    })
    .end()
})

test('move mouse', async () => {
  expect.assertions(1)
  const instance = new Rize()
  await instance
    .execute(() => {
      jest.spyOn(instance.page.mouse, 'move')
    })
    .mouseMoveTo(1, 1)
    .execute(() => {
      expect(instance.page.mouse.move).toBeCalledWith(1, 1)
    })
    .end()
})

test('click mouse button', async () => {
  expect.assertions(1)
  const instance = new Rize()
  await instance
    .execute(() => {
      jest.spyOn(instance.page.mouse, 'click')
    })
    .mouseClick(1, 1, { clickCount: 1 })
    .execute(() => {
      expect(instance.page.mouse.click).toBeCalledWith(1, 1, { clickCount: 1 })
    })
    .end()
})

test('mouse button down', async () => {
  expect.assertions(2)
  const instance = new Rize()
  await instance
    .execute(() => {
      jest.spyOn(instance.page.mouse, 'down')
    })
    .mouseDown()
    .execute(() => {
      expect(instance.page.mouse.down)
        .toBeCalledWith({ button: 'left', clickCount: 1 })
    })
    .mouseDown('middle', 2)
    .execute(() => {
      expect(instance.page.mouse.down)
        .toBeCalledWith({ button: 'middle', clickCount: 2 })
    })
    .end()
})

test('mouse button up', async () => {
  expect.assertions(2)
  const instance = new Rize()
  await instance
    .execute(() => {
      jest.spyOn(instance.page.mouse, 'up')
    })
    .mouseUp()
    .execute(() => {
      expect(instance.page.mouse.up)
        .toBeCalledWith({ button: 'left', clickCount: 1 })
    })
    .mouseUp('middle', 2)
    .execute(() => {
      expect(instance.page.mouse.up)
        .toBeCalledWith({ button: 'middle', clickCount: 2 })
    })
    .end()
})

test('upload file', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><input type="file" /></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .uploadFile('input', 'file')
    .execute(async () => {
      server.close()
    })
    .end()
})

test('add class', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body></body></html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .addClass('body', 'rize')
    .execute(async (browser, page) => {
      const exists = await page.evaluate(
        () => document.body.classList.contains('rize')
      )
      expect(exists).toBe(true)
      server.close()
    })
    .end()
})

test('remove class', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body class="rize"></body></html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .removeClass('body', 'rize')
    .execute(async (browser, page) => {
      const exists = await page.evaluate(
        () => document.body.classList.contains('rize')
      )
      expect(exists).toBe(false)
      server.close()
    })
    .end()
})

test('toggle class', async () => {
  expect.assertions(2)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body></body></html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .toggleClass('body', 'rize')
    .execute(async (browser, page) => {
      const exists = await page.evaluate(
        () => document.body.classList.contains('rize')
      )
      expect(exists).toBe(true)
    })
    .toggleClass('body', 'rize')
    .execute(async (browser, page) => {
      const exists = await page.evaluate(
        () => document.body.classList.contains('rize')
      )
      expect(exists).toBe(false)
      server.close()
    })
    .end()
})

test('set cookies', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end('')).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .setCookie(
      { name: 'name1', value: 'value1' },
      { name: 'name2', value: 'value2' }
    )
    .execute(async (browser, page) => {
      await expect(page.cookies()).resolves.toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'name1', value: 'value1' }),
        expect.objectContaining({ name: 'name2', value: 'value2' })
      ]))
      server.close()
    })
    .end()
})

test('delete cookies', async () => {
  expect.assertions(1)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end('')).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .execute(async (browser, page) => {
      await page.setCookie(
        { name: 'name1', value: 'value1' },
        { name: 'name2', value: 'value2' }
      )
    })
    .deleteCookie({ name: 'name1' }, { name: 'name2' })
    .execute(async (browser, page) => {
      await expect(page.cookies()).resolves.toHaveLength(0)
      server.close()
    })
    .end()
})

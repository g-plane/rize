import assert from 'assert'
import http from 'http'
import puppeteer from 'puppeteer'
import { getPortPromise as getPort } from 'portfinder'
import Rize from '../../src'

test('assert url', async () => {
  const instance = new Rize()
  await instance
    .assertUrlIs('about:blank')
    .end()
}, process.env.CI ? 8000 : 5000)

test('assert url matches a regular expression', async () => {
  const instance = new Rize()
  await instance
    .assertUrlMatch('^about')
    .assertUrlMatch(/blank$/)
    .end()
})

test('assert url path', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/rabbit-house/rize`)
    .assertPathIs('/rabbit-house/rize')
    .execute(() => server.close())
    .end()
})

test('assert url path starts with a specified string', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/rabbit-house/rize`)
    .assertPathBeginsWith('/rabbit-house')
    .execute(() => server.close())
    .end()
})

test('assert url hash', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/#rize`)
    .assertHashIs('rize')
    .assertHashIs('#rize')
    .execute(() => server.close())
    .end()
})

test('assert url hash begins with a specified string', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/#rabbit-house`)
    .assertHashBeginsWith('rabbit')
    .assertHashBeginsWith('#rabbit')
    .execute(() => server.close())
    .end()
})

test('assert title', async () => {
  const instance = new Rize()
  await instance
    .execute(() => instance.page.evaluate(() => document.title = 'testing'))
    .assertTitle('testing')
    .end()
})

test('assert title contains a string', async () => {
  const instance = new Rize()
  await instance
    .execute(() => instance.page.evaluate(() => document.title = 'testing'))
    .assertTitleContains('test')
    .end()
})

test('assert title matches a regular expression', async () => {
  const instance = new Rize()
  await instance
    .execute(() => instance.page.evaluate(() => document.title = 'testing'))
    .assertTitleMatch('^te')
    .assertTitleMatch(/ing$/)
    .end()
})

test('assert query string has key and value', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/?key=value`)
    .assertQueryStringHas('key')
    .assertQueryStringHas('key', 'value')
    .execute(() => server.close())
    .end()
})

test('assert query string does not have a key', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/?key=value`)
    .assertQueryStringMissing('missing')
    .execute(() => server.close())
    .end()
})

test('assert has cookie', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/?key=value`)
    .execute(async () => await instance.page.setCookie({
      name: 'name',
      value: 'value'
    }))
    .assertCookieHas('name')
    .assertCookieHas('name', 'value')
    .execute(() => server.close())
    .end()
})

test('see some text in page', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><script>document.write(1 + 1)</script></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertSee('2')
    .execute(() => server.close())
    .end()
})

test('do not see some text in page', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><script>document.write(1 + 1)</script></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertDontSee('4')
    .execute(() => server.close())
    .end()
})

test('see some text in an element', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div>rize</div></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertSeeIn('div', 'rize')
    .execute(() => server.close())
    .end()
})

test('do not see some text in an element', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div>rize</div></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
   await instance
    .goto(`http://localhost:${port}/`)
    .assertDontSeeIn('div', 'cocoa')
    .execute(() => server.close())
    .end()
})

test('assert attribute of an element', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div class="rabbit-house">rize</div></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertAttribute('div', 'class', 'rabbit-house')
    .execute(() => server.close())
    .end()
})

test('assert an element has a class', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div class="rabbit-house">rize</div></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertClassHas('div', 'rabbit-house')
    .execute(() => server.close())
    .end()
})

test('assert an element do not have a class', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div class="rabbit-house">rize</div></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertClassMissing('div', 'rabbit')
    .execute(() => server.close())
    .end()
})

test('assert style of an element', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div style="font-size: 5px">rize</div></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertStyleHas('div', 'font-size', '5px')
    .execute(() => server.close())
    .end()
})

test('assert value is', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><input value="rize" /></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertValueIs('input', 'rize')
    .execute(() => server.close())
    .end()
})

test('assert value is not', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><input value="rize" /></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertValueIsNot('input', 'chino')
    .execute(() => server.close())
    .end()
})

test('assert value contains', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><input value="rabbit-house" /></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertValueContains('input', 'rabbit')
    .execute(() => server.close())
    .end()
})

test('assert checkbox checked', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><input type="checkbox" checked /></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertChecked('input')
    .execute(() => server.close())
    .end()
})

test('assert checkbox not checked', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><input type="checkbox" /></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertNotChecked('input')
    .execute(() => server.close())
    .end()
})

test('assert radio button selected', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body>
        <input type="radio" name="rabbit-house" value="chino" />
        <input type="radio" name="rabbit-house" value="cocoa" />
        <input type="radio" name="rabbit-house" value="rize" checked />
      </body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertRadioSelected('[name="rabbit-house"]', 'rize')
    .execute(() => server.close())
    .end()
})

test('assert radio button not selected', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body>
        <input type="radio" name="rabbit-house" value="chino" />
        <input type="radio" name="rabbit-house" value="cocoa" />
        <input type="radio" name="rabbit-house" value="rize" checked />
      </body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertRadioNotSelected('[name="rabbit-house"]', 'chino')
    .execute(() => server.close())
    .end()
})

test('assert option selected', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body>
        <select>
          <option value="chino" />
          <option value="cocoa" />
          <option value="rize" selected />
        </select>
      </body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertSelected('select', 'rize')
    .execute(() => server.close())
    .end()
})

test('assert option not selected', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body>
        <select>
          <option value="chino" />
          <option value="cocoa" />
          <option value="rize" selected />
        </select>
      </body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertNotSelected('select', 'cocoa')
    .execute(() => server.close())
    .end()
})

test('assert element is visible', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div></div></body></html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertElementVisible('div')
    .execute(() => server.close())
    .end()
})

test('assert element is hidden', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div style="display: none"></div></body></html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertElementHidden('div')
    .execute(() => server.close())
    .end()
})

test('assert element is present', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div style="display: none"></div></body></html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertElementPresent('div')
    .execute(() => server.close())
    .end()
})

test('assert element is missing', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div style="display: none"></div></body></html>
  `)).listen(port)
  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}/`)
    .assertElementMissing('span')
    .execute(() => server.close())
    .end()
})

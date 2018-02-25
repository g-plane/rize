import assert from 'assert'
import http from 'http'
import puppeteer from 'puppeteer'
import { getPortPromise as getPort } from 'portfinder'
import Rize from '../src'

test('assert url', done => {
  const instance = new Rize()
  instance
    .assertUrlIs('about:blank')
    .end(done)
}, process.env.CI ? 8000 : 5000)

test('assert url path', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/rabbit-house/rize`)
    .assertPathIs('/rabbit-house/rize')
    .execute(() => server.close())
    .end(done)
})

test('assert url path starts with a specified string', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/rabbit-house/rize`)
    .assertPathBeginsWith('/rabbit-house')
    .execute(() => server.close())
    .end(done)
})

test('assert title', done => {
  const instance = new Rize()
  instance
    .execute(() => instance.page.evaluate(() => document.title = 'testing'))
    .assertTitle('testing')
    .end(done)
})

test('assert title contains a string', done => {
  const instance = new Rize()
  instance
    .execute(() => instance.page.evaluate(() => document.title = 'testing'))
    .assertTitleContains('test')
    .end(done)
})

test('assert query string has key and value', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/?key=value`)
    .assertQueryStringHas('key')
    .assertQueryStringHas('key', 'value')
    .execute(() => server.close())
    .end(done)
})

test('assert query string does not have a key', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/?key=value`)
    .assertQueryStringMissing('missing')
    .execute(() => server.close())
    .end(done)
})

test('assert has cookies', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end()).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/?key=value`)
    .execute(async () => await instance.page.setCookie({
      name: 'name',
      value: 'value'
    }))
    .assertCookiesHas('name')
    .assertCookiesHas('name', 'value')
    .execute(() => server.close())
    .end(done)
})

test('see some text in page', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><script>document.write(1 + 1)</script></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/`)
    .assertSee('2')
    .execute(() => server.close())
    .end(done)
})

test('see some text in an element', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div>rize</div></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/`)
    .assertSeeIn('div', 'rize')
    .execute(() => server.close())
    .end(done)
})

test('assert attribute of an element', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div class="rabbit-house">rize</div></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/`)
    .assertAttribute('div', 'class', 'rabbit-house')
    .execute(() => server.close())
    .end(done)
})

test('assert an element has a class', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div class="rabbit-house">rize</div></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/`)
    .assertClassHas('div', 'rabbit-house')
    .execute(() => server.close())
    .end(done)
})

test('assert style of an element', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div style="font-size: 5px">rize</div></body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/`)
    .assertStyleHas('div', 'font-size', '5px')
    .execute(() => server.close())
    .end(done)
})

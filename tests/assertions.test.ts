import assert from 'assert'
import http from 'http'
import puppeteer from 'puppeteer'
import Rize from '../src'

test('assert url', done => {
  const instance = new Rize()
  instance
    .assertUrlIs('about:blank')
    .end(done)
}, process.env.CI ? 8000 : 5000)

test('assert url path', done => {
  const server = http.createServer((req, res) => res.end()).listen(2333)
  const instance = new Rize()
  instance
    .goto('http://localhost:2333/rabbit-house/rize')
    .assertPathIs('/rabbit-house/rize')
    .execute(() => server.close())
    .end(done)
})

test('assert url path starts with a specified string', done => {
  const server = http.createServer((req, res) => res.end()).listen(2333)
  const instance = new Rize()
  instance
    .goto('http://localhost:2333/rabbit-house/rize')
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

test('assert query string has key and value', done => {
  const server = http.createServer((req, res) => res.end()).listen(2333)
  const instance = new Rize()
  instance
    .goto('http://localhost:2333/?key=value')
    .assertQueryStringHas('key')
    .assertQueryStringHas('key', 'value')
    .execute(() => server.close())
    .end(done)
})

test('assert query string does not have a key', done => {
  const server = http.createServer((req, res) => res.end()).listen(2333)
  const instance = new Rize()
  instance
    .goto('http://localhost:2333/?key=value')
    .assertQueryStringMissing('missing')
    .execute(() => server.close())
    .end(done)
})

test('assert has cookies', done => {
  const server = http.createServer((req, res) => res.end()).listen(2333)
  const instance = new Rize()
  instance
    .goto('http://localhost:2333/?key=value')
    .execute(async () => await instance.page.setCookie({
      name: 'name',
      value: 'value'
    }))
    .assertCookiesHas('name')
    .assertCookiesHas('name', 'value')
    .execute(() => server.close())
    .end(done)
})

test('see some text in page', done => {
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><script>document.write(1 + 1)</script></body>
    </html>
  `)).listen(2333)
  const instance = new Rize()
  instance
    .goto('http://localhost:2333/')
    .assertSee('2')
    .execute(() => server.close())
    .end(done)
})

test('see some text in an element', done => {
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div>rize</div></body>
    </html>
  `)).listen(2333)
  const instance = new Rize()
  instance
    .goto('http://localhost:2333/')
    .assertSeeIn('div', 'rize')
    .execute(() => server.close())
    .end(done)
})

test('assert attribute of an element', done => {
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div class="rabbit-house">rize</div></body>
    </html>
  `)).listen(2333)
  const instance = new Rize()
  instance
    .goto('http://localhost:2333/')
    .assertAttribute('div', 'class', 'rabbit-house')
    .execute(() => server.close())
    .end(done)
})

test('assert an element has a class', done => {
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div class="rabbit-house">rize</div></body>
    </html>
  `)).listen(2333)
  const instance = new Rize()
  instance
    .goto('http://localhost:2333/')
    .assertHasClass('div', 'rabbit-house')
    .execute(() => server.close())
    .end(done)
})

test('assert style of an element', done => {
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body><div style="font-size: 5px">rize</div></body>
    </html>
  `)).listen(2333)
  const instance = new Rize()
  instance
    .goto('http://localhost:2333/')
    .assertHasStyle('div', 'font-size', '5px')
    .assertHasStyle('div', 'fontSize', '5px')
    .execute(() => server.close())
    .end(done)
})

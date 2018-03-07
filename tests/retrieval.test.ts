import http from 'http'
import puppeteer from 'puppeteer'
import { getPortPromise as getPort } from 'portfinder'
import Rize from '../src'

test('retrieve title', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><title>rize</title></html>
  `)).listen(port)
  const instance = new Rize()
  instance.goto(`http://localhost:${port}/`)
  await expect(instance.title()).resolves.toBe('rize')
  instance.execute(() => {
    jest
      .spyOn(instance.page, 'title')
      .mockReturnValue(Promise.reject(new Error()))
    server.close()
  })
  await expect(instance.title()).rejects.toThrowError()
  instance.end(done)
})

test('retrieve text', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div>rize</div></body></html>
  `)).listen(port)
  const instance = new Rize()
  instance.goto(`http://localhost:${port}/`)
  await expect(instance.text()).resolves.toBe('rize\n  ')
  await expect(instance.text('div')).resolves.toBe('rize')
  await expect(instance.text('span')).rejects.toThrowError()
  server.close()
  instance.end(done)
})

test('retrieve html', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div>rize</div></body></html>
  `)).listen(port)
  const instance = new Rize()
  instance.goto(`http://localhost:${port}/`)
  await expect(instance.html()).resolves.toBe(
    '<head></head><body><div>rize</div>\n  </body>'
  )
  await expect(instance.html('body')).resolves.toBe('<div>rize</div>\n  ')
  await expect(instance.html('span')).rejects.toThrowError()
  server.close()
  instance.end(done)
})

test('retrieve attribute', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div class="rize"></div></body></html>
  `)).listen(port)
  const instance = new Rize()
  instance.goto(`http://localhost:${port}/`)
  await expect(instance.attribute('div', 'class')).resolves.toBe('rize')
  await expect(instance.attribute('div', 'style')).resolves.toBe(null)
  await expect(instance.attribute('span', 'class')).rejects.toThrowError()
  server.close()
  instance.end(done)
})

test('retrieve style', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div style="font-size: 5px"></div></body></html>
  `)).listen(port)
  const instance = new Rize()
  instance.goto(`http://localhost:${port}/`)
  await expect(instance.style('div', 'font-size')).resolves.toBe('5px')
  await expect(instance.style('span', 'class')).rejects.toThrowError()
  server.close()
  instance.end(done)
})

test('retrieve value', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><input value="rize" /></body></html>
  `)).listen(port)
  const instance = new Rize()
  instance.goto(`http://localhost:${port}/`)
  await expect(instance.value('input')).resolves.toBe('rize')
  await expect(instance.value('span')).rejects.toThrowError()
  instance
    .value('input', 'rabbit-house')
    .execute(async (browser, page) => {
      const value: string = await page.evaluate(
        () => document.querySelector('input').value
      )
      expect(value).toBe('rabbit-house')
      server.close()
    })
    .end(done)
})

test('retrieve if an element has a class', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div class="rize"></div></body></html>
  `)).listen(port)
  const instance = new Rize()
  instance.goto(`http://localhost:${port}/`)
  await expect(instance.hasClass('div', 'rize')).resolves.toBe(true)
  await expect(instance.hasClass('div', 'chino')).resolves.toBe(false)
  await expect(instance.hasClass('span', 'class')).rejects.toThrowError()
  server.close()
  instance.end(done)
})

test('retrieve url', async done => {
  const instance = new Rize()
  await expect(instance.url()).resolves.toBe('about:blank')
  instance.end(done)
})

test('retrieve query string', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end('')).listen(port)
  const instance = new Rize()
  instance.goto(`http://localhost:${port}/?key1=value1&key2=abc&key2=123`)
  await expect(instance.queryString('key1')).resolves.toBe('value1')
  await expect(instance.queryString('key2')).resolves.toEqual(['abc', '123'])
  await expect(instance.queryString('key3')).resolves.toBeUndefined()
  server.close()
  instance.end(done)
})

test('retrieve cookie', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end('')).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/`)
    .execute(
      (browser, page) => page.setCookie({ name: 'name', value: 'value' })
    )
  await expect(instance.cookie())
    .resolves
    .toMatchObject({ name: 'name', value: 'value' })
  instance.execute(() => jest
    .spyOn(instance.page, 'cookies')
    .mockReturnValue(Promise.reject(new Error())))
  await expect(instance.cookie()).rejects.toThrowError()
  server.close()
  instance.end(done)
})

test('retrieve cookies', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end('')).listen(port)
  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}/`)
    .execute(
      (browser, page) => page.setCookie(
        { name: 'name1', value: 'value1' },
        { name: 'name2', value: 'value2' }
      )
    )
  await expect(instance.cookies()).resolves.toEqual(expect.arrayContaining([
    expect.objectContaining({ name: 'name2', value: 'value2' }),
    expect.objectContaining({ name: 'name1', value: 'value1' })
  ]))
  instance.execute(() => jest
    .spyOn(instance.page, 'cookies')
    .mockReturnValue(Promise.reject(new Error())))
  await expect(instance.cookies()).rejects.toThrowError()
  server.close()
  instance.end(done)
})

test('retrieve if an element is visible', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div style="display: none"></div><p></p></body></html>
  `)).listen(port)
  const instance = new Rize()
  instance.goto(`http://localhost:${port}/`)
  await expect(instance.isVisible('p')).resolves.toBe(true)
  await expect(instance.isVisible('div')).resolves.toBe(false)
  await expect(instance.isVisible('span')).rejects.toThrowError()
  server.close()
  instance.end(done)
})

test('retrieve if an element is present', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div style="display: none"></div></body></html>
  `)).listen(port)
  const instance = new Rize()
  instance.goto(`http://localhost:${port}/`)
  await expect(instance.isPresent('div')).resolves.toBe(true)
  await expect(instance.isPresent('span')).resolves.toBe(false)
  instance.execute(() => {
    jest.spyOn(instance.page, 'evaluate').mockImplementation(
      () => Promise.reject(new Error())
    )
  })
  await expect(instance.isPresent('div')).rejects.toThrowError()
  server.close()
  instance.end(done)
})

test('find an element by CSS selector', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><body><div style="font-size: 5px">rize</div></body></html>
  `)).listen(port)
  const instance = new Rize()
  const text = await instance.goto(`http://localhost:${port}/`)
    .find('div', instance.text)
  expect(text).toBe('rize')
  await expect(
    instance.find('div', instance.style, 'font-size')
  ).resolves.toBe('5px')
  server.close()
  instance.end(done)
})

test('find elements with index by CSS selector', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body>
        <div style="font-size: 5px">syaro</div>
        <div>rize</div>
      </body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  const text = await instance.goto(`http://localhost:${port}/`)
    .findAll('div', 1, instance.text)
  expect(text).toBe('rize')
  await expect(
    instance.findAll('div', 0, instance.style, 'font-size')
  ).resolves.toBe('5px')
  server.close()
  instance.end(done)
})

test('find elements with index by XPath', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body>
        <div style="font-size: 5px">syaro</div>
        <div>rize</div>
      </body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  const text = await instance.goto(`http://localhost:${port}/`)
    .findByXPath('/html/body//div', 1, instance.text)
  expect(text).toBe('rize')
  await expect(
    instance.findByXPath('/html/body//div', 0, instance.style, 'font-size')
  ).resolves.toBe('5px')
  server.close()
  instance.end(done)
})

test('find elements with text', async done => {
  expect.assertions(2)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html>
      <body>
        <div class="syaro">syaro</div>
        <div class="rize" style="font-size: 5px">rize</div>
      </body>
    </html>
  `)).listen(port)
  const instance = new Rize()
  const hasClass = await instance.goto(`http://localhost:${port}/`)
    .findWithText('div', 'rize', 0, instance.hasClass, 'rize')
  expect(hasClass).toBe(true)
  await expect(
    instance.findWithText('div', 'rize', 0, instance.style, 'font-size')
  ).resolves.toBe('5px')
  server.close()
  instance.end(done)
})

test('retrieval viewport info', async done => {
  const instance = new Rize()
  await expect(instance.viewport()).resolves.toEqual(
    expect.objectContaining({ width: 1280, height: 720 })
  )
  instance.end(done)
})

import puppeteer from 'puppeteer'
import http from 'http'
import { getPortPromise as getPort } from 'portfinder'
import Rize from '../src'

test('go to a specified url', done => {
  expect.assertions(1)
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'goto').mockImplementation(() => true)
    }
  })
  instance
    .goto('url')
    .execute(() => {
      expect(instance.page.goto).toBeCalledWith('url')
    })
    .end(done)
}, process.env.CI ? 8000 : 5000)

test('open a new page', async done => {
  expect.assertions(7)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end('')).listen(port)
  const instance = new Rize()
  instance
    .newPage()
    .execute(
      async browser => await expect(browser.pages()).resolves.toHaveLength(3)
    )
    .goto(`http://localhost:${port}/`)
    .newPage()
    .execute(
      (browser, page) => expect(page.url()).toBe(`http://localhost:${port}/`)
    )
    .execute(
      async browser => await expect(browser.pages()).resolves.toHaveLength(3)
    )
    .newPage('', { force: true })
    .execute(async (browser, page) => {
      await expect(browser.pages()).resolves.toHaveLength(3)
      expect(page.url()).toBe('about:blank')
    })
    .goto(`http://localhost:${port}/`)
    .newPage('another page', { stayCurrent: true })
    .execute(async (browser, page) => {
      await expect(browser.pages()).resolves.toHaveLength(4)
      expect(page.url()).toBe(`http://localhost:${port}/`)
      server.close()
    })
    .end(done)
})

test('switch page', async done => {
  expect.assertions(2)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end('')).listen(port)
  const instance = new Rize()
  instance
    .newPage('page1')
    .goto(`http://localhost:${port}/page1`)
    .switchPage(0)
    .execute(
      (browser, page) => expect(page.url()).toBe('about:blank')
    )
    .switchPage('page1')
    .execute((browser, page) => {
      expect(page.url()).toBe(`http://localhost:${port}/page1`)
      server.close()
    })
    .end(done)
})

test('close page', done => {
  expect.assertions(2)
  const instance = new Rize()
  instance
    .closePage()
    .execute(async () => {
      await expect(instance.browser.pages()).resolves.toHaveLength(1)
    })
    .newPage('page1')
    .closePage('nope')  // Should not throw any errors
    .closePage('page1')
    .execute(async () => {
      await expect(instance.browser.pages()).resolves.toHaveLength(1)
    })
    .newPage('page2')
    .newPage('page3')
    .closePage('page2')
    .end(done)
})

test('count pages', async done => {
  const instance = new Rize()
  instance.newPage()
  await expect(instance.pagesCount()).resolves.toBe(2)
  instance.end(done)
})

test('go forward', done => {
  expect.assertions(2)
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'goForward').mockImplementation(() => true)
    }
  })
  instance
    .forward()
    .execute(() => {
      expect(instance.page.goForward).toBeCalled()
    })
    .forward({ timeout: 1 })
    .execute(() => {
      expect(
        (instance.page.goForward as ((
          options?: puppeteer.NavigationOptions
        ) => Promise<puppeteer.Response>) &
          jest.MockInstance<any>).mock.calls[1][0]
      ).toEqual({ timeout: 1 })
    })
    .end(done)
})

test('go back', done => {
  expect.assertions(2)
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'goBack').mockImplementation(() => true)
    }
  })
  instance
    .back()
    .execute(() => {
      expect(instance.page.goBack).toBeCalled()
    })
    .back({ timeout: 1 })
    .execute(() => {
      expect(
        (instance.page.goBack as ((
          options?: puppeteer.NavigationOptions
        ) => Promise<puppeteer.Response>) &
          jest.MockInstance<any>).mock.calls[1][0]
      ).toEqual({ timeout: 1 })
    })
    .end(done)
})

test('refresh page', done => {
  expect.assertions(2)
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'reload').mockImplementation(() => true)
    }
  })
  instance
    .refresh()
    .execute(() => {
      expect(instance.page.reload).toBeCalled()
    })
    .refresh({ timeout: 1 })
    .execute(() => {
      expect(
        (instance.page.reload as ((
          options?: puppeteer.NavigationOptions
        ) => Promise<puppeteer.Response>) &
          jest.MockInstance<any>).mock.calls[1][0]
      ).toEqual({ timeout: 1 })
    })
    .end(done)
})

test('evaluate a function', done => {
  expect.assertions(3)
  const instance = new Rize()
  instance
    .evaluate(text => document.write(`<div>${text}</div>`), 'rize')
    .execute(async (browser, page) => {
      const text: string = await page.evaluate(
        () => document.querySelector('div').textContent
      )
      expect(text).toBe('rize')
    })
    .evaluate(
      () => (document.querySelector('div').textContent = 'syaro'),
      undefined
    )
    .execute(async (browser, page) => {
      const text: string = await page.evaluate(
        () => document.querySelector('div').textContent
      )
      expect(text).toBe('syaro')
    })
    .evaluate('document.querySelector("div").textContent = "maya"')
    .execute(async (browser, page) => {
      const text: string = await page.evaluate(
        () => document.querySelector('div').textContent
      )
      expect(text).toBe('maya')
    })
    .end(done)
})

test('evaluate a funtion and retrieve return value', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <html><head><title>rize</title></head></html>
  `)).listen(port)
  const instance = new Rize()
  instance.goto(`http://localhost:${port}/`)
  await expect(instance.evaluateWithReturn(() => document.title))
    .resolves.toBe('rize')
  await expect(instance.evaluateWithReturn('document.title'))
    .resolves.toBe('rize')
  instance
    .execute(() => server.close())
    .end(done)
})

test('use user agent', done => {
  expect.assertions(1)
  const instance = new Rize()
  instance
    .withUserAgent('Chrome')
    .execute(async () => {
      const ua = await instance.page.evaluate(() => navigator.userAgent)
      expect(ua).toBe('Chrome')
    })
    .end(done)
})

test('generate a screenshot', done => {
  expect.assertions(2)
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'screenshot').mockImplementation(() => true)
    }
  })
  instance
    .saveScreenshot('file1')
    .execute(() => {
      expect(instance.page.screenshot).toBeCalledWith({ path: 'file1' })
    })
    .saveScreenshot('file2', { type: 'jpeg' })
    .execute(() => {
      expect(instance.page.screenshot as (typeof instance.page.screenshot) &
        jest.MockInstance<any>).toBeCalledWith({ path: 'file2', type: 'jpeg' })
    })
    .end(done)
})

test('generate a PDF', done => {
  expect.assertions(2)
  const instance = new Rize({
    afterLaunched () {
      jest.spyOn(instance.page, 'pdf').mockImplementation(() => true)
    }
  })
  instance
    .savePDF('file1')
    .execute(() => {
      expect(instance.page.pdf).toBeCalledWith({ path: 'file1' })
    })
    .savePDF('file2', { format: 'Letter' })
    .execute(() => {
      expect(instance.page.pdf as (typeof instance.page.pdf) &
        jest.MockInstance<any>).toBeCalledWith({
        path: 'file2',
        format: 'Letter'
      })
    })
    .end(done)
})

test('wait for navigation', done => {
  expect.assertions(1)
  const port1 = 2333
  const port2 = 23333
  const server1 = http.createServer((req, res) => res.end(`
    <a href="http://localhost:${port2}"></a>
  `)).listen(port1)
  const server2 = http.createServer((req, res) => res.end('')).listen(port2)

  const instance = new Rize()
  instance
    .goto(`http://localhost:${port1}`)
    .execute(async (browser, page) => {
      await page.evaluate(() => document.querySelector('a').click())
    })
    .waitForNavigation()
    .execute((browser, page) => {
      expect(page.url()).toBe(`http://localhost:${port2}/`)
      server1.close()
      server2.close()
    })
    .end(done)
})

test('wait for an element', async done => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <div></div>
  `)).listen(port)

  const instance = new Rize()
  instance
    .goto(`http://localhost:${port}`)
    .waitForElement('div')
    .execute(() => {
      server.close()
    })
    .end(done)
})

test('wait for a function and an expression', done => {
  const instance = new Rize()
  instance
    .waitForEvaluation(() => true)
    .waitForEvaluation('true')
    .end(done)
})

test('authentication', done => {
  expect.assertions(1)
  const instance = new Rize({
    afterLaunched () {
      this.page.authenticate = jest.fn()
    }
  })
  instance
    .withAuth('Tedeza Rize', 'Komichi Aya')
    .execute((browser, page) => {
      expect(page.authenticate).toBeCalledWith({
        username: 'Tedeza Rize',
        password: 'Komichi Aya'
      })
    })
    .end(done)
})

test('set headers', done => {
  expect.assertions(1)
  const instance = new Rize()
  instance
    .execute(() => {
      jest.spyOn(instance.page, 'setExtraHTTPHeaders')
    })
    .withHeaders({ 'X-Requested-With': 'XMLHttpRequest' })
    .execute(() => {
      expect(instance.page.setExtraHTTPHeaders).toBeCalledWith(
        { 'X-Requested-With': 'XMLHttpRequest' }
      )
    })
    .end(done)
})

test('add script tag', done => {
  expect.assertions(1)
  const instance = new Rize()
  instance
    .addScriptTag('content', 'document.body.textContent = "rize"')
    .execute(async (browser, page) => {
      const text = await page.evaluate('document.body.textContent')
      expect(text).toBe('rize')
    })
    .end(done)
})

test('add style tag', done => {
  expect.assertions(1)
  const instance = new Rize()
  instance
    .addStyleTag('content', 'div { font-size: 5px; }')
    .execute(async (browser, page) => {
      const search = await page.evaluate(() => {
        const elements = Array.from(document.children)
        return elements.some(el => el.textContent === 'div { font-size: 5px; }')
      })
      expect(search).toBe(true)
    })
    .end(done)
})

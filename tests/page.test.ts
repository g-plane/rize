import puppeteer from 'puppeteer'
import http from 'http'
import { getPortPromise as getPort } from 'portfinder'
import Rize from 'rize'

test('go to a specified url', async () => {
  expect.assertions(1)
  const instance = new Rize({
    afterLaunched() {
      jest.spyOn(instance.page, 'goto').mockImplementation(() => true)
    }
  })
  await instance
    .goto('url')
    .execute(() => {
      expect(instance.page.goto).toBeCalledWith('url')
    })
    .end()
}, process.env.CI ? 8000 : 5000)

test('open a new page', async () => {
  expect.assertions(7)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end('')).listen(port)
  const instance = new Rize()
  await instance
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
    .end()
})

test('switch page', async () => {
  expect.assertions(2)
  const port = await getPort()
  const server = http.createServer((req, res) => res.end('')).listen(port)
  const instance = new Rize()
  await instance
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
    .end()
})

test('close page', async () => {
  expect.assertions(2)
  const instance = new Rize()
  await instance
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
    .end()
})

test('count pages', async () => {
  const instance = new Rize()
  instance.newPage()
  await expect(instance.pagesCount()).resolves.toBe(2)
  await instance.end()
})

test('go forward', async () => {
  expect.assertions(2)
  const instance = new Rize({
    afterLaunched() {
      jest.spyOn(instance.page, 'goForward').mockImplementation(() => true)
    }
  })
  await instance
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
    .end()
})

test('go back', async () => {
  expect.assertions(2)
  const instance = new Rize({
    afterLaunched() {
      jest.spyOn(instance.page, 'goBack').mockImplementation(() => true)
    }
  })
  await instance
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
    .end()
})

test('refresh page', async () => {
  expect.assertions(2)
  const instance = new Rize({
    afterLaunched() {
      jest.spyOn(instance.page, 'reload').mockImplementation(() => true)
    }
  })
  await instance
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
    .end()
})

test('evaluate a function', async () => {
  expect.assertions(3)
  const instance = new Rize()
  await instance
    .evaluate(text => document.write(`<div>${text}</div>`), 'rize')
    .execute(async (browser, page) => {
      const text = await page.$eval(
        'div',
        element => element.textContent
      )
      expect(text).toBe('rize')
    })
    .evaluate(
      () => {
        const element = document.querySelector('div')
        if (element) {
          element.textContent = 'syaro'
        }
      },
      undefined   // Don't remove it. It is for test coverage.
    )
    .execute(async (browser, page) => {
      const text = await page.$eval(
        'div',
        element => element.textContent
      )
      expect(text).toBe('syaro')
    })
    .evaluate('document.querySelector("div").textContent = "maya"')
    .execute(async (browser, page) => {
      const text = await page.$eval(
        'div',
        element => element.textContent
      )
      expect(text).toBe('maya')
    })
    .end()
})

test('evaluate a funtion and retrieve return value', async () => {
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
  await instance
    .execute(() => server.close())
    .end()
})

test('use user agent', async () => {
  expect.assertions(1)
  const instance = new Rize()
  await instance
    .withUserAgent('Chrome')
    .execute(async () => {
      const ua = await instance.page.evaluate(() => navigator.userAgent)
      expect(ua).toBe('Chrome')
    })
    .end()
})

test('generate a screenshot', async () => {
  expect.assertions(2)
  const instance = new Rize({
    afterLaunched() {
      jest.spyOn(instance.page, 'screenshot').mockImplementation(() => true)
    }
  })
  await instance
    .saveScreenshot('file1')
    .execute(() => {
      expect(instance.page.screenshot).toBeCalledWith({ path: 'file1' })
    })
    .saveScreenshot('file2', { type: 'jpeg' })
    .execute(() => {
      expect(instance.page.screenshot as (typeof instance.page.screenshot) &
        jest.MockInstance<any>).toBeCalledWith({ path: 'file2', type: 'jpeg' })
    })
    .end()
})

test('generate a PDF', async () => {
  expect.assertions(2)
  const instance = new Rize({
    afterLaunched() {
      jest.spyOn(instance.page, 'pdf').mockImplementation(() => true)
    }
  })
  await instance
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
    .end()
})

test('wait for navigation', async () => {
  expect.assertions(1)
  const port1 = 2333
  const port2 = 23333
  const server1 = http.createServer((req, res) => res.end(`
    <a href="http://localhost:${port2}"></a>
  `)).listen(port1)
  const server2 = http.createServer((req, res) => res.end('')).listen(port2)

  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port1}`)
    .execute(async (browser, page) => {
      // Please use `!` operator. Do not use `page.$eval` or `page.click`.
      await page.evaluate(() => document.querySelector('a')!.click())
    })
    .waitForNavigation()
    .execute((browser, page) => {
      expect(page.url()).toBe(`http://localhost:${port2}/`)
      server1.close()
      server2.close()
    })
    .end()
})

test('wait for an element', async () => {
  const port = await getPort()
  const server = http.createServer((req, res) => res.end(`
    <div></div>
  `)).listen(port)

  const instance = new Rize()
  await instance
    .goto(`http://localhost:${port}`)
    .waitForElement('div')
    .execute(() => {
      server.close()
    })
    .end()
})

test('wait for a function and an expression', async () => {
  const instance = new Rize()
  await instance
    .waitForEvaluation(() => true)
    .waitForEvaluation('true')
    .end()
})

test('authentication', async () => {
  expect.assertions(1)
  const instance = new Rize({
    afterLaunched() {
      this.page.authenticate = jest.fn()
    }
  })
  await instance
    .withAuth('Tedeza Rize', 'Komichi Aya')
    .execute((browser, page) => {
      expect(page.authenticate).toBeCalledWith({
        username: 'Tedeza Rize',
        password: 'Komichi Aya'
      })
    })
    .end()
})

test('set headers', async () => {
  expect.assertions(1)
  const instance = new Rize()
  await instance
    .execute(() => {
      jest.spyOn(instance.page, 'setExtraHTTPHeaders')
    })
    .withHeaders({ 'X-Requested-With': 'XMLHttpRequest' })
    .execute(() => {
      expect(instance.page.setExtraHTTPHeaders).toBeCalledWith(
        { 'X-Requested-With': 'XMLHttpRequest' }
      )
    })
    .end()
})

test('add script tag', async () => {
  expect.assertions(2)
  const instance = new Rize()
  await instance
    .addScriptTag('content', 'document.body.textContent = "rize"')
    .execute(async (browser, page) => {
      const text = await page.evaluate('document.body.textContent')
      expect(text).toBe('rize')
    })
    .addScriptTag('content', '', { esModule: true })
    .execute(async (browser, page) => {
      const hasTag: boolean = await page.$$eval(
        'script',
        tags => Array
          .from(tags)
          .some(tag => tag.getAttribute('type') === 'module')
      )
      expect(hasTag).toBe(true)
    })
    .end()
})

test('add style tag', async () => {
  expect.assertions(1)
  const instance = new Rize()
  await instance
    .addStyleTag('content', 'div { font-size: 5px; }')
    .execute(async (browser, page) => {
      const search = await page.evaluate(() => {
        const elements = Array.from(document.children)
        return elements.some(el => el.textContent === 'div { font-size: 5px; }')
      })
      expect(search).toBe(true)
    })
    .end()
})

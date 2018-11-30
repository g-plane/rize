import puppeteer from 'puppeteer'
import Infrastructure from './infrastructure'
import { prepareStackTrace } from './utils/error'

function serializeArg(arg: any) {
  return arg === undefined ? 'undefined' : JSON.stringify(arg)
}

function serializeFunc(func: Function, ...rest: any[]) {
  return `(${func})(${rest.map(serializeArg).join(',')})`
}

export default class Page extends Infrastructure {
  goto(url: string) {
    this.push(async () => await this.page.goto(url), prepareStackTrace())

    return this
  }

  newPage(
    name = '',
    options: { force?: boolean, stayCurrent?: boolean } = {}
  ) {
    this.push(async () => {
      let index = this.pages.findIndex(page => page.name === name)
      if (index !== -1) {
        if (options.force) {
          /* tslint:disable-next-line no-floating-promises */
          this.pages[index].page.close()
          this.pages[index].page = await this.browser.newPage()
        }
      } else {
        this.pages.push({ name, page: await this.browser.newPage() })
        index = this.pages.length - 1
      }

      if (!options.stayCurrent) {
        this.currentPageIndex = index
      }
    }, prepareStackTrace())

    return this
  }

  switchPage(name: string | number) {
    this.push(
      () => {
        if (typeof name === 'string') {
          const index = this.pages.findIndex(page => page.name === name)
          /* istanbul ignore if */
          if (index === -1) {
            throw new Error(`No such page whose name is "${name}".`)
          } else {
            this.currentPageIndex = index
          }
        } else {
          this.currentPageIndex = name
        }
      },
      prepareStackTrace()
    )

    return this
  }

  closePage(name?: string) {
    this.push(async () => {
      let index: number

      if (name) {
        index = this.pages.findIndex(page => page.name === name)
        if (index === -1) {
          return
        } else {
          await this.pages[index].page.close()
          if (this.currentPageIndex === index) {
            this.currentPageIndex = index - 1
          }
          this.pages.splice(index, 1)
        }
      } else {
        await this.page.close()
        index = this.pages.findIndex(({ page }) => page === this.page)
        this.pages.splice(index, 1)
        this.currentPageIndex = index - 1
      }
    }, prepareStackTrace())

    return this
  }

  pagesCount() {
    return new Promise<number>(
      fulfill => this.push(() => fulfill(this.pages.length))
    )
  }

  forward(options?: puppeteer.NavigationOptions) {
    this.push(async () => {
      await this.page.goForward(options)
    }, prepareStackTrace())

    return this
  }

  back(options?: puppeteer.NavigationOptions) {
    this.push(async () => await this.page.goBack(options), prepareStackTrace())

    return this
  }

  refresh(options?: puppeteer.NavigationOptions) {
    this.push(async () => await this.page.reload(options), prepareStackTrace())

    return this
  }

  evaluate<Arg extends any[]>(
    fn: ((...args: Arg) => void) | string,
    ...args: Arg
  ) {
    const stringified = typeof fn === 'string' ? fn : serializeFunc(fn, ...args)

    this.push(
      async () => await this.page.evaluate(stringified),
      prepareStackTrace()
    )

    return this
  }

  evaluateWithReturn<Arg extends any[], Ret = any>(
    fn: ((...args: Arg) => Ret) | string,
    ...args: Arg
  ) {
    const stringified = typeof fn === 'string' ? fn : serializeFunc(fn, ...args)

    return new Promise<Ret>(resolve => {
      this.push(async () => {
        const returnValue: Ret = await this.page.evaluate(stringified)
        resolve(returnValue)
      })
    })
  }

  withUserAgent(userAgent: string) {
    this.push(async () => {
      await this.page.setUserAgent(userAgent)
    }, prepareStackTrace())

    return this
  }

  saveScreenshot(path: string, options?: puppeteer.ScreenshotOptions) {
    this.push(async () => {
      await this.page.screenshot({ ...options, path })
    }, prepareStackTrace())

    return this
  }

  savePDF(path: string, options?: puppeteer.PDFOptions) {
    this.push(async () => {
      await this.page.pdf({ ...options, path })
    }, prepareStackTrace())

    return this
  }

  waitForNavigation(timeout?: number) {
    this.push(
      async () => await this.page.waitForNavigation({ timeout }),
      prepareStackTrace()
    )

    return this
  }

  waitForElement(selector: string, timeout?: number) {
    this.push(async () => await this.page.waitForSelector(
      selector,
      { timeout }
    ), prepareStackTrace())

    return this
  }

  waitForEvaluation<Arg extends any[]>(
    fn: string | ((...args: Arg) => void),
    timeout?: number,
    ...args: Arg
  ) {
    const stringified = typeof fn === 'string' ? fn : serializeFunc(fn, ...args)

    this.push(
      async () => await this.page.waitForFunction(stringified, { timeout }),
      prepareStackTrace()
    )

    return this
  }

  withAuth(username: string, password: string) {
    this.push(
      async () => await this.page.authenticate({ username, password }),
      prepareStackTrace()
    )

    return this
  }

  withHeaders(headers: puppeteer.Headers) {
    this.push(
      async () => await this.page.setExtraHTTPHeaders(headers),
      prepareStackTrace()
    )

    return this
  }

  addScriptTag(
    type: 'url' | 'path' | 'content',
    value: string,
    options: { esModule: boolean } = { esModule: false }
  ) {
    this.push(
      async () => await this.page.addScriptTag({
        [type]: value,
        type: options.esModule ? 'module' : undefined
      }),
      prepareStackTrace()
    )

    return this
  }

  addStyleTag(type: keyof puppeteer.StyleTagOptions, value: string) {
    this.push(
      async () => await this.page.addStyleTag({ [type]: value }),
      prepareStackTrace()
    )

    return this
  }
}

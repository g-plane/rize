import puppeteer from 'puppeteer'
import RizeInstance from './index'

function serializeArg (arg) {
  return arg === undefined ? 'undefined' : JSON.stringify(arg)
}

function serializeFunc (func: Function, ...rest) {
  return `(${func})(${rest.map(serializeArg).join(',')})`
}

export default function mixinPage (Rize: typeof RizeInstance) {
  Rize.prototype.goto = function (url: string) {
    this.push(async () => {
      await this.page.goto(url)
    })

    return this
  }

  Rize.prototype.closePage = function () {
    this.push(async () => {
      await this.page.close()
    })

    return this
  }

  Rize.prototype.forward = function (options?: puppeteer.NavigationOptions) {
    this.push(async () => {
      await this.page.goForward(options)
    })

    return this
  }

  Rize.prototype.back = function (options?: puppeteer.NavigationOptions) {
    this.push(async () => {
      await this.page.goBack(options)
    })

    return this
  }

  Rize.prototype.refresh = function (options?: puppeteer.NavigationOptions) {
    this.push(async () => {
      await this.page.reload(options)
    })

    return this
  }

  Rize.prototype.evaluate = function (fn: Function | string, ...args) {
    const stringified = typeof fn === 'string' ? fn : serializeFunc(fn, ...args)

    this.push(async () => await this.page.evaluate(stringified))

    return this
  }

  Rize.prototype.evaluateWithReturn = function <T = any> (
    fn: ((...args) => T) | string,
    ...args
  ) {
    const stringified = typeof fn === 'string' ? fn : serializeFunc(fn, ...args)

    return new Promise<T>(resolve => {
      this.push(async () => {
        const returnValue: T = await this.page.evaluate(stringified)
        resolve(returnValue)
      })
    })
  }

  Rize.prototype.withUserAgent = function (userAgent: string) {
    this.push(async () => {
      await this.page.setUserAgent(userAgent)
    })

    return this
  }

  Rize.prototype.saveScreenshot = function (
    path: string,
    options?: puppeteer.ScreenshotOptions
  ) {
    this.push(async () => {
      await this.page.screenshot({ ...options, path })
    })

    return this
  }

  Rize.prototype.savePDF = function (
    path: string,
    options?: puppeteer.PDFOptions
  ) {
    this.push(async () => {
      await this.page.pdf({ ...options, path })
    })

    return this
  }

  Rize.prototype.waitForNavigation = function (timeout?: number) {
    this.push(async () => await this.page.waitForNavigation({ timeout }))

    return this
  }

  Rize.prototype.waitForElement = function (
    selector: string,
    timeout?: number
  ) {
    this.push(async () => await this.page.waitForSelector(
      selector,
      { timeout }
    ))

    return this
  }

  Rize.prototype.waitForEvaluation = function (
    fn: string | Function,
    timeout?: number,
    ...args
  ) {
    const stringified = typeof fn === 'string' ? fn : serializeFunc(fn, ...args)

    this.push(
      async () => await this.page.waitForFunction(stringified, { timeout })
    )

    return this
  }

  Rize.prototype.withAuth = function (username: string, password: string) {
    this.push(async () => await this.page.authenticate({ username, password }))

    return this
  }
}

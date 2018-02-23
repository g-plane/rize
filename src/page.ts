import puppeteer from 'puppeteer'
import RizeInstance from './index'

export default function mixinPage (Rize: typeof RizeInstance) {
  Rize.prototype.goto = function (url: string) {
    this.push(async () => {
      await this.page.goto(url)
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
}

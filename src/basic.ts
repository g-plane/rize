import puppeteer from 'puppeteer'
import Infrastructure from './infrastructure'
import { prepareStackTrace } from './utils/error'

export default class Basic extends Infrastructure {
  sleep (ms: number) {
    this.push(async () => await this.page.waitFor(ms), prepareStackTrace())

    return this
  }

  execute (
    fn: (
      this: Infrastructure,
      browser: puppeteer.Browser,
      page: puppeteer.Page,
      ...args
    ) => void
  ) {
    this.push(() => fn.call(this, this.browser, this.page), prepareStackTrace())

    return this
  }

  end (): Promise<void>

  end (callback: (...args) => any): void

  end (callback?: (...args) => any): Promise<void> | void {
    this.push(this.hooks.beforeExit)

    if (callback) {
      this.push(async () => {
        await this.browser.close()
        callback()
      }, prepareStackTrace())
      return
    } else {
      return new Promise((resolve, reject) => {
        this.push(async () => {
          try {
            await this.browser.close()
            resolve()
          } catch (error) {
            /* istanbul ignore next */
            reject(error)
          }
        }, prepareStackTrace())
      })
    }
  }
}

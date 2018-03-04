import puppeteer from 'puppeteer'
import Infrastructure from './infrastructure'

export default class Basic extends Infrastructure {
  sleep (ms: number) {
    this.push(async () => {
      await this.page.waitFor(ms)
    })

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
    this.push(() => fn.call(this, this.browser, this.page))

    return this
  }

  end (): Promise<void>

  end (callback: (...args) => any): void

  end (callback?: (...args) => any): Promise<void> | void {
    if (callback) {
      this.push(async () => {
        await this.browser.close()
        callback()
      })
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
        })
      })
    }
  }
}

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

  end (callback?: (...args) => any) {
    this.push(async () => {
      await this.browser.close()
      callback && callback()
    })
  }
}

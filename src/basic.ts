import RizeInstance from './index'

export default function mixinBasic (Rize: typeof RizeInstance) {
  Rize.prototype.goto = function (url: string) {
    this.push(async () => {
      await this.page.goto(url)
    })

    return this
  }

  Rize.prototype.sleep = function (ms: number) {
    this.push(async () => {
      await this.page.waitFor(ms)
    })

    return this
  }

  Rize.prototype.withUserAgent = function (userAgent: string) {
    this.push(async () => {
      await this.page.setUserAgent(userAgent)
    })

    return this
  }

  Rize.prototype.execute = function (fn: (args?: any[]) => void) {
    this.push(fn)

    return this
  }

  Rize.prototype.closePage = function () {
    this.push(async () => {
      await this.page.close()
    })

    return this
  }

  Rize.prototype.end = function (callback?: (args?: any[]) => void) {
    this.push(async () => {
      await this.browser.close()
      callback && callback()
    })
  }
}
